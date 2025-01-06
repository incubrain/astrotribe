import { BaseEntity } from '@core/base/entity';
import { Icompany_contacts } from './company_contacts.interface';
import { Icompanies } from './companies.interface';
import { Iuser_profiles } from './user_profiles.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icontacts extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsString
   */
  title?: string;
  /**
   * 
   * @validation @IsBoolean
   */
  is_primary?: boolean;
  /**
   * 
   * @validation @IsString
   */
  email?: string;
  /**
   * 
   */
  contact_type?: any;
  /**
   * 
   */
  privacy_level?: any;
  /**
   * 
   * @validation @IsString
   */
  user_id?: string;
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
  phone?: string;
  /**
   * 
   * @validation @IsString
   */
  company_id?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  company_contacts: any;
  /**
   * 
   */
  companies?: any;
  /**
   * 
   */
  user_profiles?: any;
}

export interface IcontactsWithcompany_contacts
extends Icontacts
{
company_contacts:
Icompany_contacts; }

export interface IcontactsWithcompanies
extends Icontacts
{
companies:
Icompanies; }

export interface IcontactsWithuser_profiles
extends Icontacts
{
user_profiles:
Iuser_profiles; }

export type Partialcontacts = Partial<Icontacts>;
export type Requiredcontacts = Required<Icontacts>;