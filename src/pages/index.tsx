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
        <link
          rel='icon'
          href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>👻</text></svg>'
        />
        <link
          rel='icon alternate'
          type='image/png'
          href='https://twemoji.maxcdn.com/v/13.1.0/72x72/1f47b.png'
        />
        <meta name='description' content='blog of the ryo of the ryo' />
        <meta
          property='og:image'
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle,
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name='og:title' content={siteTitle} />
        <meta name='twitter:card' content='summary_large_image' />
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
