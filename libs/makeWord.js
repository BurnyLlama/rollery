import { WORD_CHARS } from './rules.js'

/**
 * This function creates a command from a string.
 * @param {string} string The string to search for commands in.
 * @param {number} originCursor The cursor position to start at.
 */
export default function makeCommand(string, originCursor) {
    let word = ""
    let cursor = originCursor

    while (cursor < string.length && string[cursor].match(WORD_CHARS)) {
        word += string[cursor]
        ++cursor
    }

    return word
}