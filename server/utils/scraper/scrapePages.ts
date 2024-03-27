import { Page } from 'playwright'
import type { ScraperT, SelectorConfigPage } from '@/types/scraper'

interface ConfigT {
  page: Page
  website: ScraperT
  links: any[]
}

export default async function ({ page, website, links }: ConfigT): Promise<any> {
  console.log('scrapePages: scrape', website.name)
  const pages = []

  let realBaseUrl = website.baseUrl

  for (const link of links) {
    let gotoUrl = link.url
    if (link.version) {
      console.log('scrapePages: link version', link.version)
      gotoUrl = `${link.url}v${link.version}`
    }

    await page.goto(gotoUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 0
    })

    try {
      await page.waitForSelector(website.selectorBasePage, { timeout: 5000 })
    } catch (error) {
      console.warn(`The main selector ${website.selectorBasePage} was not found.`)
    }

    for (const ignoreSelector of website.selectorIgnore ?? []) {
      await page.evaluate((selector) => {
        document.querySelectorAll(selector).forEach((el) => el.remove())
      }, ignoreSelector)
    }

    const pageUrl = page.url()

    const pageData = await page
      .locator(website.selectorBasePage)
      .evaluate((article, selectorConfig: SelectorConfigPage) => {
        const data: { [key: string]: any } = {}

        for (const key in selectorConfig) {
          const config = selectorConfig[key as keyof SelectorConfigPage]

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
      }, website.selectorConfigPage)

    if (pageUrl !== link.url && !link.version) {
      console.log(`Redirect detected. Original URL: ${link.url}, Final URL: ${pageUrl}`)
      // Update the stored URL with the final URL
      link.url = pageUrl

      const urlObj = new URL(pageUrl)
      realBaseUrl = `${urlObj.protocol}//${urlObj.host}`
    }
    // console.log('arxiv article:', pageData)
    pages.push({ ...link, ...pageData })
  }

  const formattedPages = formatPages(pages, realBaseUrl)
  if (!formattedPages) {
    return []
  }
  console.log('scrapePages: formattedPages', formattedPages.length)
  return formattedPages
}
