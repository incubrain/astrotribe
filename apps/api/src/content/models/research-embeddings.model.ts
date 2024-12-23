// templates/entity/model.ejs
import { BaseModel } from '@core'
import type { EmbeddingReviewModel } from '@content/models/embedding-reviews.model'
import { ContentModel, CategoryModel } from '@content'
import type { ResearchModel } from '@content/models/research.model'

// Model interface
export interface ResearchEmbeddingModel extends BaseModel {
  id: number

  research_id: string

  chunk: string

  url?: string

  embedding?: string

  created_at?: Date

  is_flagged?: boolean

  updated_at: Date

  embedding_review_id?: string

  embeddingReviews?: EmbeddingReviewModel

  contents: ContentModel[]

  research: ResearchModel
}
