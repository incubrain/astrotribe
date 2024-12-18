// templates/entity/model.ejs
import { BaseModel } from "../../core/base/base.model";
import {} from "@prisma/client";

// Model interface
export interface EmbeddingReviewsModel extends BaseModel {
  id: string;

  created_at: Date;

  updated_at?: Date;

  agent_review?: boolean;

  human_review?: boolean;

  notes?: string;

  embeddingReviews?: EmbeddingReviewsModel[];
}
