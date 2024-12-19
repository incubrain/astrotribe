// templates/entity/model.ejs
import { BaseModel } from '@core/base/base.model'
import {} from '@prisma/client'

import { ContentsModel } from '@content/models/contents.model'

import { TagsModel } from '@content/models/tags.model'

// Model interface
export interface ContentTagsModel extends BaseModel {
  content_id: string

  tag_id: number

  contents: ContentsModel

  tags: TagsModel
}
