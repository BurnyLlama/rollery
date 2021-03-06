import { Message } from 'discord.js'
import commands from './commands.js'
import { MAN_PAGES, RECIPES } from './rules.js'

/**
 * This function runs a statement.
 * @param {array} statement The statement to be ran.
 * @param {Message} msg The message sent so as to be able to access channels.
 */
export default function runner(statement, msg) {
    if (statement[0].type !== 'KEY_WORD')
        return msg.reply(`:bulb: Första ordet ska vara ett kommando! Använd \`HJÄLP\`-kommandot för att se alla kommandon.`)

    const command = statement[0].value
    const recipe = new RegExp(`^${RECIPES[command]}$`)
    const input = statement.map(e => e.type).join(" ")

    if (!input.match(recipe)) {
        msg.reply(`:bulb: Kommandot \`${command}\` används: \`${MAN_PAGES[command]}\``)
        msg.deletable ? msg.delete() : null
        return
    }

    const action = statement.find(e => e.type === 'ACTION_WORD')?.value ?? null
    const params = statement.filter(e => e.type === 'PARAM').map(e => e.value) ?? null

    commands[command](msg, action, params)
}