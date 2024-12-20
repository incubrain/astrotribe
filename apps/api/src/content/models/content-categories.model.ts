// templates/entity/model.ejs
import type { BaseModel } from '@core/base/base.model'
import {} from '@prisma/client'

import type { CategoriesModel } from '@content/models/categories.model'

import type { ContentsModel } from '@content/models/contents.model'

// Model interface
export interface ContentCategoriesModel extends BaseModel {
  content_id: string

  category_id: string

  is_primary: boolean

  categories: CategoriesModel

  contents: ContentsModel
}
