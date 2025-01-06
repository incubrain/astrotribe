import { BaseEntity } from '@core/base/entity';
import { Ifeature_votes } from './feature_votes.interface';


/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ifeature_requests extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  title: string;
  /**
   * 
   * @validation @IsString
   */
  description?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  status: string;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
  /**
   * 
   * @validation @IsDate
   */
  updated_at?: Date;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  downvotes?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  engagement_score?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  priority_score?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  upvotes?: number;
  /**
   * 
   * @validation @IsNotEmpty
   */
  feature_votes: any;
}

export interface Ifeature_requestsWithfeature_votes
extends Ifeature_requests
{
feature_votes:
Ifeature_votes; }

export type Partialfeature_requests = Partial<Ifeature_requests>;
export type Requiredfeature_requests = Required<Ifeature_requests>;