import algoliasearch from 'algoliasearch/lite';
import { Hits, Highlight, InstantSearch, connectSearchBox } from 'react-instantsearch-dom';
import Link from 'next/link';
import { Box } from '@chakra-ui/layout';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

export const Search: React.VFC = () => {
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY,
  );
  const indexName = 'blog_of_the_ryo';

  const SearchBox = ({ currentRefinement, refine }: any) => {
    return (
      <Box w='80%' m='auto'>
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
      <Link href={`/posts/${hit.id}`}>
        <a>
          <Highlight attribute='title' hit={hit} tagName='mark' />
        </a>
      </Link>
    );
  };

  return (
    <Box w='100%' pl='10' pr='10' textAlign='center'>
      <InstantSearch indexName={indexName} searchClient={searchClient}>
        <CustomSearchBox />
        <Hits hitComponent={HitBlock} />
      </InstantSearch>
    </Box>
  );
};
