import { BaseEntity } from '@core/base/entity';
import { Icontents } from './contents.interface';
import { Iresearch_embeddings } from './research_embeddings.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iresearch extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  created_at: Date;
  /**
   * 
   * @validation @IsDate
   */
  updated_at?: Date;
  /**
   * 
   * @validation @IsDate
   */
  published_at?: Date;
  /**
   * 
   * @validation @IsString
   */
  title?: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  version?: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsString
   */
  abstract?: string;
  /**
   * 
   * @validation @IsString
   */
  keywords?: string;
  /**
   * 
   * @validation @IsString
   */
  month?: string;
  /**
   * 
   * @validation @IsString
   */
  year?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  abstract_url: string;
  /**
   * 
   * @validation @IsString
   */
  category?: string;
  /**
   * 
   * @validation @IsString
   */
  doi_url?: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  figure_count?: number;
  /**
   * 
   * @validation @IsBoolean
   */
  has_embedding?: boolean;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  page_count?: number;
  /**
   * 
   * @validation @IsString
   */
  pdf_url?: string;
  /**
   * 
   * @validation @IsString
   */
  published_in?: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  table_count?: number;
  /**
   * 
   * @validation @IsString
   */
  comments?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsBoolean
   */
  is_flagged: boolean;
  /**
   * 
   */
  authors?: Record<string, any>;
  /**
   * 
   * @validation @IsString
   */
  summary?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  content_status: any;
  /**
   * 
   */
  affiliations?: Record<string, any>;
  /**
   * 
   * @validation @IsNotEmpty
   */
  contents: any;
  /**
   * 
   */
  research_embeddings?: any;
}

export interface IresearchWithcontents
extends Iresearch
{
contents:
Icontents; }

export interface IresearchWithresearch_embeddings
extends Iresearch
{
research_embeddings:
Iresearch_embeddings; }

export type Partialresearch = Partial<Iresearch>;
export type Requiredresearch = Required<Iresearch>;