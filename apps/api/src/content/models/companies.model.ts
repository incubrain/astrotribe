// templates/entity/model.ejs
import { BaseModel } from '@core'
import type { ScrapeFrequency, ContentStatus } from '@astronera/db'

// Model interface
export interface CompanyModel extends BaseModel {
  name: string
  description: string
  logo_url: string
  url: string
  social_media_id: number
  scrape_frequency: ScrapeFrequency
  category_id: number
  created_at: Date
  updated_at: Date
  founding_year: number
  is_government: boolean
  category: string
  failed_count: number
  is_english: boolean
  scrape_rating: number
  id: string
  scraped_at: Date
  content_status: ContentStatus
  keywords: Record<string, any>
}
