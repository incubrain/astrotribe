import { BaseEntity } from '@core/base/entity';
import { Icompanies } from './companies.interface';
import { Icontacts } from './contacts.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icompany_contacts extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  contact_id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  created_at: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  updated_at: Date;
  /**
   * 
   * @validation @IsString
   */
  company_id?: string;
  /**
   * 
   */
  companies?: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  contacts: any;
}

export interface Icompany_contactsWithcompanies
extends Icompany_contacts
{
companies:
Icompanies; }

export interface Icompany_contactsWithcontacts
extends Icompany_contacts
{
contacts:
Icontacts; }

export type Partialcompany_contacts = Partial<Icompany_contacts>;
export type Requiredcompany_contacts = Required<Icompany_contacts>;