import { Box, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import Conversation from './components/Conversation'
import InputPrompt from './components/InputPrompt'
import { ChatGptMessage, Message } from './interface'

const App: React.FC = () => {
  const [conversation, setConversation] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  const handleSubmit = useCallback(
    async (input: string, model: string) => {
      const trimmedInput = input.trim()
      if (!trimmedInput) return

      setConversation((prev) => [...prev, { text: trimmedInput, isUser: true }])

      const fetchChatCompletion = async (input: string): Promise<ChatGptMessage> => {
        setIsLoading(true)
        try {
          const { data }: { data: ChatGptMessage } = await axios.post('/prompt', {
            prompt: input,
            model,
          })

          return data
        } catch (error: any) {
          console.error('Error fetching chat completion:', error)
          toast({
            title: 'Error fetching response',
            description: error.response.data.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
          return {
            content: 'Sorry, there was an error processing your request.',
            role: 'assistant',
          }
        } finally {
          setIsLoading(false)
        }
      }

      const { role, content } = await fetchChatCompletion(trimmedInput)
      setConversation((prev) => [...prev, { text: content, isUser: role === 'user' }])

      if (role !== 'user') {
        setTimeout(() => {
          textareaRef.current?.focus()
        }, 0)
      }
    },
    [setConversation, toast]
  )

  const handleReset = useCallback(async () => {
    await axios.post('/reset')
    setConversation([])
  }, [])

  return (
    <Box p={4}>
      <Conversation
        conversation={conversation}
        ref={messagesEndRef}
      />

      <InputPrompt
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        handleReset={handleReset}
        ref={textareaRef}
      />
    </Box>
  )
}

export default App
