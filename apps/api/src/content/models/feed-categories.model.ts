// templates/entity/model.ejs
import { BaseModel } from '@core'
import { FeedsModel, CategoriesModel } from '@content'

// import { UserProfilesModel } from "@auth/models/user-profiles.model";

// Model interface
export interface FeedCategoriesModel extends BaseModel {
  id: string

  created_at: Date

  feed_id?: string

  category_id?: string

  categories?: CategoriesModel

  feeds?: FeedsModel

  // user_profiles?: UserProfilesModel[];
}
