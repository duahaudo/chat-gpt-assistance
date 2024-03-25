export interface OrderParams {
  symbol: string
  side: string
  type: string
  timeInForce: string
  quantity: number
  price: string
}

export interface OrderPrice {
  buy1: string
  buy2: string
  sell1: string
  sell2: string
}

export interface Suggestions {
  symbol: SYMBOL
  side: SIDE
  price: number
  quantity: number
}

export enum SYMBOL {
  BNBUSDT = 'BNBUSDT',
}

export enum SIDE {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum ORDER_TYPE {
  LIMIT = 'LIMIT',
}
