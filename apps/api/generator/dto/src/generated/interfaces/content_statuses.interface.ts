import { BaseEntity } from '@core/base/entity';
import { Icontents } from './contents.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icontent_statuses extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  content_id: string;
  /**
   * 
   * @validation @IsString
   */
  notes?: string;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty
   */
  content_status: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  contents: any;
}

export interface Icontent_statusesWithcontents
extends Icontent_statuses
{
contents:
Icontents; }

export type Partialcontent_statuses = Partial<Icontent_statuses>;
export type Requiredcontent_statuses = Required<Icontent_statuses>;