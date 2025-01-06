import { BaseEntity } from '@core/base/entity';
import { Iflow_state } from './flow_state.interface';
import { Isso_providers } from './sso_providers.interface';


/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Isaml_relay_states extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  sso_provider_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  request_id: string;
  /**
   * 
   * @validation @IsString
   */
  for_email?: string;
  /**
   * 
   * @validation @IsString
   */
  redirect_to?: string;
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
  flow_state_id?: string;
  /**
   * 
   */
  flow_state?: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  sso_providers: any;
}

export interface Isaml_relay_statesWithflow_state
extends Isaml_relay_states
{
flow_state:
Iflow_state; }

export interface Isaml_relay_statesWithsso_providers
extends Isaml_relay_states
{
sso_providers:
Isso_providers; }

export type Partialsaml_relay_states = Partial<Isaml_relay_states>;
export type Requiredsaml_relay_states = Required<Isaml_relay_states>;