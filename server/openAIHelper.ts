import { taskPlanner, taskExplainer } from './systemPrompt'
import axios from 'axios'
import { ChatGptMessage } from '../client/src/interface'
import { planning_task, tools } from './utils'

export default class AxiosHelper {
  private axiosInstance = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  })

  private history: ChatGptMessage[] = []
  private context: Record<string, ChatGptMessage> = {
    taskPlanner: {
      role: 'system',
      content: taskPlanner,
    },
    taskExplainer: {
      role: 'system',
      content: taskExplainer,
    },
  }

  defaultContext = this.context.taskExplainer

  constructor() {
    this.history.push(this.defaultContext)
  }

  async post(model: string, prompt: string) {
    try {
      this.history.push({ role: 'user', content: prompt })

      const data = {
        messages: [...this.history],
        model: model || 'gpt-3.5-turbo',
        temperature: 0.1,
        tool_choice: 'auto',
        tools,
      }

      const response = await this.axiosInstance.post('/chat/completions', data)

      const {
        message,
        finish_reason,
      }: {
        message: ChatGptMessage
        finish_reason: 'stop' | 'tool_calls'
      } = response.data.choices[0]
      // console.log(
      //   `🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ AxiosHelper ➡ post ➡ message:`,
      //   JSON.stringify(response.data.choices[0], null, 2)
      // )

      this.history.push(message)

      if (finish_reason === 'tool_calls') {
        if (message.tool_calls && message.tool_calls[0].function.arguments) {
          const params = JSON.parse(message.tool_calls[0].function.arguments)
          const result = planning_task(params.tickets)

          const functionResponse: ChatGptMessage = {
            tool_call_id: message.tool_calls[0].id,
            role: 'tool',
            name: message.tool_calls[0].function.name,
            content: result,
          }
          this.history.push(functionResponse)

          return functionResponse
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
}
