import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import React from 'react';

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