import { BaseEntity } from '@core/base/entity';
import { Isaml_providers } from './saml_providers.interface';
import { Isaml_relay_states } from './saml_relay_states.interface';
import { Isso_domains } from './sso_domains.interface';


/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
This model contains an expression index which requires additional setup for migrations. Visit https://pris.ly/d/expression-indexes for more info.
 */
export interface Isso_providers extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsString
   */
  resource_id?: string;
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
  saml_providers: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  saml_relay_states: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  sso_domains: any;
}

export interface Isso_providersWithsaml_providers
extends Isso_providers
{
saml_providers:
Isaml_providers; }

export interface Isso_providersWithsaml_relay_states
extends Isso_providers
{
saml_relay_states:
Isaml_relay_states; }

export interface Isso_providersWithsso_domains
extends Isso_providers
{
sso_domains:
Isso_domains; }

export type Partialsso_providers = Partial<Isso_providers>;
export type Requiredsso_providers = Required<Isso_providers>;