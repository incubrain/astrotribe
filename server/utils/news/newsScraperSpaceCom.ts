import { Page } from 'puppeteer'
import { Blog, SelectorConfig } from './newsBlogs'

// maps the name of a data field to a CSS selector string that can be used to find the corresponding element on the page.

// Asynchronous function for scraping Space.com.
const newsScraperSpaceCom = async (
  page: Page,
  blog: Blog,
  isDevelopment = true,
  numArticlesPerMonth = 1
) => {
  // Initialize an array to store the scraped data.
  const scrapedData: any[] = []

  await page.goto(blog.url, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('#sidebar ul > li > ul > li > a')

  // Retrieve the list of month links from the sidebar.
  const months = await page.$$eval('#sidebar ul > li > ul > li > a', (months) =>
    months.map((month) => (month as HTMLAnchorElement).href)
  )
  // Select either the first month (in development mode) or all months.
  console.log('newsScraperSpaceCom Config:', isDevelopment, numArticlesPerMonth, page)
  const monthsToIterate = isDevelopment ? [months[0]] : months

  // Iterate through each month.
  for (const month of monthsToIterate) {
    await page.goto(month, { waitUntil: 'domcontentloaded' }) // Navigate to the month page.
    await page.waitForSelector('.archive-list ul > li > ul > li.day-article > a')

    // Retrieve the list of article links for the current month.
    const articles = await page.$$eval(
      '.archive-list ul > li > ul > li.day-article > a',
      (articles) => {
        console.log('newsScraperSpaceCom articles:', articles)
        return articles.map((article) => (article as HTMLAnchorElement).href)
      }
    )

    // Limit the number of articles based on the numArticlesPerMonth parameter.
    const urlsToScrape =
      numArticlesPerMonth === null ? articles : articles.slice(0, numArticlesPerMonth)
    console.log('newsScraperSpaceCom Articles to Scrape:', urlsToScrape, articles)
    for (const url of urlsToScrape) {
      await page.goto(url, { waitUntil: 'domcontentloaded' }) // Navigate to the article page.
      await page.waitForSelector(blog.selectorBase) // Wait for the article to load.

      let articleData = await page.$eval(
        blog.selectorBase, // Base selector for the article content.
        (article: Element, selectorConfig: SelectorConfig) => {
          const data: { [key: string]: any } = {}

          // Iterate over each key in the selector configuration.
          for (const key in selectorConfig) {
            // Retrieve the selector value(s) for the current key.
            const selectorValue = selectorConfig[key as keyof SelectorConfig]
            if (selectorValue === undefined) continue
            // Combine selectors if they are in an array.
            const selectors = Array.isArray(selectorValue) ? selectorValue.join(',') : selectorValue
            // Select elements within the article based on the selectors.
            const elements = article.querySelectorAll(selectors)

            // If no elements are found for the current key, set the data to null.
            if (!elements.length) {
              data[key] = null
              continue
            }

            // Switch case to handle different types of data based on the key.
            switch (key) {
              case 'featured_image':
                try {
                  console.log('featured_image:', elements)
                  const imgs = Array.from(elements).map((element) => {
                    const img = element.querySelector('img')
                    const figcaption = element.querySelector('figcaption')
                    // Remove all 'a' tags from the figcaption.
                    if (figcaption) {
                      const aTags = figcaption.querySelectorAll('a')
                      aTags.forEach((a) => {
                        a.parentNode?.removeChild(a)
                      })
                    }
                    // Extract the caption and credit.
                    const caption =
                      figcaption?.querySelector('.caption-text')?.textContent?.trim() || undefined
                    const credit =
                      figcaption?.querySelector('.credit')?.textContent?.trim() || 'Space.com'
                    // Return the image data.
                    return {
                      src: img?.getAttribute('src'),
                      alt: img?.getAttribute('alt'),
                      caption,
                      credit
                    }
                  })
                  data[key] = imgs[1]
                } catch (err) {
                  console.log('Error in featured_image:', err)
                  data[key] = null
                }
                break
              case 'author':
                data[key] = {
                  name: elements[0].textContent?.trim(),
                  link: elements[0].getAttribute('href'),
                  image: null // No image for the author in this case.
                }
                break
              case 'created_at':
                data[key] = elements[0].getAttribute('datetime')
                break
              case 'body':
              case 'title':
                // Extract and format the text content for body and title.
                data[key] = elements[0].textContent?.replace(/\n/g, ' ').trim()
                // Extract the source article URL.
                break
              default:
                // Handle other unspecified keys.
                break
            }
          }
          console.log('dataSraped:', data)
          return data
        },
        blog.selectorConfig // Pass the selector configuration as an argument.
      )
      articleData = { ...articleData, url }
      console.log('articleData:', articleData)
      // Add the scraped article data to the scrapedData array.
      scrapedData.push(articleData)
    }
  }
  // Return the aggregated scraped data.
  return scrapedData
}

export default newsScraperSpaceCom
