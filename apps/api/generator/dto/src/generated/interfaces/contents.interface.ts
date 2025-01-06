import { BaseEntity } from '@core/base/entity';
import { Ibookmarks } from './bookmarks.interface';
import { Icontent_categories } from './content_categories.interface';
import { Icontent_source_visits } from './content_source_visits.interface';
import { Icontent_statuses } from './content_statuses.interface';
import { Icontent_tags } from './content_tags.interface';
import { Inews } from './news.interface';
import { Inewsletters } from './newsletters.interface';
import { Iresearch } from './research.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icontents extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  content_type: any;
  /**
   * 
   * @validation @IsString
   */
  title?: string;
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
   * @validation @IsNotEmpty, @IsString
   */
  url: string;
  /**
   * 
   * @validation @IsString
   */
  rss_url?: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  hot_score?: number;
  /**
   * 
   * @validation @IsNotEmpty
   */
  bookmarks: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  content_categories: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  content_source_visits: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  content_statuses: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  content_tags: any;
  /**
   * 
   */
  news?: any;
  /**
   * 
   */
  newsletters?: any;
  /**
   * 
   */
  research?: any;
}

export interface IcontentsWithbookmarks
extends Icontents
{
bookmarks:
Ibookmarks; }

export interface IcontentsWithcontent_categories
extends Icontents
{
content_categories:
Icontent_categories; }

export interface IcontentsWithcontent_source_visits
extends Icontents
{
content_source_visits:
Icontent_source_visits; }

export interface IcontentsWithcontent_statuses
extends Icontents
{
content_statuses:
Icontent_statuses; }

export interface IcontentsWithcontent_tags
extends Icontents
{
content_tags:
Icontent_tags; }

export interface IcontentsWithnews
extends Icontents
{
news:
Inews; }

export interface IcontentsWithnewsletters
extends Icontents
{
newsletters:
Inewsletters; }

export interface IcontentsWithresearch
extends Icontents
{
research:
Iresearch; }

export type Partialcontents = Partial<Icontents>;
export type Requiredcontents = Required<Icontents>;