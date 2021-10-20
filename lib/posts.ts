import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

type postDataType = {
  id: string;
  date: string;
  title: string;
  image: string;
  objectID?: string; // algoliaのデータ通信で用いる
};

const postsDirectory: string = path.join(process.cwd(), 'posts');

export const getSortedPostsData = () => {
  const dirNames: string[] = fs.readdirSync(postsDirectory);
  const allPostsData: postDataType[] = dirNames.map((dirName) => {
    const id: string = dirName;

    const fullPath: string = path.join(postsDirectory, dirName, 'index.md');
    const fileContents: string = fs.readFileSync(fullPath, 'utf8');

    const matterResult: matter.GrayMatterFile<string> = matter(fileContents);

    return {
      id,
      ...(matterResult.data as { date: string; title: string; image: string }),
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
};

export const getAllPostIds = () => {
  const dirNames: string[] = fs.readdirSync(postsDirectory);

  return dirNames.map((dirName) => {
    return {
      params: {
        id: dirName,
      },
    };
  });
};

export const getPostData = async (id: string) => {
  const fullPath: string = path.join(postsDirectory, id, 'index.md');
  const fileContents: string = fs.readFileSync(fullPath, `utf8`);

  const matterResult: matter.GrayMatterFile<string> = matter(fileContents);

  return {
    id,
    content: matterResult.content,
    ...(matterResult.data as { date: string; title: string; image: string }),
  };
};
