// templates/entity/model.ejs
import type { BaseModel } from '@core/base/base.model'
import {} from '@prisma/client'

import type { CategoriesModel } from '@content/models/categories.model'

import type { FeedsModel } from '@content/models/feeds.model'

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
