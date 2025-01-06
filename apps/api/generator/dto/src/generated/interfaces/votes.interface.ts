import { BaseEntity } from '@core/base/entity';
import { Iusers } from './users.interface';


/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ivotes extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  content_type: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  content_id: string;
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
   * @validation @IsDate
   */
  created_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty
   */
  users: any;
}

export interface IvotesWithusers
extends Ivotes
{
users:
Iusers; }

export type Partialvotes = Partial<Ivotes>;
export type Requiredvotes = Required<Ivotes>;