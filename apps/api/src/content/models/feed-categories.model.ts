// templates/entity/model.ejs
import { BaseModel } from '@core'
import { FeedModel, CategoryModel } from '@content'

// import { UserProfilesModel } from "@auth/models/user-profiles.model";

// Model interface
export interface FeedCategoryModel extends BaseModel {
  id: string

  created_at: Date

  feed_id?: string

  category_id?: string
  categories?: CategoryModel
  feeds?: FeedModel

  // user_profiles?: UserProfilesModel[];
}
