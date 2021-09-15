import Head from 'next/head'
import Link from 'next/dist/client/link'
import { siteTitle, Layout } from '../components/layout'
import utilStyles from 'styles/util.module.css'
import { getSortedPostsData } from 'lib/posts'
import { GetStaticProps } from 'next'
import { Date } from '../components/date'
import { Box, Center, Wrap, WrapItem } from '@chakra-ui/layout'
import { Image, Stack, Text } from "@chakra-ui/react"
import router from 'next/router'

export const getStaticProps: GetStaticProps = async()=> {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

export default function Home({
  allPostsData
} : {
    allPostsData: {
      date: string
      title: string
      id: string
    }[]
  }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
        <Wrap justify="center" spacing="30px">
          {allPostsData.map(({id, date, title}) => (
            <WrapItem key={id}>
              <Box w = "360px" h="360px" bg="gray.100" borderRadius="20px" p="4" onClick={()=> router.push(`/posts/${id}`)} _hover={{opacity: 0.5, cursor: "pointer"}}>
                <Stack textAlign="center">
                <Image src="/images/profile.jpeg" boxSize="240px" alt="thumbnail" m="auto" borderRadius="full"/>
                <Text fontSize="lg" fontWeight="bold">{title}</Text>
                <Date dateString={date} />
                </Stack>
              </Box>
            </WrapItem>
          ))}
        </Wrap>
    </Layout>
  )
}