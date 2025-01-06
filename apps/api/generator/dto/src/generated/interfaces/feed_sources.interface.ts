import { BaseEntity } from '@core/base/entity';
import { Ifeeds } from './feeds.interface';
import { Icontent_sources } from './content_sources.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ifeed_sources extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty
   */
  id: bigint;
  /**
   * 
   * @validation @IsString
   */
  feed_id?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  created_at: Date;
  /**
   * 
   */
  content_source_id?: bigint;
  /**
   * 
   */
  feeds?: any;
  /**
   * 
   */
  content_sources?: any;
}

export interface Ifeed_sourcesWithfeeds
extends Ifeed_sources
{
feeds:
Ifeeds; }

export interface Ifeed_sourcesWithcontent_sources
extends Ifeed_sources
{
content_sources:
Icontent_sources; }

export type Partialfeed_sources = Partial<Ifeed_sources>;
export type Requiredfeed_sources = Required<Ifeed_sources>;