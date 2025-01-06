import { BaseEntity } from '@core/base/entity';
import { Icontents } from './contents.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Inewsletters extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  title: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  frequency: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  start_date: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  end_date: Date;
  /**
   * 
   * @validation @IsString
   */
  generated_content?: string;
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
  content_status: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  contents: any;
}

export interface InewslettersWithcontents
extends Inewsletters
{
contents:
Icontents; }

export type Partialnewsletters = Partial<Inewsletters>;
export type Requirednewsletters = Required<Inewsletters>;