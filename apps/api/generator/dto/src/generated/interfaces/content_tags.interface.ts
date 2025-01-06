import { BaseEntity } from '@core/base/entity';
import { Icontents } from './contents.interface';
import { Itags } from './tags.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icontent_tags extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  content_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  tag_id: number;
  /**
   * 
   * @validation @IsNotEmpty
   */
  contents: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  tags: any;
}

export interface Icontent_tagsWithcontents
extends Icontent_tags
{
contents:
Icontents; }

export interface Icontent_tagsWithtags
extends Icontent_tags
{
tags:
Itags; }

export type Partialcontent_tags = Partial<Icontent_tags>;
export type Requiredcontent_tags = Required<Icontent_tags>;