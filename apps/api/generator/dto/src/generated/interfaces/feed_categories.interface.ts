import { BaseEntity } from '@core/base/entity';
import { Icategories } from './categories.interface';
import { Ifeeds } from './feeds.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ifeed_categories extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty
   */
  id: bigint;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  created_at: Date;
  /**
   * 
   * @validation @IsString
   */
  feed_id?: string;
  /**
   * 
   */
  category_id?: bigint;
  /**
   * 
   */
  categories?: any;
  /**
   * 
   */
  feeds?: any;
}

export interface Ifeed_categoriesWithcategories
extends Ifeed_categories
{
categories:
Icategories; }

export interface Ifeed_categoriesWithfeeds
extends Ifeed_categories
{
feeds:
Ifeeds; }

export type Partialfeed_categories = Partial<Ifeed_categories>;
export type Requiredfeed_categories = Required<Ifeed_categories>;