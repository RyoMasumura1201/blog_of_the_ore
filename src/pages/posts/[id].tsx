import {Layout} from '../../components/layout'
import { getAllPostIds, getPostData } from 'lib/posts'
import { GetStaticPaths, GetStaticProps } from 'next';

export default function Post({
  postData
}: {
  postData: {
    id: string
    title: string
    date: string
    contentHtml: string
  }
}) {
  return <Layout home={false}>
    {postData.title}
    <br />
    {postData.id}
    <br />
    {postData.date}
    <br />
    <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
  </Layout>
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