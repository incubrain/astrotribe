import { BaseEntity } from '@core/base/entity';
import { Icompanies } from './companies.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icompany_urls extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  updated_at: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  created_at: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  url: string;
  /**
   * 
   * @validation @IsBoolean
   */
  success?: boolean;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  category: string;
  /**
   * 
   * @validation @IsString
   */
  company_id?: string;
  /**
   * 
   * @validation @IsString
   */
  content?: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  distance?: number;
  /**
   * 
   */
  companies?: any;
}

export interface Icompany_urlsWithcompanies
extends Icompany_urls
{
companies:
Icompanies; }

export type Partialcompany_urls = Partial<Icompany_urls>;
export type Requiredcompany_urls = Required<Icompany_urls>;