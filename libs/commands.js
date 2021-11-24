import { Message, MessageEmbed } from 'discord.js'
import fs from 'fs'
import { aggregateUsers, existingRoles, isAdmin, isDMs } from './discordWrapper.js'
import fetch from './fetch.js'
import vault from './vault.js'

/**
 * @param {Message} msg The message to access server data.
 * @param {string} action The action to perform.
 * @param {Array} params The params to be used.
 */
function ROLLER(msg, action, params) {
    if (isDMs(msg)) return "Is DMs."
    if (!isAdmin(msg)) return "Not admin."

    switch (action) {
        case 'GE':
            aggregateUsers(msg.guild, params[0]).then(
                users => {
                    let operated = false
                    const roles = existingRoles(msg, params[1])

                    if (!roles[0]) return "No roles."

                    for (const role of roles)
                        for (const user of users) {
                            user.roles.add(msg.guild.roles.cache.find(e => e.name === role))
                            operated = true
                        }

                    operated ? msg.channel.send(`:small_blue_diamond: Gav rollerna <\`${roles.join("\`, \`")}\`> till:\n\`\`\`\n${users.map(user => user.displayName).join(", ")}\n\`\`\``) : null
                }
            )
            break

        case 'TA':
            aggregateUsers(msg.guild, params[0]).then(
                users => {
                    let operated = false
                    const roles = existingRoles(msg, params[1])

                    if (!roles[0]) return "No roles."

                    for (const role of roles) 
                        for (const user of users) {
                            user.roles.remove(msg.guild.roles.cache.find(e => e.name === role))
                            operated = true
                        }

                    operated ? msg.channel.send(`:small_orange_diamond: Tog bort rollerna <\`${roles.join("\`, \`")}\`> från:\n\`\`\`\n${users.map(user => user.displayName).join(", ")}\n\`\`\``) : null
                }
            )
            break

        case 'TILLDELA':
            {
                const classCode = params[0][0]
                let data = vault.open()

                data.classes || (data.classes = {})

                let roles = []
                for (const role of params[1])
                    existingRoles(msg, [ role ])[0] ? roles.push(role) : null

                data.classes[classCode] = roles
                ROLLER(msg, 'GE', [ [ classCode ], roles ])
                msg.channel.send(`:small_blue_diamond: Kommer tilldela \`${classCode}\` rollerna:\n\`\`\`\n${roles.join(", ")}\n\`\`\``)

                vault.save(data)
            }

            break

        case 'AVSKAFFA':
            {
                const classCodes = params[0]
                let data = vault.open()

                for (const classCode of classCodes) {
                    data.classes || (data.classes = {})
                    const classes = data.classes[classCode]

                    if (!classes || !classes[0]) {
                        msg.channel.send(`:warning: **ERROR:** Det finns ingen regel definierad för \`${classCode}\`!\n:bulb: Du kan definiera en regel med \`ROLLER TILLDELA <KLASS> <ROLLER>\`.`)
                        break
                    }

                    ROLLER(msg, 'TA', [ [ classCode ], classes ])
                    msg.channel.send(`:small_orange_diamond: Kommer avskaffa \`${classCode}\` rollerna:\n\`\`\`\n${classes.join(", ")}\n\`\`\``)

                    delete data.classes[classCode]
                }
    
                vault.save(data)
            }
            break

        case 'LISTA':
            const data = vault.open()
            let message = ":information_source: Du har följande regler definierade:"

            for (const rule in data.classes)
                message += `\n\`${rule}\` som innefattar rollerna:\n\`\`\`${data.classes[rule].join(", ")}\n\`\`\``

            msg.channel.send(message)
            break

        default:
            break
    }
}

/**
 * @param {Message} msg The message to access server data.
 * @param {string} action The action to perform.
 */
function IMPORTERA(msg, action) {
    if (isDMs(msg)) return "Is DMs."
    if (!isAdmin(msg)) return "Not admin."

    const attachment = msg.attachments.first()
    if (!attachment) return msg.reply(":bulb: Du behöver bifoga en CSV-fil med klasserna du vill importera!")

    switch (action) {
        case 'REGLER':
            fetch(attachment.url, false).then(
                csv => {
                    const [ names, ...rest ] = csv.split(/[\r\n]+/)
                    const keys = names.split(',')
                    const rows = rest.map(e => e.split(','))
                    let rules = {}
        
                    for (const key of keys)
                        rules[key] = []
        
                    for (const row of rows)
                        for (const i in row)
                            row[i] ? rules[keys[i]].push(row[i]) : null
        
                    for (const rule in rules)
                        rules[rule][0] ? ROLLER(msg, 'TILLDELA', [ [ rule ], rules[rule] ]) : null
                }
            )
            break

        case 'FILTER':
            fetch(attachment.url, false).then(
                list => {
                    let data = vault.open()
                    data.badWords = `(${list.replace(/[\r\n]+/g, "|")})`.replace(/\w(?![\|\)])/g, "$&\\s*(.|\\w)?\\s*")
                    data.badWordsList = list.replace(/[\r\n]+/g, "; ")
                    vault.save(data)

                    msg.channel.send(`Importerade ny filter-lista. Den är:\n\`\`\`${list.replace(/[\r\n]+/g, "; ")}\`\`\``)
                    msg.deletable ? msg.delete() : null
                }
            )
            break

        default:
            break
    }
}

/**
 * @param {Message} msg The message to access server data.
 */
function EXPORTERA(msg) {
    if (isDMs(msg)) return "Is DMs."
    if (!isAdmin(msg)) return "Not admin."

    let members = {}

    msg.guild.members.fetch().then(
        guildMembers => {
            for (const memberX of guildMembers) {
                const member = memberX[1]
                members[member.displayName] = member.roles.cache.filter(r => r.name !== "@everyone").map(r => r.name)
            }

            let lengths = []
            Object.keys(members).forEach(name => lengths.push(members[name].length))
            const length = Math.max(...lengths)

            let csv = ""

            const names = Object.keys(members)
            for (const name of names)
                csv += `${name},`

            csv += "\n"

            for (let i = 0; i < length; ++i) {
                for (const name of names)
                    csv += `${members[name][i] ? members[name][i] : ''},`
                csv += "\n"
            }

            csv = csv.replace(/,\n/g, "\n")

            fs.writeFileSync('./temp-csv-all-members-roles.csv', csv)
            msg.author.send({ content: ":file_folder: Här är en export av alla medlemmar och deras roller!", files: ['./temp-csv-all-members-roles.csv'] })
                .then(() => fs.unlinkSync('./temp-csv-all-members-roles.csv'))
        }
    )
}

/**
 * @param {Message} msg The message to access server data.
 * @param {string} action The action to perform.
 * @param {Array} params The params to be used.
 */
function KUL(msg, action, params) {
    switch (action) {
        case 'MOTIVERA':
            fetch("https://zenquotes.io/api/random", true).then(
                quote => {
                    msg.author.send(`> ${quote[0].q}\n-- ${quote[0].a}`)
                    msg.deletable ? msg.delete() : null
                }
            )
            break

        case 'PAPPASKÄMT':
            fetch("https://icanhazdadjoke.com/", true, {'Accept': 'application/json'}).then(
                dadJoke => {
                    msg.author.send(`${dadJoke.joke}\n:joy:`)
                    msg.deletable ? msg.delete() : null
                }
            )
            break

        case 'FAKTA':
            fetch("https://uselessfacts.jsph.pl/random.json?language=en", true).then(
                fact => {
                    msg.author.send(`${fact.text}\n\nSource: ${fact.source_url}`)
                    msg.deletable ? msg.delete() : null
                }
            )
            break

        case 'LYRICS':
            const artist = params[0]
            const song = params[1]
            if (!params || !artist || !song)
                return msg.reply("Du måste specifiera en artist och en sång: `KUL LYRICS 'artist' 'sång'`")

            fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`, true).then(
                lyrics => {
                    if (lyrics.error)
                        return msg.reply(`:frowning: Hittade inte \`${song}\` av \`${artist}\`!`)

                    if (lyrics.lyrics.length > 1500) {
                        msg.author.send(`:musical_note: ${artist} - ${song}`)
                        for (let i = 0; i < lyrics.lyrics.length / 1500; ++i)
                            msg.author.send(`\`\`\`${lyrics.lyrics.substring(i * 1500, (i + 1) * 1500).replace(/Paroles de la chanson[\w\s]*$/gm, "")}\n\`\`\``)
                    } else {
                        msg.author.send(`:musical_note: ${artist} - ${song}\n\`\`\`\n${lyrics.lyrics.replace(/Paroles de la chanson[\w\s]*$/gm, "")}\n\`\`\``)
                    }

                    msg.deletable ? msg.delete() : null
                }
            )
            break

        case 'DIKT':
            fetch(`https://poetrydb.org/linecount,random/${Math.round(Math.random() * 16 + 8)};1`, true).then(
                poems => {
                    const poem = poems[0]
                    msg.author.send(`> ${poem.lines.join("\n> ")}\n\n*${poem.title}* by ${poem.author}\n\n`)
                    msg.deletable ? msg.delete() : null
                }
            )
            break

        case 'PIXLAR': case 'NOISE':
            fetch(`https://php-noise.com/noise.php?hex=${params[0] ?? ''}&borderWidth=${action === 'NOISE' ? '15' : '0'}&tiles=50&tileSize=20&json`, true).then(
                data => {
                    msg.author.send({ files: [data.uri] })
                    msg.deletable ? msg.delete() : null
                }
            )
            break

        case 'FÄRG':
            fetch(`http://colormind.io/api/'`, false).then(
                data => {
                    msg.author.send(data)
                    msg.deletable ? msg.delete() : null
                }
            )
            break

        default:
            break
    }
}

/**
 * @param {Message} msg The message to access server data.
 */
function HJÄLP(msg) {
    msg.author.send(`${fs.readFileSync('help.md', { encoding: 'utf-8' })}\n${msg.author}`)
    msg.deletable ? msg.delete() : null
} 




export default {
    ROLLER,
    IMPORTERA,
    EXPORTERA,
    KUL,
    HJÄLP,
}