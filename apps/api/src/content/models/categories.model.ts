// templates/entity/model.ejs
import { BaseModel } from '@core'

// Model interface
export interface CategoriesModel extends BaseModel {
  id: string

  created_at: Date

  updated_at?: Date

  body?: string

  name: string

  document_id?: string

  locale?: string

  published_at?: string

  categories: CategoriesModel[]
}
