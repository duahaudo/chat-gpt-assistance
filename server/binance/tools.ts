export const tools = [
  {
    type: 'function',
    function: {
      name: 'getCandlesData',
      description: 'Function to get current candles data from binance',
      parameters: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'The symbol of the currency pair.',
          },
          interval: {
            type: 'string',
            description: 'The interval of the candles.',
          },
        },
        required: ['symbol'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getMarketOverview',
      description:
        '24 hour rolling window price change statistics in Binance. Gives an overview of the market.',
      parameters: {},
    },
  },
  {
    type: 'function',
    function: {
      name: 'getSymbolPrice',
      description: 'Function to get current price of symbol in binance',
      parameters: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'The symbol of the currency pair.',
          },
        },
        required: ['symbol'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'createTradeOrder',
      description: 'Create a trade order with the given symbol and price details',
      parameters: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'The symbol for the trade order, e.g., BNBUSDT, BTCUSDT, etc.',
          },
          price: {
            type: 'object',
            description: 'The price details for the order',
            properties: {
              buy1: {
                type: 'string',
                description: 'The first buy price',
              },
              buy2: {
                type: 'string',
                description: 'The second buy price',
              },
              sell1: {
                type: 'string',
                description: 'The first sell price',
              },
              sell2: {
                type: 'string',
                description: 'The second sell price',
              },
            },
            required: ['buy1', 'buy2', 'sell1', 'sell2'],
          },
          confirmed: {
            type: 'string',
            description: 'User must type "Confirmed" confirm symbol value and call the function.',
          },
        },
        required: ['confirmed', 'symbol', 'price'],
      },
    },
  },
]
