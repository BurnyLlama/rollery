/**
 * This function creates a new
 * @param {string} type The type of the token.
 * @param {*} value The value of the token.
 * @returns {object} An object, being a token.
 */
export default function createToken(type, value) {
    return {
        type,
        value
    }
}