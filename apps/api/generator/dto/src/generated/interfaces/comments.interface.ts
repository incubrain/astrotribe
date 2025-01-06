import { BaseEntity } from '@core/base/entity';
import { Icomments } from './comments.interface';
import { Icomments } from './comments.interface';
import { Iuser_profiles } from './user_profiles.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icomments extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  content: string;
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
   * @validation @IsNotEmpty
   */
  content_type: any;
  /**
   * 
   * @validation @IsString
   */
  parent_comment_id?: string;
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
  comments?: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  other_comments: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  user_profiles: any;
}

export interface IcommentsWithcomments
extends Icomments
{
comments:
Icomments; }

export interface IcommentsWithother_comments
extends Icomments
{
other_comments:
Icomments; }

export interface IcommentsWithuser_profiles
extends Icomments
{
user_profiles:
Iuser_profiles; }

export type Partialcomments = Partial<Icomments>;
export type Requiredcomments = Required<Icomments>;