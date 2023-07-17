import { Browser, Page } from 'puppeteer'
import { Blog } from './scraperBlogs'
import { News } from '@/types/zod/news'

// take a puppeteer Browser instance and a Blog object, and return a promise that resolves to an array of scraped data.
interface ScrapeFunction {
  (browser: Browser, blog: Blog): Promise<any[]>
}

// Main function
const scraperGeneric: ScrapeFunction = async (browser: Browser, blog: Blog) => {
  console.log(`genericScraper: scrape ${blog.name}`)
  const maxArticles = 10
  let posts: any[] = []

  const page: Page = await browser.newPage()
  await page.goto(blog.url)

  while (true) {
    try {
      const data: any[] = await blog.scraper(page, blog)

      posts = [...posts, ...data]

      const nextPageLink = await page.$$eval(blog.selectorPagination, (elements) =>
        elements.length ? elements[0].getAttribute('href') : null
      )

      if (!nextPageLink || (maxArticles && posts.length >= maxArticles)) {
        console.log(`genericScraper: last page ${posts.length}`)
        break
      }

      console.log('genericScraper: next page')
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await page.goto(nextPageLink)
    } catch (error: any) {
      console.error(`genericScraper: error scraping page - ${error.message}`, error.stack)
      break
    }
  }

  posts = scraperFormat(posts)

  return posts as News[]
}

export default scraperGeneric
