// templates/entity/model.ejs
import { BaseModel } from '@core/base/base.model';
import { Prisma } from '@prisma/client';

// import { UserProfilesModel } from '@auth/models/user-profiles.model';

// Model interface
export interface FeedsModel extends BaseModel {
  id: string;

  created_at: Date;

  name?: string;

  user_id?: string;

  feeds?: FeedsModel[];

  // user_profiles?: UserProfilesModel;
}
