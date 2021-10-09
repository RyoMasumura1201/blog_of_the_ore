import { Image, HStack, Text } from "@chakra-ui/react"
import Link from 'next/link'
import { siteTitle } from '../components/Layout'

type Props = {
    home?: boolean
}
export const Header: React.VFC<Props> = (props) => {
    const { home } = props;
    return (
        <header>
        {home ? (
          <HStack spacing="8" p="4" bg="black" color="white" justify="center" >
            <Image
              src="/images/profile.jpeg"
              alt={siteTitle}
              borderRadius="full"
              boxSize="50px"
            />
            <Text fontSize="xx-large" fontWeight="bold">{siteTitle}</Text>
          </HStack>
        ) : (
          <HStack spacing="8" p="4" bg="black" color="white" justify="center" >
            <Link href="/">
              <a>
                <Image
                src="/images/profile.jpeg"
                alt={siteTitle}
                borderRadius="full"
                boxSize="50px"
                />
              </a>
            </Link>
            <Link href="/">
              <a>
                <Text fontSize="xx-large" fontWeight="bold">{siteTitle}</Text>
              </a>
            </Link>
          </HStack>
        )}
      </header>
    )
}