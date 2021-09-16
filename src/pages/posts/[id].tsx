import {Layout} from '../../components/layout'
import { getAllPostIds, getPostData } from 'lib/posts'
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import {Date} from '../../components/date'
import utilStyles from '../../../styles/util.module.css'
import Prism from 'Prismjs'
import { useEffect } from 'react';

type Props = {
  postData: {
    id: string
    title: string
    date: string
    contentHtml: string
  }
}
export default function Post(props: Props) {
  const {postData} = props;
  
  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1>{postData.title}</h1>
        <div>
          <Date dateString={postData.date} />
        </div>
        <div className="prose" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
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