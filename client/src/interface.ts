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
  name?: string
}

export interface Ticket {
  ticketNumber: string
  estimation: number
  assignee: string
  date: string
}

export enum ChatGptModel {
  'gpt-3.5-turbo' = 'gpt-3.5-turbo',
  'gpt-4-turbo-preview' = 'gpt-4-turbo-preview',
}
