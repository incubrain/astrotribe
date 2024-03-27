import type { NewsListGovernmentT } from '@/types/news'

export type ScraperWebsitesT = NewsListGovernmentT | 'arxiv'

export interface ExtractionConfig {
  selector: string
  extract: 'text' | 'attribute'
  attributeName?: string // Optional, only needed for attribute extraction
}

export interface SelectorConfigLink {
  url: ExtractionConfig
  title?: ExtractionConfig
  description?: ExtractionConfig
  featured_image?: ExtractionConfig
  published_at?: ExtractionConfig
}

export interface SelectorConfigPage {
  body?: ExtractionConfig
  title?: ExtractionConfig
  description?: ExtractionConfig
  featured_image?: ExtractionConfig
  author?: ExtractionConfig
  published_at?: ExtractionConfig
}

// Represents the structure and configuration for a specific blog.
export interface ScraperT {
  id: number
  name: ScraperWebsitesT
  urls: string[]
  baseUrl: string
  selectorBaseLink: string
  selectorPagination: string
  selectorConfigLink: SelectorConfigLink
  selectorBasePage: string
  selectorConfigPage: SelectorConfigPage
  selectorIgnore?: string[]
}

export type ScraperCategoriesT = 'news-government' | 'news-private' | 'research'
