import type { NewsCategoryT } from '@/types/news'

export interface ExtractionConfig {
  selector: string
  extract: 'text' | 'attribute'
  attributeName?: string // Optional, only needed for attribute extraction
}

export interface SelectorConfigCard {
  title: ExtractionConfig
  url: ExtractionConfig
  description?: ExtractionConfig
  featured_image?: ExtractionConfig
  published_at?: ExtractionConfig
}

export interface SelectorConfigArticle {
  body: ExtractionConfig
  description?: ExtractionConfig
  featured_image?: ExtractionConfig
  author?: ExtractionConfig
  published_at?: ExtractionConfig
}

// Represents the structure and configuration for a specific blog.
export interface ScraperT {
  id: number
  name: NewsCategoryT
  urls: string[]
  baseUrl: string
  selectorBaseCard: string
  selectorPagination: string
  selectorConfigCard: SelectorConfigCard
  selectorBaseArticle: string
  selectorConfigArticle: SelectorConfigArticle
}
