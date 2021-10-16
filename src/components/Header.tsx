import { HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { siteTitle } from './Layout';
import Image from 'next/image';

type Props = {
  home?: boolean;
};
export const Header: React.VFC<Props> = (props) => {
  const { home } = props;
  return (
    <header>
      {home ? (
        <HStack spacing='8' p='2' bg='black' color='white' justify='center'>
          <Image
            src='/images/profile.jpeg'
            alt={siteTitle}
            width='50px'
            height='50px'
            className='headerImage'
          />
          <Text fontSize='xx-large' fontWeight='bold'>
            {siteTitle}
          </Text>
        </HStack>
      ) : (
        <HStack spacing='8' p='2' bg='black' color='white' justify='center'>
          <Link href='/'>
            <a>
              <Image
                src='/images/profile.jpeg'
                alt={siteTitle}
                width='50px'
                height='50px'
                className='headerImage'
              />
            </a>
          </Link>
          <Link href='/'>
            <a>
              <Text fontSize='xx-large' fontWeight='bold'>
                {siteTitle}
              </Text>
            </a>
          </Link>
        </HStack>
      )}
    </header>
  );
};
