import Head from 'next/head';
import { VFC } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export const siteTitle = 'blog_of_the_ryo';

type Props = {
  home?: boolean;
  children: React.ReactNode;
};

export const Layout: VFC<Props> = ({ children, home }) => {
  return (
    <>
      <Head>
        <link
          rel='icon'
          href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>👻</text></svg>'
        />
        <link
          rel='icon alternate'
          type='image/png'
          href='https://twemoji.maxcdn.com/v/13.1.0/72x72/1f47b.png'
        />
        <meta name='description' content='Learn how to build a personal website using Next.js' />
        <meta
          property='og:image'
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle,
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name='og:title' content={siteTitle} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>
      <Header home={home} />
      <main>{children}</main>
      <Footer />
    </>
  );
};
