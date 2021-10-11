import algoliasearch from 'algoliasearch/lite';
import { SearchBox, Hits, Highlight, InstantSearch } from 'react-instantsearch-dom';

export const Search: React.VFC = () => {
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY,
  );
  const indexName = 'blog_of_the_ryo';
  return (
    <InstantSearch indexName={indexName} searchClient={searchClient}>
      <SearchBox />
      <Hits />
    </InstantSearch>
  );
};
