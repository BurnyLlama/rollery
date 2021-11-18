import createToken from './createToken.js'
import makeWord from './makeWord.js'
import makeStr from './makeStr.js'
import { TYPES } from './rules.js'

/**
 * This function lexes a string into tokens.
 * @param {string} command This is the command string that should be lexed.
 * @param {Function} errorCallback A callback that fires incase of errors, takes one parameter: error: string
 * @returns {Array} Array of tokens to be parsed.
 */
export default function lexer(command, errorCallback) {
    let tokens = []
    let cursor = 0
    let error = false

    while (cursor < command.length) {
        const char = command[cursor]

        if (TYPES[char]) {
            tokens.push(createToken(TYPES[char], null))
            ++cursor
            continue
        }

        if (char.match(/[A-ZÅÄÖ0-9]/)) {
            const word = makeWord(command, cursor)
            tokens.push(createToken("WORD", word))
            cursor += word.length
            continue
        }

        if (char.match(/['"]/)) {
            const str = makeStr(command, cursor)
            tokens.push(createToken("STR", str))
            cursor += str.length + 2
            continue
        }

        if (char.match(/\s/)) {
            ++cursor
            continue
        }

        error = true
        errorCallback(`:warning: **ERROR:** Okänt tecken '${char}' (position ${cursor + 1})!`)
        break
    }

    return error ? [null] : tokens
}