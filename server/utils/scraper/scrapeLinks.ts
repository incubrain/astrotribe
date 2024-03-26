import { Page } from 'playwright'
import type { ScraperT, SelectorConfigLink } from '@/types/scraper'

export default async function (page: Page, website: ScraperT): Promise<any[]> {
  console.log('scrapeLinks: ', website.name)

  const links: any[] = []

  for (const urlIndex in website.urls) {
    console.log('scrapeLinks: ', website.urls[urlIndex])
    await page.goto(website.urls[urlIndex], {
      waitUntil: 'domcontentloaded',
      timeout: 0
    })

    const linkData: any[] = await page
      .locator(website.selectorBaseCard)
      .evaluateAll((page, website: ScraperT) => {
        return page.map((article) => {
          const data: { [key: string]: any } = {}
          data.source = website.name

          for (const key in website.selectorConfigLink) {
            const config = website.selectorConfigLink[key as keyof SelectorConfigLink]
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
      }, website)

    if (!linkData) {
      console.error('no data from scraper')
      continue
    }
    links.push(...linkData)
  }

  const formattedLinks = formatLinks(links, website.baseUrl)
  if (!formattedLinks) {
    return []
  }
  return formattedLinks
}
