import { BaseEntity } from '@core/base/entity';
import { Iusers } from './users.interface';


/**
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iidentities extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  provider_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  user_id: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  identity_data: Record<string, any>;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  provider: string;
  /**
   * 
   * @validation @IsDate
   */
  last_sign_in_at?: Date;
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
  email?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  users: any;
}

export interface IidentitiesWithusers
extends Iidentities
{
users:
Iusers; }

export type Partialidentities = Partial<Iidentities>;
export type Requiredidentities = Required<Iidentities>;