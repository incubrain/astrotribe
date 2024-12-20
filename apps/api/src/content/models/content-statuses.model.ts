// templates/entity/model.ejs
import { BaseModel } from '@core'
import type { content_status } from '@prisma/client'
import { ContentsModel, CategoriesModel } from '@content'

// Model interface
export interface ContentStatusesModel extends BaseModel {
  id: string

  content_id: string

  notes?: string

  created_at?: Date

  content_status: content_status

  contents: ContentsModel
}
