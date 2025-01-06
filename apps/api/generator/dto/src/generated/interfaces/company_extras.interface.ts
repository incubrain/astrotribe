import { BaseEntity } from '@core/base/entity';
import { Icompanies } from './companies.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icompany_extras extends BaseEntity {
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
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  level: number;
  /**
   * 
   * @validation @IsString
   */
  company_id?: string;
  /**
   * 
   * @validation @IsString
   */
  body?: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  found_count?: number;
  /**
   * 
   */
  review?: Record<string, any>;
  /**
   * 
   */
  companies?: any;
}

export interface Icompany_extrasWithcompanies
extends Icompany_extras
{
companies:
Icompanies; }

export type Partialcompany_extras = Partial<Icompany_extras>;
export type Requiredcompany_extras = Required<Icompany_extras>;