// templates/entity/model.ejs
import { BaseModel } from '@core/base/base.model'
import {} from '@prisma/client'

import { TagsModel } from '@content/models/tags.model'

// Model interface
export interface NewsTagsModel extends BaseModel {
  id: number

  tag_id: number

  news_id?: string

  tags: TagsModel
}
