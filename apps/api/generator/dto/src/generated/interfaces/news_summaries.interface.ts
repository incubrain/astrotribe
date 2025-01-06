import { BaseEntity } from '@core/base/entity';
import { Inews } from './news.interface';


/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Inews_summaries extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  news_id: string;
  /**
   * 
   * @validation @IsString
   */
  summary?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  version: number;
  /**
   * 
   * @validation @IsBoolean
   */
  is_current?: boolean;
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
   */
  complexity_level?: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  news: any;
}

export interface Inews_summariesWithnews
extends Inews_summaries
{
news:
Inews; }

export type Partialnews_summaries = Partial<Inews_summaries>;
export type Requirednews_summaries = Required<Inews_summaries>;