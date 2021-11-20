import { Guild, Message } from 'discord.js'

const ADMIN_ROLE = "Lärare"

/**
 * @param {Guild} server The server object on which to act.
 * @param {[string]} patterns An array of strings to match.
 * @returns {Array} Array of users matching the patterns.
 */
export function aggregateUsers(server, patterns) {
    return new Promise(
        resolve => {
            let users = []
        
            server.members.fetch()
                .then(
                    async fetchedUsers => {
                        for (const pattern of patterns) {
                            const matchedUsers = fetchedUsers.filter(user => user.displayName.endsWith(pattern)).values()
                            for (const user of matchedUsers)
                                users.push(user)
                        }
        
                        resolve(users)
                    }
                )
        }
    )
}

/**
 * Check if a message was sent by an admin. The function will automatically send a message informing the user!
 * @param {Message} msg The message to check if the user is admin of.
 * @returns {boolean} Boolean that shows whether user is admin.
 */
export function isAdmin(msg) {
    if (!msg.member.roles.cache.some(role => role.name === ADMIN_ROLE)) {
        msg.channel.send(`:no_entry: **ERROR:** Du har inte privilegie att köra \`${msg.content}\`! ${msg.member.user} ${msg.guild.roles.cache.find(role => role.name === ADMIN_ROLE)}`)
        msg.deletable ? msg.delete() : null
        return false
    }
    return true
}

/**
 * Check if a message was sent in DMs. The function will automatically send a message informing the user!
 * @param {Message} msg The message to check channelType of.
 * @returns {boolean} Boolean that shows whether user is admin.
 */
export function isDMs(msg) {
    if (msg.channel.type !== "GUILD_TEXT") {
        msg.author.send(`:warning: **ERROR:** Det här kommandot kräver att du är på en server!`)
        msg.deletable ? msg.delete() : null
        return true
    }
    return false
}

/**
 * A function that checks which roles exists from an array, and returns the existing ones.
 * @param {Message} msg The message to check channelType of.
 * @param {Array} roles The roles to check.
 * @returns {Array} Array containing the existing roles..
 */
export function existingRoles(msg, roles) {
    let out = []

    for (const role of roles) {
        if (!msg.guild.roles.cache.some(r => r.name === role)) {
            msg.channel.send(`:warning: **Varning:** Rollen \`${role}\` finns inte! (Om du spefierade andra roller så proceseras de ändå.)`)
            continue
        }

        out.push(role)
    }

    if (!out[0]) {
        msg.reply(":warning: Du specifierade inga existerande roller!")
        return [ undefined ]
    }

    return out
}