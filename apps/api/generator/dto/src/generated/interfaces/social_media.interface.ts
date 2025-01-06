import { BaseEntity } from '@core/base/entity';
import { Icompanies } from './companies.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Isocial_media extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsString
   */
  facebook_url?: string;
  /**
   * 
   * @validation @IsString
   */
  twitter_url?: string;
  /**
   * 
   * @validation @IsString
   */
  linkedin_url?: string;
  /**
   * 
   * @validation @IsString
   */
  instagram_url?: string;
  /**
   * 
   * @validation @IsString
   */
  youtube_url?: string;
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
  companies: any;
}

export interface Isocial_mediaWithcompanies
extends Isocial_media
{
companies:
Icompanies; }

export type Partialsocial_media = Partial<Isocial_media>;
export type Requiredsocial_media = Required<Isocial_media>;