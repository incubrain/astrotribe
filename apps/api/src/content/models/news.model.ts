// templates/entity/model.ejs
import { BaseModel } from '@core'
import type { scrape_frequency, content_status } from '@prisma/client'
import type { ContentSourceModel, ContentModel, CategoryModel } from '@content'

// Model interface
export interface NewsModel extends BaseModel {
  created_at: Date

  updated_at: Date
  title?: string
  body?: string
  category_id?: string
  author?: string
  description?: string
  featured_image?: string
  has_summary: boolean
  published_at?: Date
  url: string
  hash?: string
  id: string
  company_id?: string
  failed_count?: number
  scrape_frequency: scrape_frequency
  scraped_at?: Date
  content_status: content_status
  keywords?: Record<string, any>
  score?: number
  content_source_id?: string
  content_sources?: ContentSourceModel
  news: NewsModel[]
  categories?: CategoryModel[]
  contents: ContentModel
  // companies?: CompaniesModel[];
  // social_media?: SocialMediaModel[];
}
