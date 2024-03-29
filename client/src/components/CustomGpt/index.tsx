import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

interface ICustomGpt {
  systemMessage: string
  setSystemMessage: (message: any) => void
  disabled: boolean
}

const CustomGptList = ({ systemMessage, setSystemMessage, disabled }: ICustomGpt) => {
  const [keys, setKeys] = useState<string[]>([])

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const { data } = await axios.get('/getKeys')
        setKeys(data)
        setSystemMessage(data.find((item: string) => item.includes('binance')))
      } catch (error: any) {
        console.error('Error fetching keys:', error)
      }
    }
    if (!systemMessage && !disabled) {
      fetchKeys()
    }
  }, [setSystemMessage, systemMessage, disabled, keys])

  const handleSelect = useCallback(
    (value: string) => {
      setSystemMessage(value)
    },
    [setSystemMessage]
  )

  return (
    <Menu>
      <MenuButton
        isDisabled={disabled}
        as={Button}
        colorScheme='teal'>
        {systemMessage}
      </MenuButton>
      <MenuList>
        {keys.map((key: string) => (
          <MenuItem
            onClick={() => handleSelect(key)}
            key={key}
            value={key}>
            {key}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default CustomGptList
