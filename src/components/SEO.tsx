import Head from 'next/head';

type Props = {
  title: string;
  image: string;
  description: string;
};
export const SEO: React.VFC<Props> = (props) => {
  const { title, image, description } = props;
  return (
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
      <title>{title}</title>
      <meta name='og:title' content={title} />
      <meta name='description' content={description} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
      <meta name='twitter:card' content='summary_large_image' />
    </Head>
  );
};
