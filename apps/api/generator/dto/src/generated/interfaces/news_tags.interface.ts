import { BaseEntity } from '@core/base/entity';
import { Itags } from './tags.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Inews_tags extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  tag_id: number;
  /**
   * 
   * @validation @IsString
   */
  news_id?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  tags: any;
}

export interface Inews_tagsWithtags
extends Inews_tags
{
tags:
Itags; }

export type Partialnews_tags = Partial<Inews_tags>;
export type Requirednews_tags = Required<Inews_tags>;