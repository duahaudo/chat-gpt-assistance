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
  {
    type: 'function',
    function: {
      name: 'getBalance',
      description: 'Get current balance of one symbol of the account',
      parameters: {
        type: 'object',
        properties: {
          assets: {
            type: 'array',
            description: 'The array of asset symbol to get the balance of.',
            items: {
              type: 'string',
              description: 'The asset symbol to get the balance of.',
            },
          },
        },
        required: ['asset'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'createTradeOrder',
      description: 'place order for the given symbol, price details, and quantity',
      parameters: {
        type: 'object',
        properties: {
          suggestions: {
            type: 'array',
            description: 'The array of suggestions to place order for.',
            items: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  description: 'The symbol for the trade order, e.g., BNBUSDT, BTCUSDT, etc.',
                },
                side: {
                  type: 'string',
                  description: 'The side of the order, either "BUY" or "SELL".',
                },
                price: {
                  type: 'number',
                  description: 'The price of the order.',
                },
                quantity: {
                  type: 'number',
                  description: 'The quantity of the order.',
                },
              },
              required: ['symbol', 'side', 'price', 'quantity'],
            },
          },
        },
        required: ['suggestions'],
      },
    },
  },
]
