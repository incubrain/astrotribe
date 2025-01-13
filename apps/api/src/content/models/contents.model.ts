// templates/entity/model.ejs
import { BaseModel } from '@core'
import type { ContentType } from '@astronera/db'

// Model interface
export interface ContentModel extends BaseModel {
  id: string
  content_type: ContentType
  title?: string
  created_at?: Date
  updated_at?: Date
  url: string
  rss_url?: string
  hot_score?: number
  contents: ContentModel[]
}
