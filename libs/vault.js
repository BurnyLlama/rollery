import fs from 'fs'

const VAULT_FILE = './vault.json'
if (!fs.existsSync(VAULT_FILE))
fs.writeFileSync(VAULT_FILE, "{}", { encoding: 'utf8' })

/**
 * This function opens the database and gives you the result.
 * It is safe to mutate the data, but if you need to save it
 * you must use the provided save(data) function.
 * @returns {object}
 */
function open() {
    const fileData = fs.readFileSync(VAULT_FILE, { encoding: 'utf8' })
    const data = JSON.parse(fileData)
    return data
}

/**
 * Saves a database. This completely overrides the previous data.
 * @param {object} data The data-object to be stored in the dtabase.
 */
function save(data) {
    const jsonData = JSON.stringify(data, null, 2)
    fs.writeFileSync(VAULT_FILE, jsonData, { encoding: 'utf8' })
}

export default {
    open,
    save
}