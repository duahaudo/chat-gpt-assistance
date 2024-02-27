import React from 'react'
import './style.css'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { Button } from '@chakra-ui/react'
// @ts-expect-error
import CopyToClipboard from 'react-copy-to-clipboard'

export const SlackMarkup: React.FC<any> = ({ text }) => {
  const renderText = () => {
    const blocks = text.split('```')
    return blocks.map((block: any, index: any) => {
      if (index % 2 === 1) {
        // Code block
        const language = block.split('\n')[0]
        const code = block.replace(language, '').trim()
        return (
          <>
            <div>
              <CopyToClipboard
                text={code}
                onCopy={() => alert('Copied')}>
                <Button size='sm'>Copy</Button>
              </CopyToClipboard>
            </div>
            <SyntaxHighlighter
              language='typescript'
              style={atomOneDark}
              key={index}
              wrapLongLines
              showLineNumbers>
              {code}
            </SyntaxHighlighter>
          </>
        )
      } else {
        // Normal text
        const lines = block.split('\n')
        return (
          <span
            key={index}
            className='response-text'>
            {lines.map((line: any, lineIndex: any) => {
              if (line.includes('`')) {
                const parts = line.split('`')
                return (
                  <React.Fragment key={lineIndex}>
                    {parts.map((part: any, partIndex: any) => (
                      <React.Fragment key={partIndex}>
                        {partIndex % 2 === 1 ? (
                          <span className='response-highlight'>{part}</span>
                        ) : (
                          <>{part}</>
                        )}
                      </React.Fragment>
                    ))}
                    <br /> {/* Add a new line */}
                  </React.Fragment>
                )
              } else {
                return (
                  <React.Fragment key={lineIndex}>
                    {line}
                    <br /> {/* Add a new line */}
                  </React.Fragment>
                )
              }
            })}
          </span>
        )
      }
    })
  }

  return <>{renderText()}</>
}
