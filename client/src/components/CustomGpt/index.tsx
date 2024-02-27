import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

interface ICustomGpt {
  systemMessage: string
  setSystemMessage: (message: any) => void
  disabled: boolean
}

export default ({ systemMessage, setSystemMessage, disabled }: ICustomGpt) => {
  const [keys, setKeys] = useState<string[]>([])

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const { data } = await axios.get('/getKeys')
        setKeys(data)
        setSystemMessage(data[0])
      } catch (error: any) {
        console.error('Error fetching keys:', error)
      }
    }

    fetchKeys()
  }, [])

  const handleSelect = useCallback((value: string) => {
    setSystemMessage(value)
  }, [])

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
