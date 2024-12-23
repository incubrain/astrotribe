// templates/entity/model.ejs
import { BaseModel } from '@core'
import { ContentModel, CategoryModel, NewsModel, ContentSourceModel } from '@content'

// import { CompaniesModel } from "@org/models/companies.model";

// Model interface
export interface NewsSummaryModel extends BaseModel {
  id: string
  news_id: string

  summary?: string

  embedding?: string

  complexity_level?: string

  version: number

  is_current?: boolean

  created_at?: Date

  updated_at?: Date

  content_sources: ContentSourceModel[]

  news: NewsModel

  categories: CategoryModel[]

  // companies: CompaniesModel[];

  contents: ContentModel[]
}
