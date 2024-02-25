import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Button,
  Textarea,
  Box,
  useToast,
  VStack,
  Progress,
  HStack,
  Flex,
  Text,
  Radio,
  RadioGroup,
  Stack,
  Spacer,
} from '@chakra-ui/react'
import axios from 'axios'
// import ReactMarkdown from 'react-markdown'
import './App.css'
import { ChatGptMessage, Message } from './interface'

const App: React.FC = () => {
  const [input, setInput] = useState(`
Key	Assignee	Est
FSH2403ST-195	timmy	8
FSH2403ST-196	Stiger	8
FSH2403ST-197	Phoebe	4
FSH2403ST-198	timmy	4
FSH2403ST-199	Stiger	2
FSH2403ST-200	timmy	3
FSH2403ST-201	Stiger	1
`)
  const [conversation, setConversation] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState('gpt-3.5-turbo-0125')
  const toast = useToast()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  const handleSubmit = useCallback(async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput) return

    setConversation((prev) => [...prev, { text: trimmedInput, isUser: true }])
    setInput('') // Clear input after submission

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
  }, [input, setConversation, toast, model])

  const handleReset = useCallback(async () => {
    await axios.post('/reset')
    setConversation([])
  }, [])

  return (
    <Box p={4}>
      <Box
        mt={4}
        p={4}
        bg='gray.50'
        height='calc(100vh - 350px)' // Adjust the subtracted value based on the height of your other elements
        overflowY='auto'>
        {conversation.map((msg, index) => {
          // const isMarkdown = containsMarkdown(msg.text)
          return (
            <Flex
              key={index}
              direction='column'
              alignItems={msg.isUser ? 'flex-end' : 'flex-start'}
              width='100%'
              mt={2}>
              <Box
                bg={msg.isUser ? 'blue.100' : 'green.100'}
                p={2}
                borderRadius='lg'
                maxWidth='80%'
                minWidth='40%'
                textAlign={msg.isUser ? 'right' : 'left'}>
                <div style={{ overflowX: 'auto' }}>
                  <Box>
                    <Text whiteSpace='pre-wrap'>{msg.text}</Text>
                  </Box>
                </div>
              </Box>
            </Flex>
          )
        })}
        <div ref={messagesEndRef} />
      </Box>

      <VStack spacing={4}>
        <Box
          position='relative'
          width='100%'>
          <Textarea
            ref={textareaRef}
            placeholder='Enter your message...'
            value={input}
            rows={10}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
          />
          {isLoading && (
            <Progress
              size='xs'
              isIndeterminate
              position='absolute'
              bottom='0'
              width='100%'
            />
          )}
        </Box>
        <HStack width='100%'>
          <RadioGroup
            onChange={setModel}
            value={model}>
            <Stack direction='row'>
              <Radio value='gpt-3.5-turbo-0125'>GPT-3.5-Turbo</Radio>
              <Radio value='gpt-4-turbo-preview'>GPT-4-Turbo-Preview</Radio>
            </Stack>
          </RadioGroup>
          <Spacer />
          <Button
            colorScheme='red'
            isDisabled={isLoading}
            onClick={handleReset}>
            Clear History
          </Button>
          <Button
            colorScheme='blue'
            isDisabled={isLoading}
            onClick={handleSubmit}>
            Send
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default App
