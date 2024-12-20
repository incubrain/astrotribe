// templates/entity/model.ejs
import type { BaseModel } from '@core/base/base.model'
import {} from '@prisma/client'

import type { ContentsModel } from '@content/models/contents.model'

import type { TagsModel } from '@content/models/tags.model'

// Model interface
export interface ContentTagsModel extends BaseModel {
  content_id: string

  tag_id: number

  contents: ContentsModel

  tags: TagsModel
}
