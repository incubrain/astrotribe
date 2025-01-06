import { BaseEntity } from '@core/base/entity';
import { Iuser_profiles } from './user_profiles.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ifollows extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  followed_id: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  followed_entity: any;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  user_id: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  user_profiles: any;
}

export interface IfollowsWithuser_profiles
extends Ifollows
{
user_profiles:
Iuser_profiles; }

export type Partialfollows = Partial<Ifollows>;
export type Requiredfollows = Required<Ifollows>;