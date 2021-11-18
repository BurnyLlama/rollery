import { Guild } from 'discord.js'

/**
 * 
 * @param {Guild} server 
 * @param {*} patterns 
 */
export function aggregateUsers(server, patterns) {
    let users = []

    for (const pattern of patterns) {
        const matchedUsers = server.members.cache.filter(user => user.displayName.endsWith(pattern)).values()

        for (const user of matchedUsers)
            users.push(user)
    }

    return users
}