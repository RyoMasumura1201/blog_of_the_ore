import { Layout } from '../components/Layout';
import { getSortedPostsData } from 'lib/posts';
import { GetStaticProps } from 'next';
import { Wrap, WrapItem } from '@chakra-ui/layout';
import ArticleCard from '../components/ArticleCard';
import { Search } from '../components/Search';
import { SEO } from '@/components/SEO';
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
      <SEO
        title='blog of the ryo'
        image={`https://blog-of-the-ore.vercel.app` + require(`../../public/images/profile.jpeg`)}
        description='blog of the ryo'
      />
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
