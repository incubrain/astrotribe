import { Browser, Page } from 'puppeteer'
import { Blog } from './newsBlogs'
import type { NewsType } from '@/types/news'

interface ScrapeFunction {
  (browser: Browser, blog: Blog): Promise<any[]>
}

// Define a base scraping function for news.
const newsScraperBase: ScrapeFunction = async (browser: Browser, blog: Blog) => {
  // Log the start of scraping for a specific blog.
  console.log(`newsScraperBase: scrape ${blog.name}`)

  // Set a maximum number of articles to scrape, useful for testing.
  const maxArticles = 10
  let posts: any[] = []

  // Open a new browser page.
  const page: Page = await browser.newPage()
  // Navigate to the blog's URL.
  await page.goto(blog.url)

  // Loop indefinitely until the break condition is met.
  while (true) {
    try {
      // Use the blog's specific scraping function to extract data.
      const data: any[] = await blog.scraper(page, blog)
      // Add the newly scraped data to our posts array.
      posts = [...posts, ...data]

      // Check if the number of posts meets or exceeds the maxArticles limit.
      if (maxArticles && posts.length >= maxArticles) {
        // Log the achievement of max articles and break the loop.
        console.log(`newsScraperBase: reached max articles ${posts.length}`)
        break
      }

      // Find the link to the next page of the blog.
      const nextPageLink = await page.$$eval(blog.selectorPagination, (elements) =>
        elements.length ? elements[0].getAttribute('href') : null
      )

      // If there is no link to a next page, log and break the loop.
      if (!nextPageLink) {
        console.log(`newsScraperBase: last page ${posts.length}`)
        break
      }

      // Log moving to the next page.
      console.log('newsScraperBase: next page')
      // Wait for 2 seconds before proceeding.
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Go to the next page.
      await page.goto(nextPageLink)
    } catch (error: any) {
      // Log any errors encountered during scraping.
      console.error(`newsScraperBase: error scraping page - ${error.message}`, error.stack)
      // Break the loop if an error occurs.
      break
    }
  }

  // Log the attempt to format the scraped posts.
  console.log('newsScraperBase: try formatting posts')
  // Format the posts using a predefined formatting function.
  const formattedPosts = newsFormat(posts)

  // Return the formatted posts, cast to the NewsType type.
  return formattedPosts as NewsType[]
}

export default newsScraperBase
