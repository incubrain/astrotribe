// templates/entity/model.ejs
import { BaseModel } from '@core'

// Model interface
export interface EmbeddingReviewModel extends BaseModel {
  id: string

  created_at: Date

  updated_at?: Date

  agent_review?: boolean

  human_review?: boolean

  notes?: string

  embeddingReviews?: EmbeddingReviewModel[]
}
