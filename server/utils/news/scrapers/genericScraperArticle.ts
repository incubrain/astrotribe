import { Page } from 'playwright'
import type { ScraperT, SelectorConfigArticle } from '@/types/scraper'

export default async function (page: Page, blog: ScraperT): Promise<any> {
  console.log('genericScraperArticle: scrape', blog.name)

  try {
    await page.waitForSelector(blog.selectorBaseArticle, { timeout: 5000 })
  } catch (error) {
    console.warn(`The main selector ${blog.selectorBaseArticle} was not found.`)
  }

  const pageUrl = page.url()

  const articleData = await page
    .locator(blog.selectorBaseArticle)
    .evaluate((article, selectorConfig: SelectorConfigArticle) => {
      const data: { [key: string]: any } = {}

      for (const key in selectorConfig) {
        const config = selectorConfig[key as keyof SelectorConfigArticle]

        if (!config) {
          console.error('No config for', key)
          data[key] = null
          continue
        }

        let element
        if (config.selector === 'self') {
          element = article
        } else {
          element = article.querySelector(config.selector)
        }

        if (key === 'body' && !element) {
          element = article.querySelector('article') ?? article.querySelector('body')
        }

        if (!element) {
          console.error('No element for', key)
          data[key] = null
          continue
        }

        if (config.extract === 'attribute' && config.attributeName) {
          data[key] = element.getAttribute(config.attributeName)
        } else {
          data[key] = element.textContent?.replace(/\n/g, ' ').trim()
        }
      }
      return data
    }, blog.selectorConfigArticle)

  return {
    articleData,
    pageUrl
  }
}
