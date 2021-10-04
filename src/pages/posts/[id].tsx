import {Layout} from '../../components/layout'
import { getAllPostIds, getPostData } from 'lib/posts'
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import {Date} from '../../components/date';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import markdownStyles from '../../../styles/markdown.module.css'
import { Text } from "@chakra-ui/react"
import { Box } from '@chakra-ui/layout'
import CodeBlock from '../../components/CodeBlock';
import { ReactMarkdownNames, TransformImage } from 'react-markdown/lib/ast-to-react'
type Props = {
  postData: {
    id: string
    title: string
    date: string
    image: string
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
        <Box paddingLeft="20" paddingRight="20" className={markdownStyles.markdownBody}>
          <ReactMarkdown remarkPlugins={[gfm]} components={{code: CodeBlock, 
          // [TODO]仮でany置いてるので適切な型に 
            p: ({ node, children }:{node: any; children: any}) => {
              if (node.children[0].tagName === "img") {
                  const image: any = node.children[0];
                  return (
                      <picture>
                          <img
                              src = {require(`../../../posts/${postData.id}/${image.properties.src}`)}
                              alt={image.properties.alt}
                          />
                      </picture>
                  );
              }
              return <p>{children}</p>;
          },
            }}>{postData.content}</ReactMarkdown>
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