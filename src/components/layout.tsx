import Head from 'next/head'
import styles from './layout.module.css'
import utilStyles from '../../styles/util.module.css'
import Link from 'next/link'
import { VFC } from 'react'
import { Image, HStack, Text } from "@chakra-ui/react"
import { Box,Center } from '@chakra-ui/layout'
import { FaGithub } from 'react-icons/fa'

const name = 'blog_of_the_ryo'
export const siteTitle = 'blog_of_the_ryo'

type Props = {
    home?: boolean
    children: React.ReactNode
}

export const Layout: VFC<Props> =({ children, home }) =>{
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <HStack spacing="8" marginBottom="10" p="4" bg="black" color="white" width="100%" justify="center">
            <Image
              src="/images/profile.jpeg"
              alt={name}
              borderRadius="full"
              boxSize="50px"
            />
            <Text fontSize="xx-large" fontWeight="bold">{name}</Text>
          </HStack>
        ) : (
          <HStack spacing="8" marginBottom="10" p="4" bg="black" color="white" width="100%" justify="center">
            <Link href="/">
              <a>
                <Image
                src="/images/profile.jpeg"
                alt={name}
                borderRadius="full"
                boxSize="50px"
                />
              </a>
            </Link>
            <Link href="/">
              <a>
                <Text fontSize="xx-large" fontWeight="bold">{name}</Text>
              </a>
            </Link>
          </HStack>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <Box mt="5" textAlign="center" color="blue.400">
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </Box>
      )}
      <footer>
        <Box bg="black" width="100%" p="4" mt="4" position="fixed" bottom="0">
          <Center>
          <a href="https://github.com/RyoMasumura1201">
            <FaGithub  color=" white" size="50"/>
          </a>
          </Center>
        </Box>
      </footer>
    </>
  )
}