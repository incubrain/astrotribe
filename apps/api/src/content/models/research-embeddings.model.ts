// templates/entity/model.ejs
import { BaseModel } from '@core'
import type { EmbeddingReviewsModel } from '@content/models/embedding-reviews.model'
import { ContentsModel, CategoriesModel } from '@content'
import type { ResearchModel } from '@content/models/research.model'

// Model interface
export interface ResearchEmbeddingsModel extends BaseModel {
  id: number

  research_id: string

  chunk: string

  url?: string

  embedding?: string

  created_at?: Date

  is_flagged?: boolean

  updated_at: Date

  embedding_review_id?: string

  embeddingReviews?: EmbeddingReviewsModel

  contents: ContentsModel[]

  research: ResearchModel
}
