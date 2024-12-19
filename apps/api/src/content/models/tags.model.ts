// templates/entity/model.ejs
import { BaseModel } from '@core/base/base.model'
import {} from '@prisma/client'

// Model interface
export interface TagsModel extends BaseModel {
  id: number

  body?: string

  name: string

  document_id?: string

  locale?: string

  published_at?: string

  created_at?: Date

  updated_at?: Date

  tags: TagsModel[]
}
