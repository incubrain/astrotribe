import { BaseEntity } from '@core/base/entity';
import { Ifeed_categories } from './feed_categories.interface';
import { Ifeed_sources } from './feed_sources.interface';
import { Iuser_profiles } from './user_profiles.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ifeeds extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  created_at: Date;
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
   * @validation @IsNotEmpty
   */
  feed_categories: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  feed_sources: any;
  /**
   * 
   */
  user_profiles?: any;
}

export interface IfeedsWithfeed_categories
extends Ifeeds
{
feed_categories:
Ifeed_categories; }

export interface IfeedsWithfeed_sources
extends Ifeeds
{
feed_sources:
Ifeed_sources; }

export interface IfeedsWithuser_profiles
extends Ifeeds
{
user_profiles:
Iuser_profiles; }

export type Partialfeeds = Partial<Ifeeds>;
export type Requiredfeeds = Required<Ifeeds>;