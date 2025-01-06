import { BaseEntity } from '@core/base/entity';
import { Icontent_tags } from './content_tags.interface';
import { Inews_tags } from './news_tags.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Itags extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
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
   * @validation @IsNotEmpty
   */
  content_tags: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  news_tags: any;
}

export interface ItagsWithcontent_tags
extends Itags
{
content_tags:
Icontent_tags; }

export interface ItagsWithnews_tags
extends Itags
{
news_tags:
Inews_tags; }

export type Partialtags = Partial<Itags>;
export type Requiredtags = Required<Itags>;