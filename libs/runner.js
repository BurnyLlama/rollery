import { Message } from 'discord.js'
import commands from './commands.js'
import { MAN_PAGES, RECIPES } from './rules.js'

/**
 * This function runs a statement.
 * @param {array} statement The statement to be ran.
 * @param {Message} msg The message sent so as to be able to access channels.
 */
export default function runner(statement, msg) {
    const command = statement[0].value
    const recipe = RECIPES[command].join("-")
    const input = statement.map(e => e.type).join("-")

    if (input !== recipe) {
        msg.member.send(`:bulb: Kommandot \`${command}\` används: \`${MAN_PAGES[command]}\``)
        msg.deletable ? msg.delete() : null
        return
    }

    const action = statement.find(e => e.type === 'ACTION_WORD')?.value ?? null
    const params = statement.filter(e => e.type === 'PARAM').map(e => e.value) ?? null

    commands[command](msg, action, params)
}