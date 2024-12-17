// templates/entity/model.ejs
import { BaseModel } from "@/core/base/base.model";
import {} from "@prisma/client";

// import { CompaniesModel } from "@org/models/companies.model";
// import { UserProfilesModel } from "@auth/models/user-profiles.model";

import { FeedsModel } from "@content/models/feeds.model";


import { ContentSourcesModel } from "@content/models/content-sources.model";

// Model interface
export interface FeedSourcesModel extends BaseModel {
  id: string;

  feed_id?: string;

  created_at: Date;

  content_source_id?: string;

  
  feeds?: FeedsModel;
  
  // companies?: CompaniesModel[];
  // user_profiles?: UserProfilesModel[];

  content_sources?: ContentSourcesModel;
}
