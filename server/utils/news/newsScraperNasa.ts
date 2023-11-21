import { Page } from 'puppeteer'
import { Blog, SelectorConfig } from './newsBlogs'

// maps the name of a data field to a CSS selector string that can be used to find the corresponding element on the page.

// Asynchronous function specific to scraping NASA's blog.
const newsScraperNasa = async (page: Page, blog: Blog) => {
  // Evaluate and execute script within the context of the page.
  return await page.$$eval(
    blog.selectorBase, // Base CSS selector for articles.
    (articles: Element[], selectorConfig: SelectorConfig) => {
      // Map each article element to its data representation.
      return articles.map((article: Element) => {
        // Initialize an object to store the data for each article.
        const data: { [key: string]: any } = {}

        // Iterate over each key in the selector configuration.
        for (const key in selectorConfig) {
          // Select elements within the article based on the current key.
          const elements = article.querySelectorAll(key as keyof SelectorConfig)

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
                const img = element.querySelector('img') // Find the img element.
                const figcaption = element.querySelector('figcaption') // Find the figcaption element.
                // Remove all 'a' tags from the figcaption.
                if (figcaption) {
                  const aTags = figcaption.querySelectorAll('a')
                  aTags.forEach((a) => {
                    a.parentNode?.removeChild(a)
                  })
                }
                // Extract and format the caption and credit from the figcaption.
                const caption =
                  figcaption?.textContent
                    ?.split(/(Image credit:|Credit:|Credits:|Image Credit:)/)[0]
                    .trim() || null
                const credit =
                  figcaption?.textContent
                    ?.split(/(Image credit:|Credit:|Credits:|Image Credit:)/)[2]
                    ?.trim() || 'NASA'
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
              data[key] = {
                name: elements[0].textContent?.trim(),
                link: elements[0].getAttribute('href')
              }
          }
        }
        return data
      })
    },
    blog.selectorConfig // Pass the selector configuration as an argument.
  )
}

export default newsScraperNasa
