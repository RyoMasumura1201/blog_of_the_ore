import { Layout } from '../../components/Layout';
import { getAllPostIds, getPostData } from 'lib/posts';
import { GetStaticPaths, GetStaticProps } from 'next';
import Date from '../../components/Date';
import { Text } from '@chakra-ui/react';
import { Box } from '@chakra-ui/layout';
import { postDataType } from 'type';
import { SEO } from '@/components/SEO';
import markdownStyles from '../../../styles/markdown.module.css';

interface postPage extends postDataType {
  html: string;
}

type Props = {
  postData: postPage;
};

export default function Post(props: Props) {
  const { postData } = props;

  return (
    <Layout>
      <SEO
        title={postData.title}
        image={
          'https://blog-of-the-ore.vercel.app' +
          require(`../../../posts/${postData.id}/${postData.image}`)
        }
      />
      <article>
        <Text textAlign='center' fontSize='x-large' fontWeight='bold'>
          {postData.title}
        </Text>
        <Box textAlign='center' marginBottom='10' color='gray.500'>
          <Date dateString={postData.date} />
        </Box>
        <Box paddingLeft={{ base: '10', md: '40' }} paddingRight={{ base: '10', md: '40' }}>
          <div
            className={markdownStyles.body}
            dangerouslySetInnerHTML={{ __html: postData.html }}
          />
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
