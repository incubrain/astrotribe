import { BaseEntity } from '@core/base/entity';
import { Isaml_relay_states } from './saml_relay_states.interface';


/**
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iflow_state extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsString
   */
  user_id?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  auth_code: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  code_challenge_method: any;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  code_challenge: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  provider_type: string;
  /**
   * 
   * @validation @IsString
   */
  provider_access_token?: string;
  /**
   * 
   * @validation @IsString
   */
  provider_refresh_token?: string;
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
   * @validation @IsNotEmpty, @IsString
   */
  authentication_method: string;
  /**
   * 
   * @validation @IsDate
   */
  auth_code_issued_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty
   */
  saml_relay_states: any;
}

export interface Iflow_stateWithsaml_relay_states
extends Iflow_state
{
saml_relay_states:
Isaml_relay_states; }

export type Partialflow_state = Partial<Iflow_state>;
export type Requiredflow_state = Required<Iflow_state>;