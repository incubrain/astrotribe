import { BaseEntity } from '@core/base/entity';
import { Ifeature_requests } from './feature_requests.interface';


/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ifeature_votes extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  feature_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  user_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  vote_type: number;
  /**
   * 
   * @validation @IsString
   */
  feedback?: string;
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
   * @validation @IsNotEmpty
   */
  feature_requests: any;
}

export interface Ifeature_votesWithfeature_requests
extends Ifeature_votes
{
feature_requests:
Ifeature_requests; }

export type Partialfeature_votes = Partial<Ifeature_votes>;
export type Requiredfeature_votes = Required<Ifeature_votes>;