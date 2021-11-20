import { Message } from 'discord.js'
import fs from 'fs'
import https from 'https'
import { aggregateUsers, existingRoles, isAdmin, isDMs } from './discordWrapper.js'
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

        default:
            break
    }
}

/**
 * @param {Message} msg The message to access server data.
 */
 function IMPORTERA(msg) {
    if (isDMs(msg)) return "Is DMs."
    if (!isAdmin(msg)) return "Not admin."
    const attachment = msg.attachments.first()
    if (!attachment) return msg.reply(":bulb: Du behöver bifoga en CSV-fil med klasserna du vill importera!")

    https.get(
        attachment.url,
        // 'https://cdn.discordapp.com/attachments/910920254757171200/911671597381869578/discord_bot_-_ALLA.csv',
        res => {
            let csv = ""

            res.on('data', data => csv += data)

            res.on(
                'end',
                () => {
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
        }
    )
}

/**
 * @param {Message} msg The message to access server data.
 */
function MOTIVERA(msg) {
    https.get(
        "https://zenquotes.io/api/random",
        res => {
            let data = ""

            res.on('data', fragment => data += fragment)

            res.on(
                'end',
                () => {
                    const quote = JSON.parse(data)
                    msg.author.send(`> ${quote[0].q}\n-- ${quote[0].a}`)
                    msg.deletable ? msg.delete() : null
                }
            )
        }
    )
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
    MOTIVERA,
    HJÄLP,
}