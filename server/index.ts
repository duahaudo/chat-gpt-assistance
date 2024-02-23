import { Request, Response } from 'express'
import express from 'express'
import cors from 'cors'
import AxiosHelper from './openAIHelper'
import { ChatGptMessage } from '../src/interface'

const app = express()
const axiosHelper = new AxiosHelper()

app.use(cors())
app.use(express.json()) // for parsing application/json

app.post('/reset', (req: Request, res: Response) => {
  axiosHelper.clearHistory()
  res.json({ message: 'History has been reset.' })
})

app.post('/prompt', async (req: Request, res: Response) => {
  const { prompt, model } = req.body

  try {
    const response: ChatGptMessage | string = await axiosHelper.post(model, prompt)

    if (typeof response === 'string') {
      res.status(500).json({
        message: `There was an issue with fetching the chat completion: ${response}`,
      })
    } else {
      res.json(response)
    }
  } catch (error: any) {
    console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ app.post ➡ error:`, error)
    res.status(500).json({
      error: `There was an issue with fetching the chat completion: ${error}`,
    })
  }
})

app.listen(3001, () => {
  console.log('Server is running on port 3001')
})
