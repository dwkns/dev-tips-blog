const { Client } = require("@notionhq/client")
const { NotionToMarkdown } = require('notion-to-md');
var slugify = require('slugify')

// Initializing a client
const notion = new Client({
  auth: "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"
})

const notionToMarkdown = new NotionToMarkdown({ notionClient: notion });

module.exports = async () => {

  const db = await notion.databases.query({
    database_id: "11f257c5f6e380d4960df2986a2ca50e",
    filter: {
     or: [
      {
        property: 'Draft',
        checkbox: { equals: false, },
      },
     ]
    },
  })
  
	const getContent = async (id) => {
		const markdownBlocks = await notionToMarkdown.pageToMarkdown(id);
		return notionToMarkdown.toMarkdownString(markdownBlocks);
	};

  const posts =  db.results.map( result => {
    const title = result.properties['Title'].title.pop().plain_text
    return {
      id: result.id,
      title: title ,
      slug: slugify(title)
    }
  });

  for (const post of posts) {
    post["content"] = await getContent(post.id);
    
  }
  console.log("posts: ", posts)
return  posts

}