import { BaseEntity } from '@core/base/entity';
import { Iresearch_embeddings } from './research_embeddings.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iembedding_reviews extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty
   */
  id: bigint;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  created_at: Date;
  /**
   * 
   * @validation @IsDate
   */
  updated_at?: Date;
  /**
   * 
   * @validation @IsBoolean
   */
  agent_review?: boolean;
  /**
   * 
   * @validation @IsBoolean
   */
  human_review?: boolean;
  /**
   * 
   * @validation @IsString
   */
  notes?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  research_embeddings: any;
}

export interface Iembedding_reviewsWithresearch_embeddings
extends Iembedding_reviews
{
research_embeddings:
Iresearch_embeddings; }

export type Partialembedding_reviews = Partial<Iembedding_reviews>;
export type Requiredembedding_reviews = Required<Iembedding_reviews>;