import { Browser, Page } from 'puppeteer'
import { Blog } from './scraperBlogs'

// maps the name of a data field to a CSS selector string that can be used to find the corresponding element on the page.
interface SelectorConfig {
  [key: string]: string
}

// take a puppeteer Browser instance and a Blog object, and return a promise that resolves to an array of scraped data.
interface ScrapeFunction {
  (browser: Browser, blog: Blog): Promise<any[]>
}

const scraperGeneric: ScrapeFunction = async (browser: Browser, blog: Blog) => {
  console.log(`genericScraper: scrape ${blog.name}`)
  let posts: any[] = []

  const page: Page = await browser.newPage()
  await page.goto(blog.url)

  // loop through all pages.
  while (true) {
    try {
      // To have access you have to pass in data to the page.$$eval function.
      const newPosts = await page.$$eval(
        blog.selectorBase,
        (articles: Element[], selectorConfig: SelectorConfig) =>
          articles.map((article: Element) => {
            const data: { [key: string]: any } = {}

            // For each key in the selectorConfig, find the corresponding element
            for (const key in selectorConfig) {
              const element = article.querySelector(selectorConfig[key])
              if (!element) {
                if (key === 'image') {
                  data[key] = {
                    src: null,
                    alt: null,
                    caption: null
                  } // if no image, set null, no error
                  continue
                }
                throw new Error(`Missing ${key} element in article`)
              }

              if (key === 'content') {
                const clonedElement = element.cloneNode(true) as Element
                const figcaptions = clonedElement.querySelectorAll('figcaption')
                figcaptions.forEach((figcaption) => figcaption.remove())
                data[key] = clonedElement.textContent?.replace(/\n/g, ' ').trim()
              } else if (key === 'image') {
                const captionElement = element.querySelector('figcaption')
                const imgElement = element.querySelector('img')
                data[key] = {
                  src: imgElement ? imgElement.getAttribute('src') : null,
                  alt: imgElement ? imgElement.getAttribute('alt') : null,
                  caption: captionElement ? captionElement.textContent?.trim() : null
                }
              } else {
                data[key] = {
                  name: element.textContent?.trim(),
                  link: element.getAttribute('href')
                }
              }
            }

            return data
          }),
        blog.selectorConfig
      )

      posts = [...posts, ...newPosts]

      // Find the link to the next page.
      const nextPageLink = await page.$$eval(blog.selectorPagination, (elements) =>
        elements.length ? elements[0].getAttribute('href') : null
      )

      if (!nextPageLink) {
        console.log(`genericScraper: last page ${posts.length}`)
        break
      }

      console.log('genericScraper: next page')
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await page.goto(nextPageLink)
    } catch (error: any) {
      console.error(`genericScraper: error scraping page - ${error.message}`)
      break
    }
  }

  return posts
}

export default scraperGeneric
