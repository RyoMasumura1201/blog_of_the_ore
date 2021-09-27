import { Box,Center } from '@chakra-ui/layout'
import { FaGithub } from 'react-icons/fa'

export const Footer: React.VFC = ()=> {
  return (
    <footer>
      <Box bg="black" width="100%" p="4" >
        <Center>
        <a href="https://github.com/RyoMasumura1201">
          <FaGithub  color=" white" size="50"/>
        </a>
        </Center>
      </Box>
    </footer>
  )
}