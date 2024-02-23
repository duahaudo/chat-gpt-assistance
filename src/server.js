const express = require('express')
const axios = require('axios')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json()) // for parsing application/json

const planning_task = (tickets) => {
  // const ticketsByAssignee = tickets.reduce((acc, ticket) => {
  //   if (!acc[ticket.assignee]) {
  //     acc[ticket.assignee] = []
  //   }
  //   acc[ticket.assignee].push(ticket)
  //   return acc
  // }, {})
  return `Planning task for ${tickets.length} tickets is done.`
  // ${JSON.stringify(ticketsByAssignee, null, 2)}
}

const history = []

app.post('/reset', (req, res) => {
  history.length = 0
  res.json({ message: 'History has been reset.' })
})

app.post('/prompt', async (req, res) => {
  const { prompt, model } = req.body
  console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ app.post ➡ prompt:`, prompt)

  const tools = [
    {
      type: 'function',
      function: {
        name: 'planning_task',
        description: 'Function for planning task',
        parameters: {
          type: 'object',
          properties: {
            tickets: {
              type: 'array',
              description: 'List of tickets to be planned. It must contain at least one ticket.',
              items: {
                type: 'object', // Assuming each ticket is an object; adjust this as necessary.
                properties: {
                  // Define the properties of a ticket object here
                  ticketNumber: {
                    type: 'string',
                    description: 'The unique identifier for the ticket.',
                  },
                  estimation: {
                    type: 'number',
                    description: 'Estimated hours required to complete the task.',
                  },
                  assignee: {
                    type: 'string',
                    description: 'Name of the person the ticket is assigned to.',
                  },
                  date: {
                    type: 'string',
                    format: 'date',
                    description: 'Planning date for the ticket.',
                  },
                  // Add more properties as required
                },
                required: ['date', 'ticketNumber', 'estimation', 'assignee'],
              },
            },
          },
          required: ['tickets'],
        },
      },
    },
  ]

  try {
    const data = {
      messages: prompt,
      model: model || 'gpt-3.5-turbo',
      temperature: 0.2,
      tool_choice: 'auto',
      tools: tools,
    }
    const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    })

    const { message } = response.data.choices[0]
    console.log(
      `🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ app.post ➡ response.data.choices[0].message:`,
      response.data.choices[0]
    )

    if (!message.content && message.tool_calls.length > 0) {
      console.log(
        `🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ app.post ➡ message.tool_calls:`,
        message.tool_calls[0]
      )

      if (message.tool_calls[0].function.name === 'planning_task') {
        const params = JSON.parse(message.tool_calls[0].function.arguments)
        const result = planning_task(params.tickets)
        message.content = result
        message.role = 'tool'
      }
    }

    history.push(message)

    res.json(message)
  } catch (error) {
    console.error(
      'Error fetching chat completion:',
      // Object.keys(error.response.data),
      error.response.data.error.message
    )
    res.status(500).json({
      error: `There was an issue with fetching the chat completion: ${error.message}`,
    })
  }
})

app.listen(3001, () => {
  console.log('Server is running on port 3001')
})
