import { BaseEntity } from '@core/base/entity';
import { Isessions } from './sessions.interface';


/**
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Irefresh_tokens extends BaseEntity {
  /**
   * 
   * @validation @IsString
   */
  instance_id?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  id: bigint;
  /**
   * 
   * @validation @IsString
   */
  token?: string;
  /**
   * 
   * @validation @IsString
   */
  user_id?: string;
  /**
   * 
   * @validation @IsBoolean
   */
  revoked?: boolean;
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
   * @validation @IsString
   */
  parent?: string;
  /**
   * 
   * @validation @IsString
   */
  session_id?: string;
  /**
   * 
   */
  sessions?: any;
}

export interface Irefresh_tokensWithsessions
extends Irefresh_tokens
{
sessions:
Isessions; }

export type Partialrefresh_tokens = Partial<Irefresh_tokens>;
export type Requiredrefresh_tokens = Required<Irefresh_tokens>;