const axios = require('axios')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const binanceAssistant = `you are Binance technician, specializing in data analysis focused on short-term market trends. Your role is to provide concise, data-driven analyses and actionable advice. 
Before beginning any analysis, you will request the symbol (e.g., BTC/USDT), symbols are the currency pairs
Then you call the function getCandlesData to get the current candles data from Binance, chart types is Moving Average chart (the candlestick), and intervals of the candle stick is 1h.
If user want to trading this symbol, you will call the function getBalance to get the current balance for this symbol.
After you give analysis, ask user to confirm place Order. 
If user confirms, you use these value: symbol, price, side (BUY or SELL) from your analytic and quantity from user balance to call the function createTradeOrder. Otherwise, ask for more details, avoiding assumptions`

const binanceAnalysis = (
  data
) => `Below is candle stick data(interval is 1h) Here is data array, each item is an array with following information:
[
  Kline open time,
  Open price,
  High price,
  Low price,
  Close price,
  Volume,
  Kline Close time,
  Quote asset volume,
  Number of trades,
  Taker buy base asset volume,
  Taker buy quote asset volume,
  Unused field, ignore.
]

###
${data}
###

Utilize various analysis techniques to offer insights within a 50-word limit, advising the user whether to buy or sell in the next 7 hours based on the data provided. You will predict the price at which to buy and sell, enhancing your advice's value. List all support and resistance price. Response include JSON format: {
  "buy1": "lowest buy price",
  "buy2": "2nd lowest buy price",
  "sell1": "hightest sell price",
  "sell2": "2nd highest sell price", 
}
Ask user balance to confirm place order. If the user confirms, call the function getBalance to get current assets balances. 
After that, re-analysis data and add quantity and reformat the response: [
  {
    "symbol": "BNBUSDT",
    "side": "BUY",
    "price": <buy1> price,
    "quantity": suggested quantity
  }
  ...
]
`

const binanceOverview = (
  data
) => `Below is array data of 24 hour rolling window price change statistics. 

###
${data}
###

Utilize various analysis techniques to offer insights, response in bullet point within a 50-word limit for each.`

const binanceJsonToHuman = (data) => `Analysis data insights within a 50-word limit:
###
${data}
###
`

const binanceAccountBalance = (data) => `My account balance is:
###
${data}
###
`

const binancePlaceOrder = ({ symbol, price, balances }) => `
Utilize various analysis techniques to create list of order for this symbol: ${symbol} with price details: ${price} and current asset balances in my account: ${balances}
Call function createTradeOrder to create a trade order with the given symbol, price and quantity details.
`

class BinanceHelper {
  apiKey = 'KoYRW2a4EYBkkFIqArLkaashpG1OKKagUYVg9a8UxQFXfpyIJ8TJQcMzXR1MOMVw'
  secretKey = '9wdBYWMswULZfJdX0vxyL1UHuUW6vAJiv7kKTShUNS7EWxol6hq4tkIouRuC9I27'

  constructor() {
    this.api = axios.create({
      baseURL: 'https://testnet.binance.vision',
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': this.apiKey,
      },
      transformResponse: [
        function (data) {
          return data
        },
      ],
    })

    this.api.interceptors.response.use(
      function (response) {
        return response
      },
      function (error) {
        console.log(
          `🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ BinanceHelper ➡ error:`,
          error.response?.data
        )
        return Promise.reject(error)
      }
    )
  }

  enrichParams(params = {}) {
    const timestamp = Date.now().toString()
    const paramsObject = { timestamp, ...params }
    const urlSearchParams = Object.keys(paramsObject)
      .sort()
      .reduce((acc, key) => {
        acc.append(key, paramsObject[key])
        return acc
      }, new URLSearchParams())

    return {
      ...params,
      timestamp,
      signature: this.generateSignature(urlSearchParams.toString()),
    }
  }

  get(url, params = {}) {
    const richParams = this.enrichParams(params)

    return this.api.get(url, {
      params: {
        ...richParams,
      },
    })
  }

  post(url, params = {}) {
    const richParams = this.enrichParams(params)

    const data = new URLSearchParams(richParams)

    console.log(
      `🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ BinanceHelper ➡ post ➡ richParams:`,
      data.toString()
    )

    return this.api.post(url, data.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  }

  generateSignature(query) {
    return crypto.createHmac('sha256', this.secretKey).update(query).digest('hex')
  }

  async getAccountBalances() {
    try {
      const { data } = await this.get('/api/v3/account', {
        omitZeroBalances: 'true',
      })

      return JSON.parse(data).balances
    } catch (error) {
      console.error('Error fetching account information:', error)
    }
  }

  async getBalance({ assets }) {
    try {
      const data = await this.getAccountBalances()
      const balance = data.filter((item) => assets.includes(item.asset))
      return binanceAccountBalance(JSON.stringify(balance))
    } catch (error) {
      console.error('Error fetching account information:', error)
    }
  }

  getKlines({ symbol, interval, limit }) {
    return this.api
      .get('/api/v3/klines', {
        params: {
          symbol: symbol.replace('/', ''),
          interval: interval || '1h',
          limit: limit || 100,
        },
      })
      .then((res) => res.data)
  }

  setCandleData(data) {
    this.candleData = data
  }

  async getCandlesData({ symbol }) {
    const response = await this.getKlines({ symbol })
    this.candleData = JSON.stringify(response)
    return binanceAnalysis(this.candleData)
  }

  getMarketOverview() {
    return this.api.get('/api/v3/ticker/24hr').then((res) => {
      const data = JSON.parse(res.data).sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))
      return binanceOverview(JSON.stringify(data.slice(0, 5)))
    })
  }

  getSymbolPrice({ symbol }) {
    return this.api
      .get('/api/v3/ticker/price', {
        params: {
          symbol: symbol.replace('/', ''),
        },
      })
      .then((res) => binanceJsonToHuman(JSON.stringify(res.data)))
  }

  async createTradeOrder({ suggestions }) {
    const result = await Promise.all(
      suggestions.map((suggestion) => {
        this.logOrderForAnalysis(suggestion)

        return this.createAnOrder(suggestion)
      })
    )
    console.log(
      `🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ BinanceHelper ➡ createTradeOrder ➡ result:`,
      result
    )

    return 'Order are placed.'
  }

  createAnOrder({ symbol, price, quantity, side }) {
    return this.post('/api/v3/order', {
      symbol: symbol.replace('/', ''),
      side,
      type: 'LIMIT',
      timeInForce: 'GTC',
      quantity,
      price: price.toString(),
    }).catch((e) => {})
  }

  logOrderForAnalysis({ symbol, price, quantity, side }) {
    const startTime = new Date().toLocaleString().replace(',', '')
    const closeTime = new Date(Date.now() + 7 * 60 * 60 * 1000).toLocaleString().replace(',', '')
    const rowData = `${symbol},${startTime},${closeTime},${side},${price},${quantity}\n`
    const filePath = path.join(__dirname, '../binance.order.csv')
    fs.appendFileSync(filePath, rowData)
  }

  logDataForAnalysis({ symbol, price }) {
    const startTime = new Date().toLocaleString().replace(',', '')
    const closeTime = new Date(Date.now() + 7 * 60 * 60 * 1000).toLocaleString().replace(',', '')
    const rowData = `${symbol},${startTime},${closeTime},${price.buy1},${price.buy2},${price.sell1},${price.sell2}\n`
    this.writeToFile(rowData)
  }

  writeToFile(data) {
    const filePath = path.join(__dirname, '../binance.history.csv')
    fs.appendFileSync(filePath, data)
  }
}

const helper = new BinanceHelper()

helper
  .createTradeOrder({
    suggestions: [
      { symbol: 'BNBUSDT', side: 'BUY', price: 550.9, quantity: 9 },
      { symbol: 'BNBUSDT', side: 'BUY', price: 553.4, quantity: 9 },
      { symbol: 'BNBUSDT', side: 'SELL', price: 595.9, quantity: 1 },
      { symbol: 'BNBUSDT', side: 'SELL', price: 597.9, quantity: 1 },
    ],
  })
  .then(console.log)
