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
      <Header home={home} />
      <main>{children}</main>
      <Footer />
    </>
  );
};
