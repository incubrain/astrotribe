import { BaseEntity } from '@core/base/entity';
import { Ibookmark_folders } from './bookmark_folders.interface';
import { Ibookmark_folders } from './bookmark_folders.interface';
import { Iusers } from './users.interface';
import { Ibookmarks } from './bookmarks.interface';


/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ibookmark_folders extends BaseEntity {
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
  name: string;
  /**
   * 
   * @validation @IsString
   */
  color?: string;
  /**
   * 
   * @validation @IsString
   */
  parent_id?: string;
  /**
   * 
   * @validation @IsBoolean
   */
  is_default?: boolean;
  /**
   * 
   * @validation @IsBoolean
   */
  is_favorite?: boolean;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  position?: number;
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
  bookmark_folders?: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  other_bookmark_folders: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  users: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  bookmarks: any;
}

export interface Ibookmark_foldersWithbookmark_folders
extends Ibookmark_folders
{
bookmark_folders:
Ibookmark_folders; }

export interface Ibookmark_foldersWithother_bookmark_folders
extends Ibookmark_folders
{
other_bookmark_folders:
Ibookmark_folders; }

export interface Ibookmark_foldersWithusers
extends Ibookmark_folders
{
users:
Iusers; }

export interface Ibookmark_foldersWithbookmarks
extends Ibookmark_folders
{
bookmarks:
Ibookmarks; }

export type Partialbookmark_folders = Partial<Ibookmark_folders>;
export type Requiredbookmark_folders = Required<Ibookmark_folders>;