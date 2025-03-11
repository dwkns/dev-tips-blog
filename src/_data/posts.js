import 'dotenv/config'
import dayjs from 'dayjs'

import { Client } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"
import slugify from "slugify"

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_API_KEY 
})

const notionToMarkdown = new NotionToMarkdown({ notionClient: notion });

export default async () => {

  const db = await notion.databases.query({
    database_id: process.env.NOTION_DB_ID, 
    filter: {
      or: [
        {
          property: 'Draft',
          checkbox: { equals: false, },
        },
      ]
    },    
    sorts: [
	    {
	      property: "Published",
	      direction: "descending"
		  }
	  ],
    
  })


  // wrap the map function in await Promise.all so we can use await functions inside
  // ensures all the Promises are resolved before completing.
  const allPosts = await Promise.all(
    db.results.map(async result => {
      //  console.log("result: ", result)
      // title is stored in an array in Notion!!!
      const titleArray = result.properties['Title'].title

      // Check to see if the title is present
      if (titleArray.length != 0) {
        //extract the title
        const title = titleArray.pop()?.plain_text
        // get the markdown blocks from Notion page content
        const markdownBlocks = await notionToMarkdown.pageToMarkdown(result.id);
        // convert the markdownBlocks array to a string of markdown
        const content = notionToMarkdown.toMarkdownString(markdownBlocks).parent;
       
        return {
          id: result.id,
          title: title,
          slug: slugify(title, {strict: true, lower:true}),
          content: content,
          date: dayjs(result.properties.Published.date?.start).format('MMMM DD, YYYY'),
          summary: result.properties.Synopsis.rich_text.pop()?.plain_text
        }
      } else {
        // post doesn't have a title so ignore it
        return null 
      }
    }
    ))
  // remove any posts without titles (null)
  const posts = allPosts.filter(n => n)
  for (const post of posts) {
    console.log({title:post.title,date:post.date})
  }
  
  return posts 

}