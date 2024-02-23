import { Ticket } from '../src/interface'

export const planning_task = (tickets: Ticket[]) => {
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

export const tools = [
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
