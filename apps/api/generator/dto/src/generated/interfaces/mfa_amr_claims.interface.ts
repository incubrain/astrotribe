import { BaseEntity } from '@core/base/entity';
import { Isessions } from './sessions.interface';


/**
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Imfa_amr_claims extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  session_id: string;
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
   * @validation @IsNotEmpty, @IsString
   */
  authentication_method: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  sessions: any;
}

export interface Imfa_amr_claimsWithsessions
extends Imfa_amr_claims
{
sessions:
Isessions; }

export type Partialmfa_amr_claims = Partial<Imfa_amr_claims>;
export type Requiredmfa_amr_claims = Required<Imfa_amr_claims>;