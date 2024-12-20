// templates/entity/model.ejs
import type { BaseModel } from '@core/base/base.model'
import type { content_status } from '@prisma/client'

import type { ContentsModel } from '@content/models/contents.model'

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
