import axios, { AxiosInstance } from 'axios'
import { binanceAnalysis, binanceJsonToHuman, binanceOverview } from './prompt'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export enum SYMBOL {
  BNBUSDT = 'BNBUSDT',
}

class BinanceHelper {
  private api: AxiosInstance
  private candleData: string = ''

  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.binance.com',
      headers: {
        'Content-Type': 'application/json',
      },
      transformResponse: [
        function (data) {
          return data
        },
      ],
    })
  }

  // return next prompt
  getKlines(symbol: string, interval: string = '1h', limit: number = 100) {
    console.log(
      `🚀 SLOG (${new Date().toLocaleString()}): ➡ BinanceHelper ➡ getKlines ➡ symbol:`,
      symbol,
      'interval:',
      interval,
      'limit:',
      limit
    )
    return this.api
      .get('/api/v3/klines', {
        params: {
          symbol: symbol.replace('/', ''),
          interval,
          limit,
        },
      })
      .then((res) => res.data)
  }

  setCandleData(data: string) {
    this.candleData = data
  }

  async getCandlesData(symbol: SYMBOL) {
    const response = await this.getKlines(symbol)
    this.candleData = JSON.stringify(response)
    return binanceAnalysis(this.candleData)
  }

  getSymbols() {
    return this.api.get('/api/v3/ticker/24hr').then((res) => {
      const data = JSON.parse(res.data).sort(
        (a: any, b: any) => parseFloat(b.volume) - parseFloat(a.volume)
      )
      return binanceOverview(JSON.stringify(data.slice(0, 5)))
    })
  }

  getSymbolPrice(symbol: string) {
    return this.api
      .get('/api/v3/ticker/price', {
        params: {
          symbol: symbol.replace('/', ''),
        },
      })
      .then((res) => binanceJsonToHuman(JSON.stringify(res.data)))
  }

  writeToFile(data: string) {
    const filePath = path.join(__dirname, '../binance.history.log')
    fs.appendFileSync(filePath, data)
  }
}

export default BinanceHelper
