import { Browser, Page } from 'puppeteer'
import { Blog } from './newsBlogs'
import type { NewsType } from '@/types/news'

interface ScrapeFunction {
  (browser: Browser, blog: Blog): Promise<any[]>
}

const newsScraperBase: ScrapeFunction = async (browser: Browser, blog: Blog) => {
  console.log(`newsScraperBase: scrape ${blog.name}`)
  const maxArticles = 10 // You can adjust this value
  let posts: any[] = []

  const page: Page = await browser.newPage()
  await page.goto(blog.url)

  while (true) {
    try {
      const data: any[] = await blog.scraper(page, blog)
      posts = [...posts, ...data]

      if (maxArticles && posts.length >= maxArticles) {
        console.log(`newsScraperBase: reached max articles ${posts.length}`)
        break
      }

      const nextPageLink = await page.$$eval(blog.selectorPagination, (elements) =>
        elements.length ? elements[0].getAttribute('href') : null
      )

      if (!nextPageLink) {
        console.log(`newsScraperBase: last page ${posts.length}`)
        break
      }

      console.log('newsScraperBase: next page')
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await page.goto(nextPageLink)
    } catch (error: any) {
      console.error(`newsScraperBase: error scraping page - ${error.message}`, error.stack)
      break
    }
  }
  console.log('newsScraperBase: try formatting posts')
  const formattedPosts = newsFormat(posts) // Assuming newsFormat is defined elsewhere

  return formattedPosts as NewsType[]
}

export default newsScraperBase
