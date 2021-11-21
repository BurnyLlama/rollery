import https from 'https'


/**
 * This function fetches data from a URL.
 * @param {string} url The URL to fetch.
 * @param {bool} isJSON true if you want to convert data from JSON to an object.
 * @param {object} customHeaders Optional custom headers.
 * @returns {Promise} Resolves with the fetched data.
 */
export default function fetch(url, isJSON, customHeaders) {
    return new Promise(
        resolve => {
            https.get(
                url,
                {
                    headers: customHeaders ?? {}
                },
                res => {
                    let data = ""
                    res.on('data', fragment => data += fragment)
                    res.on('end', () => resolve(isJSON ? JSON.parse(data) : data))
                }
            )
        }
    )
}