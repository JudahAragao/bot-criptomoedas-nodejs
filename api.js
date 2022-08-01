const axios = require('axios')
const querystring = require('querystring')

const publicCall = async (path, data, method = "GET") => {
    try {
        const qs = data ? `${querystring.stringify(data)}` : ''
        const result = await axios({
            method,
            url: `${process.env.API_URL}${path}${qs}`
        })
        return result.data
    } catch (error) {
        console.log(error)
    }
}

const time = async () => {
    return publicCall('/v3/time')
}

const depth = async (symbol = 'BTCBRL', limit = 5) => {
    return publicCall('/v3/depth?', { symbol, limit })
}

module.exports = { time, depth }