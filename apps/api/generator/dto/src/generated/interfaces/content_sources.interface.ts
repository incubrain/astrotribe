import { BaseEntity } from '@core/base/entity';
import { Icompanies } from './companies.interface';
import { Ifeed_sources } from './feed_sources.interface';
import { Inews } from './news.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icontent_sources extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty
   */
  id: bigint;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  url: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  content_type: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  scrape_frequency: any;
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
   * @validation @IsDate
   */
  refreshed_at?: Date;
  /**
   * 
   * @validation @IsBoolean
   */
  has_failed?: boolean;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  failed_count?: number;
  /**
   * 
   * @validation @IsNotEmpty
   */
  priority: any;
  /**
   * 
   */
  hash?: bigint;
  /**
   * 
   * @validation @IsDate
   */
  scraped_at?: Date;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  expected_count?: number;
  /**
   * 
   * @validation @IsString
   */
  company_id?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  rss_urls: string;
  /**
   * 
   */
  companies?: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  feed_sources: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  news: any;
}

export interface Icontent_sourcesWithcompanies
extends Icontent_sources
{
companies:
Icompanies; }

export interface Icontent_sourcesWithfeed_sources
extends Icontent_sources
{
feed_sources:
Ifeed_sources; }

export interface Icontent_sourcesWithnews
extends Icontent_sources
{
news:
Inews; }

export type Partialcontent_sources = Partial<Icontent_sources>;
export type Requiredcontent_sources = Required<Icontent_sources>;