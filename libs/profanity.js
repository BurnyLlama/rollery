import { Client, Message } from 'discord.js'
import vault from './vault.js'

const ADMIN_ROLE = "Lärare"

/**
 * @param {Message} msg
 * @param {Client} client
 */
export default function profanityFilter(msg, client) {
    if (msg.channel.type === 'DM') return "Don't care about DMs."

    if (msg.author.username === client.user.username)
        return "Is myself."

    const badWords = vault.open().badWords
    const filter = new RegExp(badWords, "gi")

    console.log({ badWords, filter })
    if (msg.content.match(filter))
        msg.channel.send(`Mitt filter är triggat!\n\n${msg.author} sade vid \`${msg.createdAt.toLocaleString()}\`:\n> ${msg.content.replace(filter, "**$&**")}\n\n${msg.guild.roles.cache.find(role => role.name === ADMIN_ROLE)}`)
}