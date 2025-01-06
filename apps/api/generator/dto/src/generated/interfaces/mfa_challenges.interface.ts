import { BaseEntity } from '@core/base/entity';
import { Imfa_factors } from './mfa_factors.interface';


/**
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Imfa_challenges extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  factor_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  created_at: Date;
  /**
   * 
   * @validation @IsDate
   */
  verified_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  ip_address: string;
  /**
   * 
   * @validation @IsString
   */
  otp_code?: string;
  /**
   * 
   */
  web_authn_session_data?: Record<string, any>;
  /**
   * 
   * @validation @IsNotEmpty
   */
  mfa_factors: any;
}

export interface Imfa_challengesWithmfa_factors
extends Imfa_challenges
{
mfa_factors:
Imfa_factors; }

export type Partialmfa_challenges = Partial<Imfa_challenges>;
export type Requiredmfa_challenges = Required<Imfa_challenges>;