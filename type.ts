import { HitsProvided } from 'react-instantsearch-core';

type hit = {
  id: string;
  title: string;
};

export type hits = HitsProvided<hit>;

export type postDataType = {
  id: string;
  date: string;
  title: string;
  image: string;
  objectID?: string; // algoliaのデータ通信で用いる
};
