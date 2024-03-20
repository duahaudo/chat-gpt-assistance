import axios, { AxiosInstance } from 'axios'
import { binanceAnalysis } from './prompt'
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
    })
  }

  getKlines(symbol: string, interval: string = '1h', limit: number = 100) {
    console.log(
      `🚀 SLOG (${new Date().toLocaleString()}): ➡ BinanceHelper ➡ getKlines ➡ symbol:`,
      symbol,
      'interval:',
      interval,
      'limit:',
      limit
    )
    return this.api.get('/api/v3/klines', {
      params: {
        symbol: symbol.replace('/', ''),
        interval,
        limit,
      },
    })
  }

  setCandleData(data: string) {
    this.candleData = data
  }

  async handleFunctionCall(symbol: SYMBOL) {
    const response = await this.getKlines(symbol)
    this.candleData = JSON.stringify(response.data)
    return binanceAnalysis(this.candleData)
  }

  writeToFile(data: string) {
    const filePath = path.join(__dirname, '../binance.history.log')
    fs.writeFileSync(filePath, data)
  }
}

export default BinanceHelper
