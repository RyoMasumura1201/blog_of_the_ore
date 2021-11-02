import { Layout } from '../../components/Layout';
import { getAllPostIds, getPostData } from 'lib/posts';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Date from '../../components/Date';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import markdownStyles from '../../../styles/markdown.module.css';
import { Text, Image } from '@chakra-ui/react';
import { Box } from '@chakra-ui/layout';
import CodeBlock from '../../components/CodeBlock';
import { ReactNode } from 'react';
import { postDataType } from 'type';
import { SEO } from '@/components/SEO';

interface postPage extends postDataType {
  content: string;
}

type Props = {
  postData: postPage;
};
export default function Post(props: Props) {
  const { postData } = props;

  const Img = ({ node, children }: { node: JSX.IntrinsicElements['p']; children: ReactNode[] }) => {
    if (node.children[0].tagName === 'img') {
      const image = node.children[0];

      return (
        <picture>
          <Image
            src={require(`../../../posts/${postData.id}/${image.properties.src}`)}
            alt={image.properties.alt}
            objectFit='contain'
          />
        </picture>
      );
    }
    return <p>{children}</p>;
  };

  return (
    <Layout>
      <SEO title={postData.title} />
      <article>
        <Text textAlign='center' fontSize='x-large' fontWeight='bold'>
          {postData.title}
        </Text>
        <Box textAlign='center' marginBottom='10' color='gray.500'>
          <Date dateString={postData.date} />
        </Box>
        <Box
          paddingLeft={{ base: '10', md: '40' }}
          paddingRight={{ base: '10', md: '40' }}
          className={markdownStyles.markdownBody}
        >
          <ReactMarkdown remarkPlugins={[gfm]} components={{ code: CodeBlock, p: Img }}>
            {postData.content}
          </ReactMarkdown>
        </Box>
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id as string);
  return {
    props: {
      postData,
    },
  };
};
