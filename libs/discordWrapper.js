import { Guild } from 'discord.js'

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