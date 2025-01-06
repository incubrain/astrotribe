import { BaseEntity } from '@core/base/entity';
import { Iidentities } from './identities.interface';
import { Imfa_factors } from './mfa_factors.interface';
import { Ione_time_tokens } from './one_time_tokens.interface';
import { Isessions } from './sessions.interface';
import { Ibookmark_folders } from './bookmark_folders.interface';
import { Ibookmarks } from './bookmarks.interface';
import { Iuser_profiles } from './user_profiles.interface';
import { Ivotes } from './votes.interface';


/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
This model contains an expression index which requires additional setup for migrations. Visit https://pris.ly/d/expression-indexes for more info.
 */
export interface Iusers extends BaseEntity {
  /**
   * 
   * @validation @IsString
   */
  instance_id?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsString
   */
  aud?: string;
  /**
   * 
   * @validation @IsString
   */
  role?: string;
  /**
   * 
   * @validation @IsString
   */
  email?: string;
  /**
   * 
   * @validation @IsString
   */
  encrypted_password?: string;
  /**
   * 
   * @validation @IsDate
   */
  email_confirmed_at?: Date;
  /**
   * 
   * @validation @IsDate
   */
  invited_at?: Date;
  /**
   * 
   * @validation @IsString
   */
  confirmation_token?: string;
  /**
   * 
   * @validation @IsDate
   */
  confirmation_sent_at?: Date;
  /**
   * 
   * @validation @IsString
   */
  recovery_token?: string;
  /**
   * 
   * @validation @IsDate
   */
  recovery_sent_at?: Date;
  /**
   * 
   * @validation @IsString
   */
  email_change_token_new?: string;
  /**
   * 
   * @validation @IsString
   */
  email_change?: string;
  /**
   * 
   * @validation @IsDate
   */
  email_change_sent_at?: Date;
  /**
   * 
   * @validation @IsDate
   */
  last_sign_in_at?: Date;
  /**
   * 
   */
  raw_app_meta_data?: Record<string, any>;
  /**
   * 
   */
  raw_user_meta_data?: Record<string, any>;
  /**
   * 
   * @validation @IsBoolean
   */
  is_super_admin?: boolean;
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
   * @validation @IsString
   */
  phone?: string;
  /**
   * 
   * @validation @IsDate
   */
  phone_confirmed_at?: Date;
  /**
   * 
   * @validation @IsString
   */
  phone_change?: string;
  /**
   * 
   * @validation @IsString
   */
  phone_change_token?: string;
  /**
   * 
   * @validation @IsDate
   */
  phone_change_sent_at?: Date;
  /**
   * 
   * @validation @IsDate
   */
  confirmed_at?: Date;
  /**
   * 
   * @validation @IsString
   */
  email_change_token_current?: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  email_change_confirm_status?: number;
  /**
   * 
   * @validation @IsDate
   */
  banned_until?: Date;
  /**
   * 
   * @validation @IsString
   */
  reauthentication_token?: string;
  /**
   * 
   * @validation @IsDate
   */
  reauthentication_sent_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsBoolean
   */
  is_sso_user: boolean;
  /**
   * 
   * @validation @IsDate
   */
  deleted_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsBoolean
   */
  is_anonymous: boolean;
  /**
   * 
   * @validation @IsNotEmpty
   */
  identities: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  mfa_factors: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  one_time_tokens: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  sessions: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  bookmark_folders: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  bookmarks: any;
  /**
   * 
   */
  user_profiles?: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  votes: any;
}

export interface IusersWithidentities
extends Iusers
{
identities:
Iidentities; }

export interface IusersWithmfa_factors
extends Iusers
{
mfa_factors:
Imfa_factors; }

export interface IusersWithone_time_tokens
extends Iusers
{
one_time_tokens:
Ione_time_tokens; }

export interface IusersWithsessions
extends Iusers
{
sessions:
Isessions; }

export interface IusersWithbookmark_folders
extends Iusers
{
bookmark_folders:
Ibookmark_folders; }

export interface IusersWithbookmarks
extends Iusers
{
bookmarks:
Ibookmarks; }

export interface IusersWithuser_profiles
extends Iusers
{
user_profiles:
Iuser_profiles; }

export interface IusersWithvotes
extends Iusers
{
votes:
Ivotes; }

export type Partialusers = Partial<Iusers>;
export type Requiredusers = Required<Iusers>;