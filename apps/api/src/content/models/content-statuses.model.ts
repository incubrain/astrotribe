// templates/entity/model.ejs
import { BaseModel } from '@core'
import type { ContentStatus } from '@astronera/db'
import { ContentModel, CategoryModel } from '@content'

// Model interface
export interface ContentStatusesModel extends BaseModel {
  id: string
  content_id: string
  notes?: string
  created_at?: Date
  content_status: ContentStatus
  contents: ContentModel
}
