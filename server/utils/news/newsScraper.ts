// import type { H3Event } from 'h3'
import scraperClient from '../scraperClient'
import newsScraperPagination from './newsScraperPagination'
import newsBlogs from './newsBlogs'
// import { serverSupabaseClient } from '#supabase/server'

function formatStringToFileName(input: string): string {
  // Convert the string to lowercase
  let formattedString = input.toLowerCase()

  // Replace special characters and spaces with a dash
  // This regex replaces anything that's not a letter, number, or space with nothing
  // Then, replaces spaces with dashes
  formattedString = formattedString.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')

  // Append the '.json' extension
  console.log('formatStringToFileName:', formattedString)
  return formattedString + '.json'
}

const newsScraper = async (isTest = true): Promise<any[] | undefined> => {
  // Log the start of the scraping process.
  console.log('scrape-blogs start')

  try {
    // Initialize the scraper client (browser instance).
    const formattedPosts = []
    const browser = await scraperClient()
    // By default, set the blogs to scrape from a predefined list of news blogs.
    let blogs = newsBlogs
    console.log('newsScraper: browser init')

    // If in test mode, limit scraping to a specific blog (with id = 2) for testing purposes.
    if (isTest) blogs = [newsBlogs.find((blog) => blog.id === 1)!]
    console.log('newsScraper: blogs to scrape init', blogs)

    // Loop through each blog in the list.
    for (const blog of blogs) {
      // Log the start of scraping for each blog.
      console.log(`newsScraper: scrape ${blog.name}`)

      // Use the base scraping function to scrape posts from the current blog.
      const posts = await newsScraperPagination(browser, blog)

      // Log the storing process for each blog.
      console.log(`newsScraper: store ${blog.name}`)

      // Loop through each post scraped from the blog.
      for (const post of posts) {
        // Log the post details.
        console.log('formattingPosts', post)
        const formattedPost = newsFormat(post)
        formattedPosts.push(formattedPost)
        // const supabase = await serverSupabaseClient(event)
        // const { data: newsData, error: newsError } = await supabase
        //   .from('news')
        //   .insert(formattedPost)
        //   .select()
        // console.log('newsScraper: newsData', newsData, newsError)
        // // now insert the news_tags based on response
        // if (!newsData) return
        // await supabase.from('news_tags').insert({ news_id: newsData.id, tag_id: 53 })
      }
    }

    // Close the browser instance after scraping is complete.
    await browser.close()
    // Log the completion of the scraping process.
    console.log('Blogs scraped', formattedPosts.length)
    return formattedPosts
  } catch (error: any) {
    // Log any errors that occur during the scraping process.
    console.log('newsScraper error', error.message)
  }
}

// !todo Schedule a cron job to run once per day
export default newsScraper
