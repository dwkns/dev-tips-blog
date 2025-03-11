import logToConsole from 'eleventy-plugin-console-plus'
import markdownit from 'markdown-it'
import markdownItClass from 'markdown-it-class'
const md = markdownit().use(markdownItClass, {
  h2: [],
  p: [],
});


export default async  (eleventyConfig)=> {


  eleventyConfig.addFilter("markdownify", (str) => {
    // markdownItClass
    const html = md.render(str);
    return html;
  });

  // Copy Sanity Studio into build folder
  eleventyConfig.addPassthroughCopy({ "./src/styles/main.css": "./main.css" });
  const options = {
    logToHtml: false, // log to HTML
    logToTerminal: true, // log to terminal
    colorizeConsole: true, // colorize the console output
    escapeHTML: true, // escape HTML in the output
    depth: 4 // depth of object to print
	}
  eleventyConfig.addPlugin(logToConsole, options);


  return {
    dir: {
      input: "src",
      output: "dist",

      layouts: "_layouts",
      data: "_data"
    }
  }
} 