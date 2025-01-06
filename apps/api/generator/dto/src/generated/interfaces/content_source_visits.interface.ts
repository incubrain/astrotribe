import { BaseEntity } from '@core/base/entity';
import { Icontents } from './contents.interface';
import { Iuser_profiles } from './user_profiles.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icontent_source_visits extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  content_id: string;
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
   * @validation @IsNotEmpty
   */
  contents: any;
  /**
   * 
   */
  user_profiles?: any;
}

export interface Icontent_source_visitsWithcontents
extends Icontent_source_visits
{
contents:
Icontents; }

export interface Icontent_source_visitsWithuser_profiles
extends Icontent_source_visits
{
user_profiles:
Iuser_profiles; }

export type Partialcontent_source_visits = Partial<Icontent_source_visits>;
export type Requiredcontent_source_visits = Required<Icontent_source_visits>;