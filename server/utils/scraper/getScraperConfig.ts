import { configResearch } from './configs/configResearch'
import { configNewsGovernment } from './configs/configNewsGovernment'
import { configNewsPrivate } from './configs/configNewsPrivate'
import type { ScraperCategoriesT, ScraperWebsitesT, ScraperT } from '@/types/scraper'

interface ConfigT {
  singleWebsite?: ScraperWebsitesT
  scraperCategory: ScraperCategoriesT
}

export default function ({ singleWebsite, scraperCategory }: ConfigT): ScraperT[] {
  switch (scraperCategory) {
    case 'news-government':
      return singleWebsite
        ? configNewsGovernment.filter((blog) => blog.name === singleWebsite)
        : configNewsGovernment
    case 'news-private':
      return singleWebsite
        ? configNewsPrivate.filter((blog) => blog.name === singleWebsite)
        : configNewsPrivate
    case 'research':
      return singleWebsite
        ? configResearch.filter((blog) => blog.name === singleWebsite)
        : configResearch
    default:
      return configNewsGovernment
  }
}
