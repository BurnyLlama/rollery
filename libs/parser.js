import createToken from './createToken.js'
import { ALIASES, WORDS } from './rules.js'

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
        
        if (token.type === 'WORD') {
            const wordType = WORDS[ALIASES[token.value] ?? token.value]

            if (!wordType) {
                errorCallback(`:warning: **ERROR:** Okänt ord '${token.value}'!`)
                break
            }

            statement.push(createToken(wordType === 'SELECT_ALL' ? 'PARAM' : wordType, wordType === 'SELECT_ALL' ? [ "" ] : (ALIASES[token.value] ?? token.value)))
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