/**
 * This function creates a str from a string.
 * @param {string} string The string to search for the str in.
 * @param {number} originCursor The cursor position to start at.
 */
 export default function makeCommand(string, originCursor) {
    let str = ""
    let cursor = originCursor + 1

    while (!string[cursor].match(/['"]/)) {
        str += string[cursor]
        ++cursor
    }

    return str
}