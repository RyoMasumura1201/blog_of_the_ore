import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { postDataType } from 'type';
import { unified } from 'unified';
import parser from 'remark-parse';
import toHast from 'remark-rehype';
import compiler from 'rehype-stringify';

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

  const processor = unified().use(parser).use(toHast).use(compiler);

  const html = await processor.process(matterResult.content);

  return {
    id,
    html: html.toString(),
    ...(matterResult.data as { date: string; title: string; image: string }),
  };
};
