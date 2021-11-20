import { config as loadEnv } from 'dotenv'
import { Client, Message } from 'discord.js'
import lexer from './libs/lexer.js'
import parser from './libs/parser.js'
import runner from './libs/runner.js'
import vault from './libs/vault.js'


loadEnv()

const CMD_PREFIX = "%"
const DEBUG_MODE = true

const client = new Client({
    intents: [ 
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGES"
    ],
    partials: [
        "CHANNEL"
    ]
})


/**
 * @param {Message} msg
 */
function debug(msg, action) {
    console.dir(action)
    switch (action) {
        case "JOIN":
            client.emit("guildMemberAdd", msg.member)
            break
    
        default:
            break
    }
    msg.deletable ? msg.delete() : null
}



client.on('messageCreate', msg => {
    if (msg.content.startsWith("DEBUG") && DEBUG_MODE)
        return debug(msg, msg.content.split(" ")[1])

    const isCommand = msg.toString().startsWith(CMD_PREFIX) && msg.channel.type === "GUILD_TEXT"
    if (!isCommand) return "Not a command!"

    const rawMsg = msg.toString()                                   // *- I don't see why I couldn't combine these regexes... :/
    const command = rawMsg.replace(RegExp(`^${CMD_PREFIX}`), "").replace(/^\s*/g, "")

    const tokens = lexer(command, err => msg.channel.send(err))
    if (!tokens[0]) return console.log("Error while lexing...")

    const statement = parser(tokens, err => msg.channel.send(err))
    if (!statement[0]) return console.log("Error while parsing...")

    runner(statement, msg)
})

client.on(
    'guildMemberAdd',
    member => {
        member.user.send(`Välkommen ${member.user}!\nVänligen välj en klass genom att skriva \`KLASSKOD Namn Efternamn\`. Ex: \`SY20 Fred Fredriksson\``)
        const listener = msg => {
            if (msg.author.tag === member.user.tag) {
                const [ code, ...nameComponents ] = msg.content.split(" ")
                const name = nameComponents.join(" ")

                console.log({ code, name })
                const data = vault.open()
                if (!data.classes[code])
                    return msg.reply(`:warning: **ERROR:** Klassen ${code} finns inte! Välj någon av: \`${Object.keys(data.classes ?? {}).join("\`, \`")}\``)

                member.setNickname(`${name} ${code}`)
                for (const role of data.classes[code]) {
                    if (!member.guild.roles.cache.some(e => e.name === role)) {
                        console.log({ skipped: role})
                        continue
                    }
                    member.roles.add(member.guild.roles.cache.find(r => r.name === role))
                    console.log({ added: role})
                }
                member.roles.add(member.guild.roles.cache.find(r => r.name === "Elever"))

                member.send(`Välkommen ${name}! Du har tillgång till: \`${data.classes[code].join("\`, \`")}\`\nSaknas en klass? Skriv till din lärare eller IT-admin.\n${member.user}`)
                client.removeListener('messageCreate', listener)
            }
        }

        client.on('messageCreate', listener)
    }
)


client.login(process.env.TOKEN)
client.on('ready', () => console.log(`I am in! //${client.user.tag}`))