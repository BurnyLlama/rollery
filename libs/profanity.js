import { Client, Message } from 'discord.js'
import { isDMs } from './discordWrapper.js'
import vault from './vault.js'

const ADMIN_ROLE = "Lärare"

/**
 * @param {Message} msg
 * @param {Client} client
 */
export default function profanityFilter(msg, client) {
    if (isDMs(msg)) return "Don't care about DMs."

    if (msg.author.tag === client.user.tag)
        return "Is myself."

    const badWords = vault.open().badWords
    // const wordFilter = `(${badWords.split("\n").join("|")})`.split("").join("\\s*(.|\\w)?\\s*")
    const filter = new RegExp(badWords, "gi")

    if (msg.content.match(filter))
        msg.channel.send(`Mitt filter är triggat!\n\n${msg.author} sade vid \`${msg.createdAt.toLocaleString()}\`:\n> ${msg.content.replace(filter, "**$&**")}\n\n${msg.guild.roles.cache.find(role => role.name === ADMIN_ROLE)}`)
}