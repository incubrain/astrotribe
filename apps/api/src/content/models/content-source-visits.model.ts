// templates/entity/model.ejs
import type { BaseModel } from '@core/base/base.model'
import {} from '@prisma/client'

import type { ContentsModel } from '@content/models/contents.model'

// Model interface
export interface ContentSourceVisitsModel extends BaseModel {
  id: string

  content_id: string

  user_id?: string

  created_at?: Date

  contents: ContentsModel

  // userProfiles?: UserProfilesModel;
}