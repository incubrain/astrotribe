import { BaseEntity } from '@core/base/entity';
import { Icities } from './cities.interface';
import { Icountries } from './countries.interface';
import { Icompanies } from './companies.interface';
import { Iuser_profiles } from './user_profiles.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iaddresses extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  street1: string;
  /**
   * 
   * @validation @IsString
   */
  street2?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  city_id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  country_id: number;
  /**
   * 
   * @validation @IsString
   */
  name?: string;
  /**
   * 
   * @validation @IsString
   */
  user_id?: string;
  /**
   * 
   * @validation @IsBoolean
   */
  is_primary?: boolean;
  /**
   * 
   */
  address_type?: any;
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
  company_id?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  cities: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  countries: any;
  /**
   * 
   */
  companies?: any;
  /**
   * 
   */
  user_profiles?: any;
}

export interface IaddressesWithcities
extends Iaddresses
{
cities:
Icities; }

export interface IaddressesWithcountries
extends Iaddresses
{
countries:
Icountries; }

export interface IaddressesWithcompanies
extends Iaddresses
{
companies:
Icompanies; }

export interface IaddressesWithuser_profiles
extends Iaddresses
{
user_profiles:
Iuser_profiles; }

export type Partialaddresses = Partial<Iaddresses>;
export type Requiredaddresses = Required<Iaddresses>;