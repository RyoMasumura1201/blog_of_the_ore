import { Box, Center } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

export const Footer: React.VFC = () => {
  return (
    <footer>
      <Box bg='black' width='100%' p='2' textAlign='center'>
        <Center>
          <a href='https://github.com/RyoMasumura1201/blog_of_the_ore'>
            <Center>
              <FaGithub color='white' size='50' />
            </Center>
            <Text color='gray.100'>Source Code is here</Text>
          </a>
        </Center>
      </Box>
    </footer>
  );
};
