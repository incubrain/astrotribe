// import type { H3Event } from 'h3'
import { Page } from 'playwright'
import scraperClient from '../scraperClient'
import genericScraperCard from './scrapers/genericScraperCard'
import genericScraperArticle from './scrapers/genericScraperArticle'
import { newsBlogs } from './newsBlogs'
import type { NewsCategoryT } from '@/types/news'

const newsScraper = async (singleScraper?: NewsCategoryT): Promise<any[] | null> => {
  // Log the start of the scraping process.
  console.log('scrape-blogs start')
  const allPosts = []

  const blogs = singleScraper ? newsBlogs.filter((blog) => blog.name === singleScraper) : newsBlogs

  try {
    // Initialize the scraper client (browser instance).
    const browser = await scraperClient()
    const page: Page = await browser.newPage()
    // By default, set the blogs to scrape from a predefined list of news blogs.
    console.log('newsScraper: browser init')

    // Loop through each blog in the list.
    for (const blog of blogs) {
      // Log the start of scraping for each blog.
      console.log(`newsScraper: scrape ${blog.name}`)

      // Use the base scraping function to scrape posts from the current blog.
      const posts: any[] = []

      // Open a new browser page.
      // Navigate to the blog's URL.

      for (const urlIndex in blog.urls) {
        console.log('scraping url', blog.urls[urlIndex])
        await page.goto(blog.urls[urlIndex], {
          waitUntil: 'domcontentloaded',
          timeout: 0
        })

        // Use the blog's specific scraping function to extract data.
        const cardData: any[] = await genericScraperCard(page, blog)

        posts.push(...cardData)
      }

      // Log the storing process for each blog.
      console.log(`newsScraper: store ${blog.name}`)

      // Loop through each post scraped from the blog.

      const formattedCards = newsFormat(posts, blog.baseUrl, 'card')
      if (!formattedCards) {
        continue
      }

      // scrape article data
      const articles = []
      let updatedBaseUrl = blog.baseUrl

      for (const card of formattedCards) {
        await page.goto(card.url, {
          waitUntil: 'domcontentloaded',
          timeout: 0
        })
        const { articleData, pageUrl } = await genericScraperArticle(page, blog)
        if (pageUrl !== card.url) {
          console.log(`Redirect detected. Original URL: ${card.url}, Final URL: ${pageUrl}`)
          // Update the stored URL with the final URL
          card.url = pageUrl

          const urlObj = new URL(pageUrl)
          updatedBaseUrl = `${urlObj.protocol}//${urlObj.host}`
        }
        console.log('articleData', articleData)
        articles.push({ ...card, ...articleData })
      }

      const formattedArticles = newsFormat(articles, updatedBaseUrl, 'article')

      if (!formattedArticles) {
        continue
      }

      allPosts.push(...formattedArticles)
      posts.length = 0
    }

    // Close the browser instance after scraping is complete.
    await browser.close()
    // Log the completion of the scraping process.
    console.log('Blogs scraped', allPosts.length)
    return allPosts
  } catch (error: any) {
    // Log any errors that occur during the scraping process.
    console.log('newsScraper error', error.message)
    return null
  }
}

// !todo Schedule a cron job to run once per day
export default newsScraper
