import { BaseEntity } from '@core/base/entity';
import { Iusers } from './users.interface';


/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ione_time_tokens extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  user_id: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  token_type: any;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  token_hash: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  relates_to: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  created_at: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  updated_at: Date;
  /**
   * 
   * @validation @IsNotEmpty
   */
  users: any;
}

export interface Ione_time_tokensWithusers
extends Ione_time_tokens
{
users:
Iusers; }

export type Partialone_time_tokens = Partial<Ione_time_tokens>;
export type Requiredone_time_tokens = Required<Ione_time_tokens>;