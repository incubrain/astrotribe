// templates/entity/model.ejs
import { BaseModel } from '@core'
import { TagsModel } from '@content'

// Model interface
export interface NewsTagsModel extends BaseModel {
  id: number

  tag_id: number

  news_id?: string

  tags: TagsModel
}
