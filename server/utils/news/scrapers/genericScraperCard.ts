import { Page } from 'playwright'
import type { Blog, SelectorConfigCard } from '../newsBlogs'

export default async function (page: Page, blog: Blog): Promise<any[]> {
  console.log('genericScraper: scrape', blog.name)

  const articlesData = await page
    .locator(blog.selectorBaseCard)
    .evaluateAll((articles, blog: Blog) => {
      return articles.map((article) => {
        const data: { [key: string]: any } = {}
        data.source = blog.name

        for (const key in blog.selectorConfigCard) {
          const config = blog.selectorConfigCard[key as keyof SelectorConfigCard]
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
      })
    }, blog)
  return articlesData
}
