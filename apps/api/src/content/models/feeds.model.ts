// templates/entity/model.ejs
import { BaseModel } from '@core'
import { Prisma } from '@astronera/db'

// import { UserProfilesModel } from '@auth/models/user-profiles.model';

// Model interface
export interface FeedModel extends BaseModel {
  id: string
  created_at: Date
  name?: string
  user_id?: string
  feeds?: FeedModel[]
}
