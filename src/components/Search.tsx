import algoliasearch from 'algoliasearch/lite';
import { SearchBox, Hits, Highlight, InstantSearch } from 'react-instantsearch-dom';
import Link from 'next/link';
import { Box } from '@chakra-ui/layout';

export const Search: React.VFC = () => {
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY,
  );
  const indexName = 'blog_of_the_ryo';

  const HitBlock = ({ hit }: any) => {
    return (
      <Link href={`/posts/${hit.id}`}>
        <a>
          <Highlight attribute='title' hit={hit} tagName='mark' />
        </a>
      </Link>
    );
  };

  return (
    <Box w='100%' p='4' textAlign='center'>
      <InstantSearch indexName={indexName} searchClient={searchClient}>
        <SearchBox />
        <Hits hitComponent={HitBlock} />
      </InstantSearch>
    </Box>
  );
};
