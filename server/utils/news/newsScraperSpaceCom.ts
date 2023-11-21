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
  console.log('newsScraperSpaceCom:', page)

  // Retrieve the list of month links from the sidebar.
  const months = await page.$$eval('#sidebar ul > li > ul > li > a', (months) =>
    months.map((month) => (month as HTMLAnchorElement).href)
  )
  // Select either the first month (in development mode) or all months.
  const monthsToIterate = isDevelopment ? [months[0]] : months

  console.log('newsScraperSpaceCom:', months)

  // Iterate through each month.
  for (const month of monthsToIterate) {
    await page.goto(month) // Navigate to the month page.
    console.log('newsScraperSpaceCom:', month)

    // Retrieve the list of article links for the current month.
    const articles = await page.$$('.archive-list ul > ul > li.day-article > a')
    // Limit the number of articles based on the numArticlesPerMonth parameter.
    const articlesToIterate =
      numArticlesPerMonth === null ? articles : articles.slice(0, numArticlesPerMonth)
    console.log('newsScraperSpaceCom:', articles)

    // Iterate through each article link.
    for (const articleLink of articlesToIterate) {
      await articleLink.click() // Click the article link to open the article page.

      // Scrape data from the current article page.
      const articleData = await page.$eval(
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
                    figcaption?.querySelector('.caption-text').textContent.trim() || undefined
                  const credit =
                    figcaption?.querySelector('.credit').textContent?.trim() || 'Space.com'
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
          }
          console.log('dataSraped:', data)
          return data
        },
        blog.selectorConfig // Pass the selector configuration as an argument.
      )

      // Add the scraped article data to the scrapedData array.
      scrapedData.push(articleData)

      await page.goBack() // Navigate back to the month's article list.
    }
  }

  // Return the aggregated scraped data.
  return scrapedData
}

export default newsScraperSpaceCom
