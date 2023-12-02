import { Page } from 'puppeteer'
import { Blog, SelectorConfig } from './newsBlogs'

// maps the name of a data field to a CSS selector string that can be used to find the corresponding element on the page.

// Asynchronous function for scraping Space.com.
const newsScraperSpaceCom = async (
  page: Page,
  blog: Blog,
  isDevelopment: true,
  numArticlesPerMonth: number | null = 1
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
    const articlesToIterate =
      numArticlesPerMonth === null ? articles : articles.slice(0, numArticlesPerMonth)

    console.log('newsScraperSpaceCom articlesToIterate:', articlesToIterate)

    for (const articleLink of articlesToIterate) {
      await page.goto(articleLink, { waitUntil: 'domcontentloaded' }) // Navigate to the article page.
      await page.waitForSelector(blog.selectorBase) // Wait for the article to load.

      /* ALTERNATE APPROACH TO SCRAPING (Works partially, while working on this I found a solution for the previously written code)

      const articleData: { [key: string]: any } = {}

      for (const key in blog.selectorConfig) {
        if (key === 'ignore') continue
        // Title scraping
        await page.waitForSelector((blog.selectorBase, blog.selectorConfig.title))

        articleData[key] = await page.$$eval(
          (blog.selectorBase, blog.selectorConfig[key as keyof SelectorConfig] as string),
          (article) => {
            return (article[0] as HTMLDivElement).textContent?.replace(/\n/g, ' ').trim()
          }
        )
      }
      */

      const articleData = await page.$eval(
        blog.selectorBase, // Base selector for the article content.
        (article: Element, selectorConfig: SelectorConfig, link: string) => {
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
              case 'images':
                // Map each image element to its data representation.
                data[key] = Array.from(elements).map((element) => {
                  // Find the image and its caption elements.
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
                    src: img?.getAttribute('src'), // Source URL of the image.
                    alt: img?.getAttribute('alt'), // Alt text of the image.
                    caption, // Image caption.
                    credit // Image credit.
                  }
                })
                break
              case 'author':
                // Extract and store the author's name and link.
                data[key] = {
                  name: elements[0].textContent?.trim(),
                  link: elements[0].getAttribute('href'),
                  image: null // No image for the author in this case.
                }
                break
              case 'published':
                // Store the datetime attribute as the published date.
                data[key] = elements[0].getAttribute('datetime')
                break
              case 'body':
              case 'title':
                // Extract and format the text content for body and title.
                data[key] = elements[0].textContent?.replace(/\n/g, ' ').trim()
                // Extract the source article URL.
                data.srcArticle = elements[0].getAttribute('src')
                break
              default:
                // Handle other unspecified keys.
                break
            }
            // console.log('dataSraped:', data)
          }
          data.link = link // Add the article link to the scraped data.
          return data
        },
        blog.selectorConfig, // Pass the selector configuration as an argument.
        articleLink
      )
      // Add the scraped article data to the scrapedData array.
      scrapedData.push(articleData)
    }
  }
  // Return the aggregated scraped data.
  return scrapedData
}

export default newsScraperSpaceCom
