// templates/entity/model.ejs
import { BaseModel } from '@core'

// Model interface
export interface TagModel extends BaseModel {
  id: number
  body?: string
  name: string
  document_id?: string
  locale?: string
  published_at?: string
  created_at?: Date
  updated_at?: Date
  tags: TagModel[]
}
