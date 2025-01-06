import { BaseEntity } from '@core/base/entity';
import { Imfa_challenges } from './mfa_challenges.interface';
import { Iusers } from './users.interface';


/**
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Imfa_factors extends BaseEntity {
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
   * @validation @IsString
   */
  friendly_name?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  factor_type: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  status: any;
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
   * @validation @IsString
   */
  secret?: string;
  /**
   * 
   * @validation @IsString
   */
  phone?: string;
  /**
   * 
   * @validation @IsDate
   */
  last_challenged_at?: Date;
  /**
   * 
   */
  web_authn_credential?: Record<string, any>;
  /**
   * 
   * @validation @IsString
   */
  web_authn_aaguid?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  mfa_challenges: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  users: any;
}

export interface Imfa_factorsWithmfa_challenges
extends Imfa_factors
{
mfa_challenges:
Imfa_challenges; }

export interface Imfa_factorsWithusers
extends Imfa_factors
{
users:
Iusers; }

export type Partialmfa_factors = Partial<Imfa_factors>;
export type Requiredmfa_factors = Required<Imfa_factors>;