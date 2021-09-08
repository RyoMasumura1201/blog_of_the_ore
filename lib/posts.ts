import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified';
import html from 'remark-html';
import remarkParse from 'remark-parse'

type postDataType = {
    id: string,
    date: string,
    title: string 
}

const postsDirectory:string = path.join(process.cwd(), 'posts');

export const getSortedPostsData = () => {
    const fileNames:string[] = fs.readdirSync(postsDirectory)
    const allPostsData:postDataType[] = fileNames.map(fileName => {
        const id: string = fileName.replace(/\.md$/, '');

        const fullPath: string = path.join(postsDirectory, fileName)
        const fileContents: string = fs.readFileSync(fullPath, 'utf8');

        const matterResult: matter.GrayMatterFile<string> = matter(fileContents);

        return {
            id,
            ...(matterResult.data as {date: string; title: string}) 
        }
    })

    return allPostsData.sort((a,b) => {
        if(a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export const getAllPostIds= () => {
    const fileNames: string[] = fs.readdirSync(postsDirectory);

    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
}

export const getPostData = async(id: string) => {
  const fullPath: string = path.join(postsDirectory, `${id}.md`);
  const fileContents: string = fs.readFileSync(fullPath, `utf8`);

  const matterResult: matter.GrayMatterFile<string> = matter(fileContents);

  const processedContent = await unified()
    .use(remarkParse)
    .use(html)
    .process(matterResult.content)
  
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data as {date: string; title: string}
  }

}