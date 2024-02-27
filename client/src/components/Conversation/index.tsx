import { Flex, Box } from '@chakra-ui/react'
import { SlackMarkup } from '../markupDisplay'
import { forwardRef } from 'react'

interface IConversation {
  conversation: any[]
}

export default forwardRef<HTMLDivElement, IConversation>(({ conversation }, ref) => {
  return (
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
                  {/* <Text whiteSpace='pre-wrap'>{msg.text}</Text> */}
                  <SlackMarkup text={msg.text} />
                </Box>
              </div>
            </Box>
          </Flex>
        )
      })}
      <div ref={ref} />
    </Box>
  )
})
