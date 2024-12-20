// templates/entity/model.ejs
import { BaseModel } from '@core'
import { ContentsModel, CategoriesModel, TagsModel } from '@content'

// Model interface
export interface ContentTagsModel extends BaseModel {
  content_id: string

  tag_id: number

  contents: ContentsModel

  tags: TagsModel
}
