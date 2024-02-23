export interface Message {
  text: string
  isUser: boolean
}

export interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

export interface ChatGptMessage {
  role: 'user' | 'assistant' | 'system' | 'function' | 'tool'
  content: string
  tool_call_id?: string
  finish_reason?: string
  tool_calls?: ToolCall[]
}

export interface Ticket {
  ticketNumber: string
  estimation: number
  assignee: string
  date: string
}
