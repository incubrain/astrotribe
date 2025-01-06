import { BaseEntity } from '@core/base/entity';
import { Isso_providers } from './sso_providers.interface';


/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
This model contains an expression index which requires additional setup for migrations. Visit https://pris.ly/d/expression-indexes for more info.
 */
export interface Isso_domains extends BaseEntity {
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
  domain: string;
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
  sso_providers: any;
}

export interface Isso_domainsWithsso_providers
extends Isso_domains
{
sso_providers:
Isso_providers; }

export type Partialsso_domains = Partial<Isso_domains>;
export type Requiredsso_domains = Required<Isso_domains>;