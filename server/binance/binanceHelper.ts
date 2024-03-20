import axios, { AxiosInstance } from 'axios'
import { binanceAnalysis } from './prompt'

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
      `🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ BinanceHelper ➡ getKlines ➡ symbol:`,
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
}

export default BinanceHelper
