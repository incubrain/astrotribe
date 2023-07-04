import { Browser, Page } from 'puppeteer'

// maps the name of a data field to a CSS selector string that can be used to find the corresponding element on the page.
interface SelectorConfig {
  [key: string]: string
}

interface Blog {
  name: string
  url: string
  selectorConfig: SelectorConfig
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
        'article',
        (articles: HTMLElement[], selectorConfig: SelectorConfig) =>
          articles.map((article: HTMLElement) => {
            const data: { [key: string]: any } = {}

            // For each key in the selectorConfig, find the corresponding element
            for (const key in selectorConfig) {
              const element = article.querySelector(selectorConfig[key])
              if (!element) {
                if (key === 'featured_image') {
                  data[key] = null // set featured_image to null if not found
                  continue
                }
                throw new Error(`Missing ${key} element in article`)
              }

              if (key === 'content') {
                data[key] = element.textContent?.replace(/\n/g, ' ').trim()
              } else if (key === 'featured_image') {
                data[key] = element.getAttribute('src')
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
      const nextPageLink = await page.$$eval('.nav-links .next', (elements) =>
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
