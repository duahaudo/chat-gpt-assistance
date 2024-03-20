import axios from 'axios'
import { ChatGptMessage } from '../client/src/interface'
import { systemPrompt } from './systemPrompt'
import { planning_task, tools as planningTaskTools } from './utils'
import BinanceHelper from './binance/binanceHelper'
import { tools as binanceTools } from './binance/tools'

export default class AxiosHelper {
  private axiosInstance = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  })

  private history: ChatGptMessage[] = []
  private context: Record<string, ChatGptMessage> = systemPrompt
  private contextName: keyof typeof systemPrompt = 'binanceAssistant'

  defaultContext = this.context.feAssistant

  constructor() {
    this.history.push(this.defaultContext)
  }

  setContext(key: keyof typeof systemPrompt) {
    this.contextName = key || 'binanceAssistant'
    this.defaultContext = systemPrompt[key] || systemPrompt.binanceAssistant
  }

  async post(model: string, prompt: string) {
    try {
      this.history.push({ role: 'user', content: prompt })

      const data = {
        messages: [...this.history],
        model: model || 'gpt-3.5-turbo',
        temperature: 0.1,
        tool_choice: 'auto',
      } as any

      switch (this.contextName) {
        case 'taskPlanner': {
          data.tools = planningTaskTools
          break
        }
        case 'binanceAssistant': {
          data.tools = binanceTools
          break
        }
      }

      const response = await this.axiosInstance.post('/chat/completions', data)

      const {
        message,
        finish_reason,
      }: {
        message: ChatGptMessage
        finish_reason: 'stop' | 'tool_calls'
      } = response.data.choices[0]

      this.history.push(message)

      if (finish_reason === 'tool_calls') {
        if (message.tool_calls && message.tool_calls[0].function.arguments) {
          return this.functionCallHandler(message.tool_calls[0], model)
        }
      }

      return message
    } catch (error: any) {
      console.error(
        'Error fetching chat completion:',
        // Object.keys(error),
        this.history,
        error.response?.data.error
      )

      return error.response?.data.error.message || error.message
    }
  }

  clearHistory() {
    this.history = [{ ...this.defaultContext }]
  }

  async functionCallHandler(
    toolsCall: Record<string, any>,
    model?: string
  ): Promise<ChatGptMessage | null> {
    const params = JSON.parse(toolsCall.function.arguments)
    const {
      id,
      function: { name },
    } = toolsCall

    switch (this.contextName) {
      case 'taskPlanner': {
        const result = planning_task(params.tickets)
        const functionResponse: ChatGptMessage = {
          tool_call_id: id,
          role: 'tool',
          name,
          content: result,
        }
        this.history.push(functionResponse)

        return functionResponse
      }
      case 'binanceAssistant':
        const binance = new BinanceHelper()
        const content = await binance.handleFunctionCall(params.symbol)
        const functionResponse: ChatGptMessage = {
          tool_call_id: id,
          role: 'tool',
          name,
          content: 'Data fetching is complete',
        }
        this.history.push(functionResponse)

        return this.post(model || 'gpt-3.5-turbo', content)

      default:
        return null
    }
  }
}
