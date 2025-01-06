import { BaseEntity } from '@core/base/entity';
import { Icompanies } from './companies.interface';
import { Icontent_categories } from './content_categories.interface';
import { Ifeed_categories } from './feed_categories.interface';
import { Inews } from './news.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icategories extends BaseEntity {
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
   * @validation @IsDate
   */
  updated_at?: Date;
  /**
   * 
   * @validation @IsString
   */
  body?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  name: string;
  /**
   * 
   * @validation @IsString
   */
  document_id?: string;
  /**
   * 
   * @validation @IsString
   */
  locale?: string;
  /**
   * 
   * @validation @IsString
   */
  published_at?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  companies: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  content_categories: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  feed_categories: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  news: any;
}

export interface IcategoriesWithcompanies
extends Icategories
{
companies:
Icompanies; }

export interface IcategoriesWithcontent_categories
extends Icategories
{
content_categories:
Icontent_categories; }

export interface IcategoriesWithfeed_categories
extends Icategories
{
feed_categories:
Ifeed_categories; }

export interface IcategoriesWithnews
extends Icategories
{
news:
Inews; }

export type Partialcategories = Partial<Icategories>;
export type Requiredcategories = Required<Icategories>;