import axios, { AxiosInstance } from 'axios'
import {
  binanceAccountBalance,
  binanceAnalysis,
  binanceJsonToHuman,
  binanceOverview,
  binancePlaceOrder,
} from './prompt'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { ORDER_TYPE, OrderParams, OrderPrice, SIDE, SYMBOL, Suggestions } from './interface'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class BinanceHelper {
  private api: AxiosInstance
  private candleData: string = ''
  private apiKey: string = 'KoYRW2a4EYBkkFIqArLkaashpG1OKKagUYVg9a8UxQFXfpyIJ8TJQcMzXR1MOMVw'
  private secretKey: string = '9wdBYWMswULZfJdX0vxyL1UHuUW6vAJiv7kKTShUNS7EWxol6hq4tkIouRuC9I27'

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

    // Add a response interceptor
    this.api.interceptors.response.use(
      function (response) {
        // Any status code that lies within the range of 2xx cause this function to trigger
        // Do something with response data
        return response
      },
      function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        // You can check error.response.status here and handle different cases
        // For example, if (error.response.status === 404) {...}

        // Always return a Promise that rejects with the error, so you can handle it in the specific request as well
        console.log(
          `🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ BinanceHelper ➡ error:`,
          error.response?.data
        )
        return Promise.reject(error)
      }
    )
  }

  enrichParams(params: Record<string, unknown> = {}) {
    const timestamp = Date.now().toString()
    const paramsObject = { timestamp, ...params } as Record<string, string>
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

  get(url: string, params: Record<string, string> = {}) {
    const richParams = this.enrichParams(params)

    return this.api.get(url, {
      params: {
        ...richParams,
      },
    })
  }

  post(url: string, params: Record<string, unknown> = {}) {
    const richParams = this.enrichParams(params)

    return this.api.post(url, {
      params: {
        richParams,
      },
    })
  }

  generateSignature(query: string): string {
    return crypto.createHmac('sha256', this.secretKey).update(query).digest('hex')
  }

  getAccountBalances = async () => {
    try {
      // @ts-ignore
      const { data } = await this.get(`/api/v3/account`, {
        omitZeroBalances: 'true',
      })

      return JSON.parse(data).balances
    } catch (error) {
      console.error('Error fetching account information:')
    }
  }

  getBalance = async ({ assets }: Record<string, string[]>) => {
    try {
      const data = await this.getAccountBalances()
      const balance = data.filter((item: any) => assets.includes(item.asset))
      return binanceAccountBalance(JSON.stringify(balance))
    } catch (error) {
      console.error('Error fetching account information:')
    }
  }

  // return next prompt
  getKlines({ symbol, interval, limit }: { symbol: string; interval?: string; limit?: number }) {
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

  setCandleData(data: string) {
    this.candleData = data
  }

  async getCandlesData({ symbol }: { symbol: SYMBOL }) {
    const response = await this.getKlines({ symbol })
    this.candleData = JSON.stringify(response)
    return binanceAnalysis(this.candleData)
  }

  getMarketOverview() {
    return this.api.get('/api/v3/ticker/24hr').then((res) => {
      const data = JSON.parse(res.data).sort(
        (a: any, b: any) => parseFloat(b.volume) - parseFloat(a.volume)
      )
      return binanceOverview(JSON.stringify(data.slice(0, 5)))
    })
  }

  getSymbolPrice({ symbol }: { symbol: string }) {
    return this.api
      .get('/api/v3/ticker/price', {
        params: {
          symbol: symbol.replace('/', ''),
        },
      })
      .then((res) => binanceJsonToHuman(JSON.stringify(res.data)))
  }

  async createTradeOrder({ suggestions }: { suggestions: Suggestions[] }) {
    const result = await Promise.all(
      suggestions.map((Suggestion) => {
        this.logOrderForAnalysis(Suggestion)

        return this.createAnOrder(Suggestion)
      })
    )
    console.log(
      `🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ BinanceHelper ➡ createTradeOrder ➡ result:`,
      result
    )

    return 'Order are placed.'
  }

  createAnOrder({
    symbol,
    price,
    quantity,
    side,
  }: {
    symbol: string
    price: number
    quantity: number
    side: SIDE
  }) {
    return this.post('/api/v3/order', {
      symbol: symbol.replace('/', ''),
      side,
      type: ORDER_TYPE.LIMIT,
      timeInForce: 'GTC', // Good Till Canceled
      quantity,
      price: price.toString(),
    })
  }

  logOrderForAnalysis({ symbol, price, quantity, side }: Suggestions) {
    const startTime = new Date().toLocaleString().replace(',', '')
    const closeTime = new Date(Date.now() + 7 * 60 * 60 * 1000).toLocaleString().replace(',', '')
    const rowData = `${symbol},${startTime},${closeTime},${side},${price},${quantity}\n`
    const filePath = path.join(__dirname, '../binance.order.csv')
    fs.appendFileSync(filePath, rowData)
  }

  logDataForAnalysis({ symbol, price }: { symbol: string; price: OrderPrice }) {
    const startTime = new Date().toLocaleString().replace(',', '')
    const closeTime = new Date(Date.now() + 7 * 60 * 60 * 1000).toLocaleString().replace(',', '')
    const rowData = `${symbol},${startTime},${closeTime},${price.buy1},${price.buy2},${price.sell1},${price.sell2}\n`
    this.writeToFile(rowData)
  }

  writeToFile(data: string) {
    const filePath = path.join(__dirname, '../binance.history.csv')
    fs.appendFileSync(filePath, data)
  }
}

export default BinanceHelper
