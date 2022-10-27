import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { Text } from '@chakra-ui/react';
import { Box } from '@chakra-ui/layout';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import type { Options as RehypeReactOptions } from 'rehype-react';
import 'prismjs/themes/prism-tomorrow.css';

import { getAllPostIds } from 'lib/posts';
import { getPost } from 'lib/post';
import { Layout } from '../../components/Layout';
import Date from '../../components/Date';
import { postDataType } from 'type';
import { SEO } from '@/components/SEO';
import markdownStyles from '../../../styles/markdown.module.css';

interface postPage extends postDataType {
  html: string;
  description: string;
}

type Props = {
  postData: postPage;
};

type ImageElementProps = {
  src: string;
  alt: string;
};

export default function Post(props: Props) {
  const { postData } = props;

  const ImageElement: React.VFC<ImageElementProps> = (props) => {
    const { src, alt } = props;
    return (
      <picture>
        <Box style={{ position: 'relative', minHeight: '20em', width: '100%' }}>
          <Image
            src={require(`../../../posts/${postData.id}/${src}`)}
            alt={alt}
            layout='fill'
            objectFit='contain'
          />
        </Box>
      </picture>
    );
  };

  const RehypeReact = (html: string) => {
    const result = unified()
      .use(rehypeParse, {
        fragment: true,
      })
      .use(rehypeReact, {
        createElement: React.createElement,
        components: {
          img: (props: ImageElementProps) => {
            return ImageElement(props);
          },
        },
      } as RehypeReactOptions)
      .processSync(html);
    return result.result;
  };

  return (
    <Layout>
      <SEO
        title={postData.title}
        image={
          'https://blog-of-the-ore.vercel.app' +
          require(`../../../posts/${postData.id}/${postData.image}`)
        }
        description={postData.description}
      />
      <article>
        <Text textAlign='center' fontSize='x-large' fontWeight='bold'>
          {postData.title}
        </Text>
        <Box textAlign='center' marginBottom='10' color='gray.500'>
          <Date dateString={postData.date} />
        </Box>
        <Box paddingLeft={{ base: '10', md: '40' }} paddingRight={{ base: '10', md: '40' }}>
          <div className={markdownStyles.body}>{RehypeReact(postData.html)}</div>
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
  const postData = await getPost(params.id as string);
  return {
    props: {
      postData,
    },
  };
};
