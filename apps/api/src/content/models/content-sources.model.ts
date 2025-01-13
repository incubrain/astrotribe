// templates/entity/model.ejs
import type { ContentType, ScrapeFrequency, Priority } from '@astronera/db'
import { BaseModel } from '@core'
import type { CategoryModel } from '@content'

// Model interface
export interface ContentSourceModel extends BaseModel {
  id: string

  url: string

  content_type: ContentType

  scrape_frequency: ScrapeFrequency

  created_at?: Date

  updated_at?: Date

  refreshed_at?: Date

  has_failed?: boolean

  failed_count?: number

  priority: Priority

  hash?: string

  scraped_at?: Date

  expected_count?: number

  company_id?: string

  rss_urls?: string[]

  // companies?: CompaniesModel;

  contentSources?: ContentSourceModel[]

  // socialMedia?: SocialMediaModel[];

  categories?: CategoryModel[]
}
