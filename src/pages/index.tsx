import Head from 'next/head'
import Link from 'next/dist/client/link'
import { siteTitle, Layout } from '../components/layout'
import utilStyles from 'styles/util.module.css'

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
          <Link href="/posts/first-post">post</Link>
        </p>
      </section>
    </Layout>
  )
}