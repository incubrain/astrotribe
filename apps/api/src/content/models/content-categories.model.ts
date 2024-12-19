// templates/entity/model.ejs
import { BaseModel } from '@core/base/base.model'
import {} from '@prisma/client'

import { CategoriesModel } from '@content/models/categories.model'

import { ContentsModel } from '@content/models/contents.model'

// Model interface
export interface ContentCategoriesModel extends BaseModel {
  content_id: string

  category_id: string

  is_primary: boolean

  categories: CategoriesModel

  contents: ContentsModel
}
