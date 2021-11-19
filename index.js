import { config as loadEnv } from 'dotenv'
import { Client, Intents } from 'discord.js'
import lexer from './libs/lexer.js'
import parser from './libs/parser.js'
import runner from './libs/runner.js'


loadEnv()

const CMD_PREFIX = "%"

const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS ] })


client.on('messageCreate', msg => {
    const isCommand = msg.toString().startsWith(CMD_PREFIX)

    if (!isCommand) return "Not a command!"

    const rawMsg = msg.toString()                                   // *- I don't see why I couldn't combine these regexes... :/
    const command = rawMsg.replace(RegExp(`^${CMD_PREFIX}`), "").replace(/^\s*/g, "")

    const tokens = lexer(command, err => msg.channel.send(err))
    if (!tokens[0]) return console.log("Error while lexing...")

    const statement = parser(tokens, err => msg.channel.send(err))
    if (!statement[0]) return console.log("Error while parsing...")

    runner(statement, msg)
})

client.login(process.env.TOKEN)


client.on('ready', () => console.log(`I am in! //${client.user.tag}`))