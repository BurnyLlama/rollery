import createToken from './createToken.js'
import { WORDS } from './rules.js'

/**
 * This function parses tokens and turns them into a statement.
 * @param {array} tokens The tokens to be parsed.
 * @param {Function} errorCallback A callback that is ran on errors.
 * @returns {array} The statement to be ran.
 */
export default function parser(tokens, errorCallback) {
    let statement = []
    let cursor = 0
    let error = false

    while (cursor < tokens.length) {
        const token = tokens[cursor]
        console.log({ cursor, token })
        
        if (token.type === 'WORD') {
            const wordType = WORDS[token.value]

            if (!wordType) {
                errorCallback(`:warning: **ERROR:** Okänt ord '${token.value}'!`)
                break
            }

            statement.push(createToken(wordType, token.value))
            ++cursor
            continue
        }

        if (token.type === 'STR') {
            statement.push(createToken('PARAM', [token.value]))
            ++cursor
            continue
        }

        statement.push(createToken(token.type, token.value))
        ++cursor
    }

    return error ? null : statement
}