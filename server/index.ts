import { systemPrompt } from './systemPrompt'
import { Request, Response } from 'express'
import express from 'express'
import cors from 'cors'
import AxiosHelper from './openAIHelper'
import { ChatGptMessage } from '../client/src/interface'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const axiosHelper = new AxiosHelper()

app.use(cors())

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'client', 'build')))

app.get(`/getKeys`, (req: Request, res: Response) => {
  const data = Object.keys(systemPrompt)
  res.json(data)
})

app.post(`/setKey`, (req: Request, res: Response) => {
  const key = req.body.key
  axiosHelper.setContext(key)
  res.json({ message: `Context has been set to ${key}` })
})

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

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build'))
})

const port = process.env.PORT || 6001
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
