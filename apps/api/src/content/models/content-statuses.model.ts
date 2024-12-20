// templates/entity/model.ejs
import type { BaseModel } from '@core/base/base.model'
import type { content_status } from '@prisma/client'

import type { ContentsModel } from '@content/models/contents.model'

// Model interface
export interface ContentStatusesModel extends BaseModel {
  id: string

  content_id: string

  notes?: string

  created_at?: Date

  content_status: content_status

  contents: ContentsModel
}
