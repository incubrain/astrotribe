import { BaseEntity } from '@core/base/entity';
import { Iaddresses } from './addresses.interface';
import { Iads } from './ads.interface';
import { Iblacklisted_urls } from './blacklisted_urls.interface';
import { Isocial_media } from './social_media.interface';
import { Icategories } from './categories.interface';
import { Icompany_contacts } from './company_contacts.interface';
import { Icompany_extras } from './company_extras.interface';
import { Icompany_urls } from './company_urls.interface';
import { Icontacts } from './contacts.interface';
import { Icontent_sources } from './content_sources.interface';
import { Inews } from './news.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icompanies extends BaseEntity {
  /**
   * 
   * @validation @IsString
   */
  name?: string;
  /**
   * 
   * @validation @IsString
   */
  description?: string;
  /**
   * 
   * @validation @IsString
   */
  logo_url?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  url: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  social_media_id?: number;
  /**
   * 
   */
  scrape_frequency?: any;
  /**
   * 
   */
  category_id?: bigint;
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
   * @validation @IsNumber([object Object])
   */
  founding_year?: number;
  /**
   * 
   * @validation @IsBoolean
   */
  is_government?: boolean;
  /**
   * 
   * @validation @IsString
   */
  category?: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  failed_count?: number;
  /**
   * 
   * @validation @IsBoolean
   */
  is_english?: boolean;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  scrape_rating?: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsDate
   */
  scraped_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty
   */
  content_status: any;
  /**
   * 
   */
  keywords?: Record<string, any>;
  /**
   * 
   * @validation @IsNotEmpty
   */
  addresses: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  ads: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  blacklisted_urls: any;
  /**
   * 
   */
  social_media?: any;
  /**
   * 
   */
  categories?: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  company_contacts: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  company_extras: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  company_urls: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  contacts: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  content_sources: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  news: any;
}

export interface IcompaniesWithaddresses
extends Icompanies
{
addresses:
Iaddresses; }

export interface IcompaniesWithads
extends Icompanies
{
ads:
Iads; }

export interface IcompaniesWithblacklisted_urls
extends Icompanies
{
blacklisted_urls:
Iblacklisted_urls; }

export interface IcompaniesWithsocial_media
extends Icompanies
{
social_media:
Isocial_media; }

export interface IcompaniesWithcategories
extends Icompanies
{
categories:
Icategories; }

export interface IcompaniesWithcompany_contacts
extends Icompanies
{
company_contacts:
Icompany_contacts; }

export interface IcompaniesWithcompany_extras
extends Icompanies
{
company_extras:
Icompany_extras; }

export interface IcompaniesWithcompany_urls
extends Icompanies
{
company_urls:
Icompany_urls; }

export interface IcompaniesWithcontacts
extends Icompanies
{
contacts:
Icontacts; }

export interface IcompaniesWithcontent_sources
extends Icompanies
{
content_sources:
Icontent_sources; }

export interface IcompaniesWithnews
extends Icompanies
{
news:
Inews; }

export type Partialcompanies = Partial<Icompanies>;
export type Requiredcompanies = Required<Icompanies>;