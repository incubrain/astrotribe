import { BaseEntity } from '@core/base/entity';
import { Imfa_amr_claims } from './mfa_amr_claims.interface';
import { Irefresh_tokens } from './refresh_tokens.interface';
import { Iusers } from './users.interface';


/**
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Isessions extends BaseEntity {
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
  factor_id?: string;
  /**
   * 
   */
  aal?: any;
  /**
   * 
   * @validation @IsDate
   */
  not_after?: Date;
  /**
   * 
   * @validation @IsDate
   */
  refreshed_at?: Date;
  /**
   * 
   * @validation @IsString
   */
  user_agent?: string;
  /**
   * 
   * @validation @IsString
   */
  ip?: string;
  /**
   * 
   * @validation @IsString
   */
  tag?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  mfa_amr_claims: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  refresh_tokens: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  users: any;
}

export interface IsessionsWithmfa_amr_claims
extends Isessions
{
mfa_amr_claims:
Imfa_amr_claims; }

export interface IsessionsWithrefresh_tokens
extends Isessions
{
refresh_tokens:
Irefresh_tokens; }

export interface IsessionsWithusers
extends Isessions
{
users:
Iusers; }

export type Partialsessions = Partial<Isessions>;
export type Requiredsessions = Required<Isessions>;