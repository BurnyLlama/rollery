import { Guild } from 'discord.js'

/**
 * @param {Guild} server The server object on which to act.
 * @param {[string]} patterns An array of strings to match.
 * @returns {Array} Array of users matching the patterns.
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