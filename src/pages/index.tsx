import Head from 'next/head';
import { siteTitle, Layout } from '../components/Layout';
import { getSortedPostsData } from 'lib/posts';
import { GetStaticProps } from 'next';
import { Wrap, WrapItem } from '@chakra-ui/layout';
import ArticleCard from '../components/ArticleCard';

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

export default function Home({
  allPostsData,
}: {
  allPostsData: {
    date: string;
    title: string;
    id: string;
    image: string;
  }[];
}) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Wrap justify='center' spacing='30px'>
        {allPostsData.map(({ id, date, title, image }) => (
          <WrapItem key={id}>
            <ArticleCard id={id} date={date} title={title} image={image} />
          </WrapItem>
        ))}
      </Wrap>
    </Layout>
  );
}
