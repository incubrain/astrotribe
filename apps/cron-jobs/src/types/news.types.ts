export interface ContentSource {
  id: bigint
  company_id: string
  url: string
  rss_urls: string[]
  hash: bigint
  has_failed: boolean
  failed_count: number
  refreshed_at: Date
  expected_count?: number
}

export interface NewsArticle {
  id: string
  title: string
  url: string
  description?: string
  body?: string
  author?: string
  published_at: Date
  categories?: { name: string }[]
  news_summaries?: { summary: string }[]
  content_status: string
  category_id?: string
}

export interface ArticleInput {
  title: string
  summary: string
  body: string
  author: string
}

export interface ProcessedContent {
  id: string
  title: string
  content: string
  status: string
  metadata?: Record<string, any>
}

export interface NewsletterInput {
  timezone: {
    name: string
    offset: number
  }
  articles: {
    title: string
    summary: string
    category: string
    published_at: Date
    url: string
  }[]
  template: {
    id: string
    content: string
  }
}

export interface NewsletterOutput {
  id: string
  content: string
  timezone: string
  created_at: Date
  metadata: {
    articleCount: number
    categories: string[]
    template: string
  }
}
