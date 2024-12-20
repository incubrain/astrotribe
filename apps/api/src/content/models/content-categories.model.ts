// templates/entity/model.ejs
import { BaseModel } from '@core'
import { ContentsModel, CategoriesModel } from '@content'

// Model interface
export interface ContentCategoriesModel extends BaseModel {
  content_id: string

  category_id: string

  is_primary: boolean

  categories: CategoriesModel

  contents: ContentsModel
}
