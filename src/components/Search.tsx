import algoliasearch from 'algoliasearch/lite';
import { SearchBox, Hits, Highlight, InstantSearch } from 'react-instantsearch-dom';
import Link from 'next/link';

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
          <Highlight attribute='title' hit={hit} />
        </a>
      </Link>
    );
  };

  return (
    <InstantSearch indexName={indexName} searchClient={searchClient}>
      <SearchBox />
      <Hits hitComponent={HitBlock} />
    </InstantSearch>
  );
};
