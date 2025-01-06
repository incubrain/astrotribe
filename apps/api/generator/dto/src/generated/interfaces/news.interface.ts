import { BaseEntity } from '@core/base/entity';
import { Icontent_sources } from './content_sources.interface';
import { Icategories } from './categories.interface';
import { Icompanies } from './companies.interface';
import { Icontents } from './contents.interface';
import { Inews_summaries } from './news_summaries.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Inews extends BaseEntity {
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
  title?: string;
  /**
   * 
   * @validation @IsString
   */
  body?: string;
  /**
   * 
   */
  category_id?: bigint;
  /**
   * 
   * @validation @IsString
   */
  author?: string;
  /**
   * 
   * @validation @IsString
   */
  description?: string;
  /**
   * 
   * @validation @IsString
   */
  featured_image?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsBoolean
   */
  has_summary: boolean;
  /**
   * 
   * @validation @IsDate
   */
  published_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  url: string;
  /**
   * 
   */
  hash?: bigint;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsString
   */
  company_id?: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  failed_count?: number;
  /**
   * 
   * @validation @IsNotEmpty
   */
  scrape_frequency: any;
  /**
   * 
   * @validation @IsDate
   */
  scraped_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty
   */
  content_status: any;
  /**
   * 
   */
  keywords?: Record<string, any>;
  /**
   * 
   */
  content_source_id?: bigint;
  /**
   * 
   */
  content_sources?: any;
  /**
   * 
   */
  categories?: any;
  /**
   * 
   */
  companies?: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  contents: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  news_summaries: any;
}

export interface InewsWithcontent_sources
extends Inews
{
content_sources:
Icontent_sources; }

export interface InewsWithcategories
extends Inews
{
categories:
Icategories; }

export interface InewsWithcompanies
extends Inews
{
companies:
Icompanies; }

export interface InewsWithcontents
extends Inews
{
contents:
Icontents; }

export interface InewsWithnews_summaries
extends Inews
{
news_summaries:
Inews_summaries; }

export type Partialnews = Partial<Inews>;
export type Requirednews = Required<Inews>;