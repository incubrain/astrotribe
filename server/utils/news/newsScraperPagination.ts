import { Browser, Page } from 'playwright'
import { Blog } from './newsBlogs'
import genericScraper from './scrapers/genericScraperCard'

interface ScrapeFunction {
  (browser: Browser, blog: Blog): Promise<any[]>
}

// Define a base scraping function for news.
const newsScraperPagination: ScrapeFunction = async (browser: Browser, blog: Blog) => {
  // Log the start of scraping for a specific blog.
  console.log(`newsScraperPagination: scrape ${blog.name}`)

  // Set a maximum number of articles to scrape, useful for testing.
  const maxArticles = 2
  let posts: any[] = []

  // Open a new browser page.
  const page: Page = await browser.newPage()
  // Navigate to the blog's URL.

  for (const urlIndex in blog.urls) {
    console.log('scraping url', blog.urls[urlIndex])
    await page.goto(blog.urls[urlIndex], {
      waitUntil: 'domcontentloaded',
      timeout: 0
    })

    while (true) {
      try {
        // Use the blog's specific scraping function to extract data.
        const data: any[] = await genericScraper(page, blog)
        // Add the newly scraped data to our posts array.
        posts.push(...data)
        console.log('newsScraperPagination: while loop')

        // Check if the number of posts meets or exceeds the maxArticles limit.
        if (maxArticles && posts.length >= maxArticles) {
          // Log the achievement of max articles and break the loop.
          console.log(`newsScraperPagination: reached max articles ${posts.length}`)
          break
        }

        // Use Playwright's page.locator() to find the link to the next page of the blog.
        const nextPageLinkElement = page.locator(blog.selectorPagination)
        const nextPageLinkCount = await nextPageLinkElement.count()

        let nextPageLink = null
        if (nextPageLinkCount > 0) {
          nextPageLink = await nextPageLinkElement.getAttribute('href', { index: 0 })
        }

        // If there is no link to a next page, log and break the loop.
        if (!nextPageLink) {
          console.log(`newsScraperPagination: last page ${posts.length}`)
          break
        }

        // Log moving to the next page.
        console.log('newsScraperPagination: next page')
        // Wait for 2 seconds before proceeding to mimic human behavior (adjust as needed).
        await page.waitForTimeout(2000) // Using Playwright's waitForTimeout instead of a manual promise
        // Go to the next page.
        await page.goto(nextPageLink)
      } catch (error) {
        // Log any errors encountered during scraping.
        console.error(`newsScraperPagination: error scraping page - ${error.message}`, error.stack)
        // Break the loop if an error occurs.
        break
      }
    }
  }
  console.log('newsScraperPagination: goto complete')

  // Loop indefinitely until the break condition is met.

  // Return the formatted posts, cast to the NewsCardT type.
  return posts
}

export default newsScraperPagination
