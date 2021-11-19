/**
 * 
 * @param {array} tokens Array of tokens.
 * @param {Number} cursorOrigin Where to start looking. 
 * @returns {array} The group as an array.
 */
export default function makeGroup(tokens, cursorOrigin) {
    let group = []
    let cursor = cursorOrigin + 1

    while (cursor < tokens.length && tokens[cursor].type !== 'GROUP_END') {
        const token = tokens[cursor]

        if (token.type === 'STR')
            group.push(token.value)

        ++cursor
    }

    return[ group, cursor ]
}