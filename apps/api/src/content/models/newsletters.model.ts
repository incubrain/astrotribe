// templates/entity/model.ejs
import { BaseModel } from '@core'
import type { content_status } from '@prisma/client'
import { ContentModel, CategoryModel } from '@content'

// Model interface
export interface NewsletterModel extends BaseModel {
  id: string
  title: string
  frequency: string
  start_date: Date
  end_date: Date
  generated_content?: string
  created_at?: Date
  updated_at?: Date
  content_status: content_status
  contents: ContentModel
}
