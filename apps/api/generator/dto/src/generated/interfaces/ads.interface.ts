import { BaseEntity } from '@core/base/entity';
import { Iad_variants } from './ad_variants.interface';
import { Icompanies } from './companies.interface';
import { Iad_packages } from './ad_packages.interface';


/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iads extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsString
   */
  company_id?: string;
  /**
   * 
   * @validation @IsString
   */
  package_id?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  start_date: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  end_date: Date;
  /**
   * 
   * @validation @IsBoolean
   */
  active?: boolean;
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
  ad_variants: any;
  /**
   * 
   */
  companies?: any;
  /**
   * 
   */
  ad_packages?: any;
}

export interface IadsWithad_variants
extends Iads
{
ad_variants:
Iad_variants; }

export interface IadsWithcompanies
extends Iads
{
companies:
Icompanies; }

export interface IadsWithad_packages
extends Iads
{
ad_packages:
Iad_packages; }

export type Partialads = Partial<Iads>;
export type Requiredads = Required<Iads>;