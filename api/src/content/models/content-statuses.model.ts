// templates/entity/model.ejs
import { BaseModel } from "@/core/base/base.model";
import { content_status } from "@prisma/client";

import { ContentsModel } from "@content/models/contents.model";

// Model interface
export interface ContentStatusesModel extends BaseModel {
  id: string;

  content_id: string;

  notes?: string;

  created_at?: Date;

  content_status: content_status;

  contents: ContentsModel;
}
