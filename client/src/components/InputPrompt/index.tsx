import {
  VStack,
  Textarea,
  Progress,
  HStack,
  RadioGroup,
  Stack,
  Radio,
  Spacer,
  Button,
  Box,
} from '@chakra-ui/react'
import { ChatGptModel } from '../../interface'
import { forwardRef, useCallback, useEffect, useState } from 'react'

interface IInputPrompt {
  isLoading: boolean
  systemMessage: string
  handleSubmit: (input: string, model: string) => void
  handleReset: () => void
  handleShowHistory: () => void
}

export default forwardRef<HTMLTextAreaElement, IInputPrompt>(
  ({ isLoading, handleSubmit, handleReset, handleShowHistory, systemMessage }, textareaRef) => {
    const [input, setInput] = useState<string>('')
    const [model, setModel] = useState<ChatGptModel>(ChatGptModel['gpt-3.5-turbo'])

    useEffect(() => {
      if (systemMessage === 'binanceAssistant') {
        // alway use gpt-4-turbo-preview for binanceAssistant
        setModel(ChatGptModel['gpt-4-turbo-preview'])
      } else {
        setModel(ChatGptModel['gpt-3.5-turbo'])
      }
    }, [systemMessage])

    const submit = useCallback(() => {
      handleSubmit(input, model)
      setInput('')
    }, [input, model, handleSubmit])

    return (
      <VStack spacing={4}>
        <Box
          position='relative'
          width='100%'>
          <Textarea
            ref={textareaRef}
            placeholder='Enter your message...'
            value={input}
            rows={10}
            isDisabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                // Code to send the message goes here
                submit()
              }
            }}
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
            onChange={(val: ChatGptModel) => setModel(val)}
            value={model}>
            <Stack direction='row'>
              <Radio
                isDisabled={systemMessage === 'binanceAssistant'}
                value={ChatGptModel['gpt-3.5-turbo']}>
                GPT-3.5-Turbo
              </Radio>
              <Radio value={ChatGptModel['gpt-4-turbo-preview']}>GPT-4-Turbo-Preview</Radio>
            </Stack>
          </RadioGroup>
          <Spacer />
          <Button
            variant='outline'
            isDisabled={isLoading}
            onClick={handleShowHistory}>
            Show History
          </Button>
          <Button
            colorScheme='red'
            isDisabled={isLoading}
            onClick={handleReset}>
            Clear History
          </Button>
          <Button
            colorScheme='blue'
            isDisabled={isLoading}
            onClick={submit}>
            Send
          </Button>
        </HStack>
      </VStack>
    )
  }
)
