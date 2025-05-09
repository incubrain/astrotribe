// templates/entity/model.ejs
import { BaseModel } from '@core'

import type { FeedModel } from '@content/models/feeds.model'

import type { ContentSourceModel } from '@content/models/content-sources.model'

// Model interface
export interface FeedSourceModel extends BaseModel {
  id: string

  feed_id?: string

  created_at: Date

  source_id?: string

  feeds?: FeedModel

  // companies?: CompaniesModel[];
  // user_profiles?: UserProfilesModel[];

  content_sources?: ContentSourceModel
}
