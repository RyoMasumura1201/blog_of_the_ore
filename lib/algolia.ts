import algoliasearch from 'algoliasearch';
import { getSortedPostsData } from './posts';
import { HitsProvided } from 'react-instantsearch-core';

require('dotenv').config({ path: '.env.local' });

const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
const index = client.initIndex('blog_of_the_ryo');
const allPostsData = getSortedPostsData();

type hit = {
  id: string;
  title: string;
};

type hits = HitsProvided<hit>;
const main = () => {
  index
    .search('')
    .then(({ hits }: hits) => {
      const hitsId = [];
      hits.map((hit) => {
        hitsId.push(hit.id);
      });

      if (allPostsData.length > hits.length) {
        const newPost = allPostsData.filter((post) => {
          return hitsId.indexOf(post.id) == -1;
        });

        newPost.map((post) => {
          post.objectID = post.id;
        });

        index
          .saveObjects(newPost)
          .then(({ objectIDs }) => {
            console.log(objectIDs);
            console.log('検索結果を追加しました');
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log('新規投稿はありません');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

main();
