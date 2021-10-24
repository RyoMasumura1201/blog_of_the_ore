import Head from 'next/head';
import { siteTitle, Layout } from '../components/Layout';
import { getSortedPostsData } from 'lib/posts';
import { GetStaticProps } from 'next';
import { Wrap, WrapItem } from '@chakra-ui/layout';
import ArticleCard from '../components/ArticleCard';
import { Search } from '../components/Search';
import { postDataType } from 'type';

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

export default function Home({ allPostsData }: { allPostsData: postDataType[] }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Search />
      <Wrap justify='center' spacing='30px' mt='4'>
        {allPostsData.map(({ id, date, title, image }) => (
          <WrapItem key={id}>
            <ArticleCard id={id} date={date} title={title} image={image} />
          </WrapItem>
        ))}
      </Wrap>
    </Layout>
  );
}
