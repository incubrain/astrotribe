// templates/entity/model.ejs
import { BaseModel } from '@core'
import { ContentModel, CategoryModel } from '@content'

// Model interface
export interface ContentCategoryModel extends BaseModel {
  content_id: string

  is_primary: boolean
  categories: CategoryModel
  contents: ContentModel
}
