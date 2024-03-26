import { Page } from 'playwright'
import { H3Event } from 'h3'
import type { ScraperCategoriesT, ScraperWebsitesT } from '@/types/scraper'

interface ConfigT {
  config: {
    scraperCategory: ScraperCategoriesT
    tableName: string
    singleWebsite?: ScraperWebsitesT
    conflictRow?: string
  }
  event: H3Event
}

export default async function ({ config, event }: ConfigT) {
  const browser = await scraperClient()
  try {
    const page: Page = await browser.newPage()

    const newsWebsites = getScraperConfig({
      scraperCategory: config.scraperCategory,
      singleWebsite: config.singleWebsite
    })

    for (const website of newsWebsites) {
      const links = await scrapeLinks(page, website)

      if (!links) {
        console.error('no links from scraper')
        return {
          status: 500,
          message: `Error scraping ${config.scraperCategory} links`
        }
      }

      const data = await scrapePages({ page, website, links })
      if (!data) {
        console.error('no pages from scraper')
        return {
          status: 500,
          message: `Error scraping ${config.scraperCategory} pages`
        }
      }

      await storeScrapedData({
        event,
        data,
        tableName: config.tableName,
        conflictRow: config.conflictRow
      })
    }

    await browser.close()

    return {
      status: 200,
      message: `scraped and stored ${config.scraperCategory} in supabase`
    }
  } catch (error: any) {
    console.error(`${config.scraperCategory} scraper error`, error.message)
    await browser.close()

    return {
      status: 500,
      message: `Error storing ${config.scraperCategory}`,
      error
    }
  }
}
