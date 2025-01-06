import { BaseEntity } from '@core/base/entity';
import { Iuser_profiles } from './user_profiles.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icompany_employees extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  role: string;
  /**
   * 
   * @validation @IsString
   */
  job_description?: string;
  /**
   * 
   * @validation @IsDate
   */
  start_date?: Date;
  /**
   * 
   * @validation @IsDate
   */
  end_date?: Date;
  /**
   * 
   * @validation @IsBoolean
   */
  status?: boolean;
  /**
   * 
   * @validation @IsNotEmpty
   */
  access_level: any;
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
   * @validation @IsNotEmpty, @IsString
   */
  user_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  user_profiles: any;
}

export interface Icompany_employeesWithuser_profiles
extends Icompany_employees
{
user_profiles:
Iuser_profiles; }

export type Partialcompany_employees = Partial<Icompany_employees>;
export type Requiredcompany_employees = Required<Icompany_employees>;