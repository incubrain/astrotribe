import type { NewsListGovernmentT } from '@/types/news'

export type ScraperWebsitesT = NewsListGovernmentT | 'arxiv'

export interface ExtractionConfig {
  selector: string
  extract: 'text' | 'attribute'
  attributeName?: string // Optional, only needed for attribute extraction
}

export interface SelectorConfigLink {
  title: ExtractionConfig
  url: ExtractionConfig
  description?: ExtractionConfig
  featured_image?: ExtractionConfig
  published_at?: ExtractionConfig
}

export interface SelectorConfigPage {
  body: ExtractionConfig
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
  selectorBaseCard: string
  selectorPagination: string
  selectorConfigLink: SelectorConfigLink
  selectorBasePage: string
  selectorConfigPage: SelectorConfigPage
}

export type ScraperCategoriesT = 'news-government' | 'news-private' | 'research'
