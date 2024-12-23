// templates/entity/model.ejs
import { BaseModel } from '@core'
import { ContentModel, CategoryModel, TagModel } from '@content'

// Model interface
export interface ContentTagModel extends BaseModel {
  content_id: string
  tag_id: number
  contents: ContentModel
  tags: TagModel
}
