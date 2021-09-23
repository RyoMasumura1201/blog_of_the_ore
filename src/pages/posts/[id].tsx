import {Layout} from '../../components/layout'
import { getAllPostIds, getPostData } from 'lib/posts'
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import {Date} from '../../components/date';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import utilStyles from '../../../styles/util.module.css'
// import Prism from 'Prismjs'
import { Text } from "@chakra-ui/react"
import { Box } from '@chakra-ui/layout'
// import 'github-markdown-css';
import CodeBlock from '../../components/CodeBlock';
type Props = {
  postData: {
    id: string
    title: string
    date: string
    content: string
  }
}
export default function Post(props: Props) {
  const {postData} = props;

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <Text  textAlign="center" fontSize="x-large" fontWeight="bold">{postData.title}</Text>
        <Box textAlign="center" marginBottom="10" color="gray.500">
          <Date dateString={postData.date} />
        </Box>
        <Box paddingLeft="10" paddingRight="10">
          <ReactMarkdown remarkPlugins={[gfm]} children={postData.content} components={{code: CodeBlock}}/>
        </Box>
      </article>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async() => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async({params}) => {
  const postData = await getPostData(params.id as string)
  return {
    props: {
      postData
    }
  }
} 