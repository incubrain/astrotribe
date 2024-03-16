import { Page } from 'playwright'
import { Blog, SelectorConfig } from './newsBlogs'
import type { NewsScrapedType } from '~/types/news'

// Asynchronous function for scraping Space.com using Playwright's Locator functionality.
const newsScraperSpaceCom = async (
  page: Page,
  blog: Blog,
  isDevelopment = true,
  numArticlesPerMonth = 1
) => {
  // Initialize an array to store the scraped data.
  const scrapedData: any[] = []

  await page.goto(blog.url, { waitUntil: 'domcontentloaded' })
  const sidebarSelector = page.locator('#sidebar ul > li > ul > li > a')
  await sidebarSelector.waitFor()

  // Retrieve the list of month links from the sidebar.
  const months = await sidebarSelector.evaluateAll((links) => links.map((link) => link.href))

  // Select either the first month (in development mode) or all months.
  console.log('newsScraperSpaceCom Config:', isDevelopment, numArticlesPerMonth, page)
  const monthsToIterate = isDevelopment ? [months[0]] : months

  // Iterate through each month.
  for (const month of monthsToIterate) {
    await page.goto(month, { waitUntil: 'domcontentloaded' }) // Navigate to the month page.
    const articleSelector = page.locator('.archive-list ul > li > ul > li.day-article > a')
    await articleSelector.waitFor()

    // Retrieve the list of article links for the current month.
    const articles = await articleSelector.evaluateAll((articles) =>
      articles.map((article) => article.href)
    )

    // Limit the number of articles based on the numArticlesPerMonth parameter.
    const urlsToScrape =
      numArticlesPerMonth === null ? articles : articles.slice(0, numArticlesPerMonth)
    console.log('newsScraperSpaceCom Articles to Scrape:', urlsToScrape, articles)
    for (const url of urlsToScrape) {
      await page.goto(url, { waitUntil: 'domcontentloaded' }) // Navigate to the article page.
      const baseSelector = page.locator(blog.selectorBase)
      await baseSelector.waitFor()

      // Now using locators for extracting data
      const articleData: NewsScrapedType = await page.evaluate((selectorConfig: SelectorConfig) => {
        const data: { [key: string]: any } = {}
        for (const key in selectorConfig) {
          const selector = selectorConfig[key]
          if (!selector) continue
          const element = document.querySelector(selector)
          // Your logic for extracting data based on the element
          // Adjusted to work with direct DOM manipulation inside evaluate
        }
        return data
      }, blog.selectorConfig)

      articleData.url = url
      scrapedData.push(articleData)
    }
  }
  // Return the aggregated scraped data.
  return scrapedData
}

export default newsScraperSpaceCom
