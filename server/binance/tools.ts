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
          confirmed: {
            type: 'string',
            description: 'User must type "Confirmed" confirm symbol value and call the function.',
          },
        },
        required: ['symbol', 'confirmed'],
      },
    },
  },
]
