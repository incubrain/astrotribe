import { BaseEntity } from '@core/base/entity';
import { Icontents } from './contents.interface';
import { Ibookmark_folders } from './bookmark_folders.interface';
import { Iusers } from './users.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ibookmarks extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  user_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  content_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  content_type: string;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
  /**
   * 
   * @validation @IsString
   */
  folder_id?: string;
  /**
   * 
   */
  metadata?: Record<string, any>;
  /**
   * 
   * @validation @IsDate
   */
  updated_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty
   */
  contents: any;
  /**
   * 
   */
  bookmark_folders?: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  users: any;
}

export interface IbookmarksWithcontents
extends Ibookmarks
{
contents:
Icontents; }

export interface IbookmarksWithbookmark_folders
extends Ibookmarks
{
bookmark_folders:
Ibookmark_folders; }

export interface IbookmarksWithusers
extends Ibookmarks
{
users:
Iusers; }

export type Partialbookmarks = Partial<Ibookmarks>;
export type Requiredbookmarks = Required<Ibookmarks>;