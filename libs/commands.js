import { Message } from 'discord.js'
import fs from 'fs'
import https from 'https'
import { aggregateUsers, isAdmin } from './discordWrapper.js'
import vault from './vault.js'

/**
 * @param {Message} msg The message to access server data.
 * @param {string} action The action to perform.
 * @param {Array} params The params to be used.
 */
function ROLLER(msg, action, params) {
    if (!isAdmin(msg)) return "Not admin."

    switch (action) {
        case 'GE':
            aggregateUsers(msg.guild, params[0]).then(
                users => {
                    for (const role of params[1]) {
                        if (!msg.guild.roles.cache.some(e => e.name === role)) {
                            msg.channel.send(`:warning: **Varning:** Rollen \`${role}\` finns inte! (Om du spefierade andra roller så proceseras de ändå.)`)
                            continue
                        }

                        for (const user of users) {
                            user.roles.add(msg.guild.roles.cache.find(e => e.name === role))
                        }
                    }

                    msg.channel.send(`:small_blue_diamond: Gav rollerna <\`${params[1].join("\`, \`")}\`> till:\n\`\`\`\n${users.map(user => user.displayName).join(", ")}\n\`\`\``)
                }
            )
            break

        case 'TA':
            aggregateUsers(msg.guild, params[0]).then(
                users => {
                    for (const role of params[1]) {
                        if (!msg.guild.roles.cache.some(e => e.name === role)) {
                            msg.channel.send(`:warning: **Varning:** Rollen \`${role}\` finns inte! (Om du spefierade andra roller så proceseras de ändå.)`)
                            continue
                        }

                        for (const user of users) {
                            user.roles.remove(msg.guild.roles.cache.find(e => e.name === role))
                        }
                    }

                    msg.channel.send(`:small_orange_diamond: Tog bort rollerna <\`${params[1].join("\`, \`")}\`> från:\n\`\`\`\n${users.map(user => user.displayName).join(", ")}\n\`\`\``)
                }
            )
            break

        case 'TILLDELA':
            {
                const classCode = params[0][0]
                let data = vault.open()

                data.classes || (data.classes = {})
                data.classes[classCode] = params[1]
                ROLLER(msg, 'GE', [ [ classCode ], params[1] ])
                msg.channel.send(`:small_blue_diamond: Kommer tilldela \`${classCode}\` rollerna:\n\`\`\`\n${params[1].join(", ")}\n\`\`\``)

                vault.save(data)
            }

            break

        case 'AVSKAFFA':
            {
                const classCode = params[0][0]
                let data = vault.open()
    
                data.classes || (data.classes = {})
                const classes = data.classes[classCode]

                if (!classes || !classes[0]) {
                    msg.channel.send(`:warning: **ERROR:** Det finns ingen regel definierad för \`${classCode}\`!\n:bulb: Du kan definiera en regel med \`ROLLER TILLDELA <KLASS> <ROLLER>\`.`)
                    break
                }

                ROLLER(msg, 'TA', [ [ classCode ], classes ])
                msg.channel.send(`:small_orange_diamond: Kommer avskaffa \`${classCode}\` rollerna:\n\`\`\`\n${classes.join(", ")}\n\`\`\``)

                delete data.classes[classCode]
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
function MOTIVERA(msg) {
    https.get("https://zenquotes.io/api/random", res => {
        let data = ""

        res.on('data', fragment => data += fragment)

        res.on('end', () => {
            const quote = JSON.parse(data)
            msg.member.send(`> ${quote[0].q}\n-- ${quote[0].a}`)
            msg.delete()
        })
    })
}

/**
 * @param {Message} msg The message to access server data.
 */
function HJÄLP(msg) {
    msg.member.send(`${fs.readFileSync('help.md', { encoding: 'utf-8' })}\n${msg.member.user}`)
    msg.deletable ? msg.delete() : null
} 




export default {
    ROLLER,
    MOTIVERA,
    HJÄLP,
}