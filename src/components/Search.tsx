import algoliasearch from 'algoliasearch/lite';
import { Hits, Highlight, InstantSearch, connectSearchBox } from 'react-instantsearch-dom';
import Link from 'next/link';
import { Box } from '@chakra-ui/layout';
import { useState } from 'react';
import CustomSearchBox from './CustomSearchBox';

export const Search: React.VFC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY,
  );
  const indexName = 'blog_of_the_ryo';

  const HitBlock = ({ hit }: any) => {
    return (
      <Box fontSize='large' m='2'>
        <Link href={`/posts/${hit.id}`}>
          <a>
            <Highlight attribute='title' hit={hit} tagName='mark' />
          </a>
        </Link>
      </Box>
    );
  };

  return (
    <Box
      w='70%'
      textAlign='center'
      m='0 auto'
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <InstantSearch indexName={indexName} searchClient={searchClient}>
        <CustomSearchBox />
        {isOpen ? (
          <Box style={{ position: 'relative', width: '100%' }}>
            <Box
              zIndex='10'
              boxShadow='md'
              style={{ position: 'absolute', backgroundColor: 'white', width: '100%' }}
            >
              <Hits hitComponent={HitBlock} />
            </Box>
          </Box>
        ) : (
          <></>
        )}
      </InstantSearch>
    </Box>
  );
};
