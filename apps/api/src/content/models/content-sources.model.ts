// templates/entity/model.ejs
import { BaseModel } from '@core/base/base.model'
import { content_type, scrape_frequency, priority } from '@prisma/client'
import { CategoriesModel } from '@content/models/categories.model'

// Model interface
export interface ContentSourcesModel extends BaseModel {
  id: string

  url: string

  content_type: content_type

  scrape_frequency: scrape_frequency

  created_at?: Date

  updated_at?: Date

  refreshed_at?: Date

  has_failed?: boolean

  failed_count?: number

  priority: priority

  hash?: string

  scraped_at?: Date

  expected_count?: number

  company_id?: string

  rss_urls?: string[]

  // companies?: CompaniesModel;

  contentSources?: ContentSourcesModel[]

  // socialMedia?: SocialMediaModel[];

  categories?: CategoriesModel[]
}
