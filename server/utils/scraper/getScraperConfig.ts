import { researchConfig } from '../research/researchConfig'
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
        ? researchConfig.filter((blog) => blog.name === singleWebsite)
        : researchConfig
    default:
      return configNewsGovernment
  }
}
