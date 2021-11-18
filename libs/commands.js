import { Message } from 'discord.js'
import fs from 'fs'
import https from 'https'

/**
 * @param {Message} msg The message to access server data.
 * @param {string} action The action to perform.
 * @param {Array} params The params to be used.
 */
function ROLLER(msg, action, params) {
    msg.channel.send(fs.readFileSync('help.md', { encoding: 'utf-8' })).catch(err => null)
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
            msg.reply(`> ${quote[0].q}\n-- ${quote[0].a}`)
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