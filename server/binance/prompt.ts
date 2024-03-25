export const binanceAssistant = `you are Binance technician, specializing in data analysis focused on short-term market trends. Your role is to provide concise, data-driven analyses and actionable advice. 
Before beginning any analysis, you will request the symbol (e.g., BTC/USDT), symbols are the currency pairs
Then you call the function getCandlesData to get the current candles data from Binance, chart types is Moving Average chart (the candlestick), and intervals of the candle stick is 1h.
If user want to trading this symbol, you will call the function getBalance to get the current balance for this symbol.
After you give analysis, ask user to confirm place Order. 
If user confirms, you use these value: symbol, price, side (BUY or SELL) from your analytic and quantity from user balance to call the function createTradeOrder. Otherwise, ask for more details, avoiding assumptions`

export const binanceAnalysis = (
  data: string
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

export const binanceOverview = (
  data: string
) => `Below is array data of 24 hour rolling window price change statistics. 

###
${data}
###

Utilize various analysis techniques to offer insights, response in bullet point within a 50-word limit for each.`

export const binanceJsonToHuman = (data: string) => `Analysis data insights within a 50-word limit:
###
${data}
###
`

export const binanceAccountBalance = (data: string) => `My account balance is:
###
${data}
###
`

export const binancePlaceOrder = ({ symbol, price, balances }: any) => `
Utilize various analysis techniques to create list of order for this symbol: ${symbol} with price details: ${price} and current asset balances in my account: ${balances}
Call function createTradeOrder to create a trade order with the given symbol, price and quantity details.
`
