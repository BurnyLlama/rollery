import { Message } from 'discord.js'
import fs from 'fs'
import https from 'https'
import { aggregateUsers } from './discordWrapper.js'

/**
 * @param {Message} msg The message to access server data.
 * @param {string} action The action to perform.
 * @param {Array} params The params to be used.
 */
function ROLLER(msg, action, params) {
    const actions = {
        'GE': 'add',
        'TA': 'remove'
    }

    const users = aggregateUsers(msg.guild, params[0])
    
    for (const role of params[1]) {
        if (!msg.guild.roles.cache.some(e => e.name === role)) {
            msg.channel.send(`:octagonal_sign: **ERROR:** Rollen ${role} finns inte! (Om du spefierade andra roller så läggs de andra rollerna till.)`)
            continue
        }

        for (const user of users) {
            user.roles[actions[action]](msg.guild.roles.cache.find(e => e.name === role))
        }
    }

    msg.channel.send(`Hittade användare: ${users.map(user => user.displayName).join(", ")}`)
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
    msg.channel.send(fs.readFileSync('help.md', { encoding: 'utf-8' }))
} 




export default {
    ROLLER,
    HJÄLP,
    MOTIVERA
}