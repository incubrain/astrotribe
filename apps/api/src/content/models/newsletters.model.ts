// templates/entity/model.ejs
import { BaseModel } from '@core'
import type { content_status } from '@prisma/client'
import { ContentsModel, CategoriesModel } from '@content'

// Model interface
export interface NewslettersModel extends BaseModel {
  id: string
  title: string
  frequency: string
  start_date: Date
  end_date: Date
  generated_content?: string
  created_at?: Date
  updated_at?: Date
  content_status: content_status
  contents: ContentsModel
}
