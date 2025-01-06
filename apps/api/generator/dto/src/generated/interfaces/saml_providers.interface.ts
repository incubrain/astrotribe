import { BaseEntity } from '@core/base/entity';
import { Isso_providers } from './sso_providers.interface';


/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Isaml_providers extends BaseEntity {
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
  entity_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  metadata_xml: string;
  /**
   * 
   * @validation @IsString
   */
  metadata_url?: string;
  /**
   * 
   */
  attribute_mapping?: Record<string, any>;
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
  name_id_format?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  sso_providers: any;
}

export interface Isaml_providersWithsso_providers
extends Isaml_providers
{
sso_providers:
Isso_providers; }

export type Partialsaml_providers = Partial<Isaml_providers>;
export type Requiredsaml_providers = Required<Isaml_providers>;