// templates/entity/model.ejs
import { BaseModel } from '@core'
import { ContentModel, CategoryModel } from '@content'

// Model interface
export interface ContentSourceVisitsModel extends BaseModel {
  id: string
  content_id: string
  user_id?: string
  created_at?: Date
  contents: ContentModel

  // userProfiles?: UserProfilesModel;
}
