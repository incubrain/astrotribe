// templates/entity/model.ejs
import { BaseModel } from '@core'
import { TagModel } from '@content'

// Model interface
export interface NewsTagModel extends BaseModel {
  id: number
  tag_id: number
  news_id?: string
  tags: TagModel
}
