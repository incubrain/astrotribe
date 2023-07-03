import { Browser, Page } from 'puppeteer'

interface SelectorConfig {
  [key: string]: string
}

interface Blog {
  name: string
  url: string
  selectorConfig: SelectorConfig
}

interface ScrapeFunction {
  (browser: Browser, blog: Blog): Promise<any[]>
}

const scraperGeneric: ScrapeFunction = async (browser: Browser, blog: Blog) => {
  console.log(`genericScraper: scrape ${blog.name}`)
  let posts: any[] = []

  const page: Page = await browser.newPage()
  await page.goto(blog.url)

  while (true) {
    try {
      const newPosts = await page.$$eval(
        'article',
        (articles: HTMLElement[], selectorConfig: SelectorConfig) =>
          articles.map((article: HTMLElement) => {
            const data: { [key: string]: any } = {}

            for (const key in selectorConfig) {
              const node = article.querySelector(selectorConfig[key])
              if (!node) {
                if (key === 'featured_image') {
                  data[key] = null // set featured_image to null if not found
                  continue
                }
                throw new Error(`Missing ${key} node in article`)
              }

              if (key === 'content') {
                data[key] = node.textContent?.replace(/\n/g, ' ').trim()
              } else if (key === 'featured_image') {
                data[key] = node.getAttribute('src')
              } else {
                data[key] = {
                  name: node.textContent?.trim(),
                  link: node.getAttribute('href')
                }
              }
            }

            return data
          }),
        blog.selectorConfig
      )

      posts = [...posts, ...newPosts]

      const nextPageLink = await page.$$eval('.nav-links .next', (nodes) =>
        nodes.length ? nodes[0].getAttribute('href') : null
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
