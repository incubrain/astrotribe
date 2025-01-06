import { BaseEntity } from '@core/base/entity';
import { Iembedding_reviews } from './embedding_reviews.interface';
import { Iresearch } from './research.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iresearch_embeddings extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  research_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  chunk: string;
  /**
   * 
   * @validation @IsString
   */
  url?: string;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
  /**
   * 
   * @validation @IsBoolean
   */
  is_flagged?: boolean;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  updated_at: Date;
  /**
   * 
   */
  embedding_review_id?: bigint;
  /**
   * 
   */
  embedding_reviews?: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  research: any;
}

export interface Iresearch_embeddingsWithembedding_reviews
extends Iresearch_embeddings
{
embedding_reviews:
Iembedding_reviews; }

export interface Iresearch_embeddingsWithresearch
extends Iresearch_embeddings
{
research:
Iresearch; }

export type Partialresearch_embeddings = Partial<Iresearch_embeddings>;
export type Requiredresearch_embeddings = Required<Iresearch_embeddings>;