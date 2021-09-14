import Head from 'next/head'
import Link from 'next/dist/client/link'
import { siteTitle, Layout } from '../components/layout'
import utilStyles from 'styles/util.module.css'
import { getSortedPostsData } from 'lib/posts'
import { GetStaticProps } from 'next'
import { Date } from '../components/date'
import { Box, Center, Wrap, WrapItem } from '@chakra-ui/layout'
import router, { useRouter} from 'next/router'

export const getStaticProps: GetStaticProps = async()=> {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

export default function Home({
  allPostsData
} : {
    allPostsData: {
      date: string
      title: string
      id: string
    }[]
  }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
        <Wrap justify="center" spacing="30px">
          {allPostsData.map(({id, date, title}) => (
            <WrapItem>
              <Box w = "360px" h="360px" bg="gray.100" borderRadius="20px">
                <p>{title}</p>
                <Date dateString={date} />
              </Box>
            </WrapItem>
          ))}
        </Wrap>
    </Layout>
  )
}