import { BaseEntity } from '@core/base/entity';
import { Icompanies } from './companies.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iblacklisted_urls extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  url: string;
  /**
   * 
   * @validation @IsString
   */
  reason?: string;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
  /**
   * 
   * @validation @IsString
   */
  company_id?: string;
  /**
   * 
   */
  companies?: any;
}

export interface Iblacklisted_urlsWithcompanies
extends Iblacklisted_urls
{
companies:
Icompanies; }

export type Partialblacklisted_urls = Partial<Iblacklisted_urls>;
export type Requiredblacklisted_urls = Required<Iblacklisted_urls>;