// templates/entity/model.ejs
import { BaseModel } from '@core'
import type { ContentStatus } from '@astronera/db'
import { ContentModel, CategoryModel } from '@content'

// Model interface
export interface ResearchModel extends BaseModel {
  created_at: Date
  updated_at?: Date
  published_at?: Date
  title?: string
  version?: number
  id: string
  abstract?: string
  month?: string
  year?: string
  abstract_url: string
  category?: string
  doi_url?: string
  figure_count?: number
  has_embedding?: boolean
  page_count?: number
  pdf_url?: string
  published_in?: string
  table_count?: number
  comments?: string
  is_flagged: boolean
  authors?: Record<string, any>
  summary?: string
  content_status: ContentStatus
  affiliations?: Record<string, any>
  contents: ContentModel
  research: ResearchModel[]
}
