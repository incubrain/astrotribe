import { BaseEntity } from '@core/base/entity';
import { Icategories } from './categories.interface';
import { Icontents } from './contents.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icontent_categories extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  content_id: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  category_id: bigint;
  /**
   * 
   * @validation @IsNotEmpty, @IsBoolean
   */
  is_primary: boolean;
  /**
   * 
   * @validation @IsNotEmpty
   */
  categories: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  contents: any;
}

export interface Icontent_categoriesWithcategories
extends Icontent_categories
{
categories:
Icategories; }

export interface Icontent_categoriesWithcontents
extends Icontent_categories
{
contents:
Icontents; }

export type Partialcontent_categories = Partial<Icontent_categories>;
export type Requiredcontent_categories = Required<Icontent_categories>;