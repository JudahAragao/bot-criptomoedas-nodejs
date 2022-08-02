const axios = require('axios')
const querystring = require('querystring')
const crypto = require('crypto')

const apiKey = process.env.API_KEY_TEST
const apiSecret = process.env.SECRET_KEY_TEST
const apiUrl = process.env.API_URL_TEST

const privateCall = async (path, data = {}, method = 'GET') => {
    const timestamp = Date.now()
    const signature = crypto.createHmac('sha256', apiSecret)
        .update(`${querystring.stringify({...data, timestamp})}`)
        .digest('hex')

    const newData = {...data, timestamp, signature}
    const qs = `?${querystring.stringify(newData)}`

    try {
        const result = await axios({
            method,
            url: `${apiUrl}${path}${qs}`,
            headers: { 'X-MBX-APIKEY': apiKey }
        })
        return result.data
    } catch (error) {
        console.log(error)
    }
}

const newOrder = (symbol, quantity, price, side='BUY', type='MARKET') => {
    const data = { symbol, side, type, quantity }

    if (price) data.price = price;
    if (type === "LIMIT") data.timeInForce = 'GTC'

    return privateCall('/v3/order', data, 'POST')
}

const accountInfo = async () => {
    return privateCall('/v3/account')
}

const publicCall = async (path, data, method = "GET") => {
    try {
        const qs = data ? `${querystring.stringify(data)}` : ''
        const result = await axios({
            method,
            url: `${apiUrl}${path}${qs}`
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

const exchangeInfo = async () => {
    return publicCall('/v3/exchangeInfo')
}

module.exports = { time, depth, exchangeInfo, accountInfo, newOrder }