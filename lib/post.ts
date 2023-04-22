import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import parser from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import compiler from 'rehype-stringify';
import rehypePrism from 'rehype-prism-plus';
import remarkStringify from 'remark-stringify';
import stripMarkdown from 'strip-markdown';
import { plugin, fileNamehandler, parentCodeBlockHandler } from './transformer';
import type { Options as RemarkRehypeOptions } from 'remark-rehype';

const postsDirectory: string = path.join(process.cwd(), 'posts');

export const getPost = async (id: string) => {
  const fullPath: string = path.join(postsDirectory, id, 'index.md');
  const fileContents: string = fs.readFileSync(fullPath, `utf8`);

  const matterResult: matter.GrayMatterFile<string> = matter(fileContents);

  const processor = unified()
    .use(parser)
    .use(remarkGfm)
    .use(plugin)
    .use(remarkRehype, {
      handlers: {
        fileName: fileNamehandler,
        parentCodeBlock: parentCodeBlockHandler,
      },
    } as RemarkRehypeOptions)
    .use(rehypePrism)
    .use(compiler);

  const html = (await processor.process(matterResult.content)).toString();
  const description = (await MDToText(matterResult.content))
    .substring(0, 300)
    .trim()
    .replace(/(\r?\n)+/g, '\n');

  return {
    id,
    html,
    ...(matterResult.data as { date: string; title: string; image: string }),
    description,
  };
};

const MDToText = async (md: string) => {
  const result = await unified()
    .use(parser)
    .use(stripMarkdown, {
      remove: ['heading', 'list', 'blockquote', 'code', 'image'],
    })
    .use(remarkStringify)
    .processSync(md);

  return result.toString();
};
