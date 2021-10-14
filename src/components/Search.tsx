import algoliasearch from 'algoliasearch/lite';
import { Hits, Highlight, InstantSearch, connectSearchBox } from 'react-instantsearch-dom';
import Link from 'next/link';
import { Box } from '@chakra-ui/layout';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';

export const Search: React.VFC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY,
  );
  const indexName = 'blog_of_the_ryo';

  const SearchBox = ({ currentRefinement, refine }: any) => {
    return (
      <Box w='100%' m='auto'>
        <InputGroup>
          <Input
            placeholder='記事を検索'
            value={currentRefinement}
            onChange={(e) => refine(e.currentTarget.value)}
          />
          <InputLeftElement>
            <SearchIcon color='gray.700' />
          </InputLeftElement>
        </InputGroup>
      </Box>
    );
  };

  const CustomSearchBox = connectSearchBox(SearchBox);

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
      w='100%'
      pl='100'
      pr='100'
      textAlign='center'
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
