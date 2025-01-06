import { BaseEntity } from '@core/base/entity';
import { Iad_daily_metrics } from './ad_daily_metrics.interface';
import { Iads } from './ads.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iad_variants extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  ad_id: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  content: Record<string, any>;
  /**
   * 
   * @validation @IsBoolean
   */
  is_control?: boolean;
  /**
   * 
   * @validation @IsBoolean
   */
  active?: boolean;
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
  performance_metrics?: Record<string, any>;
  /**
   * 
   * @validation @IsNotEmpty
   */
  ad_daily_metrics: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  ads: any;
}

export interface Iad_variantsWithad_daily_metrics
extends Iad_variants
{
ad_daily_metrics:
Iad_daily_metrics; }

export interface Iad_variantsWithads
extends Iad_variants
{
ads:
Iads; }

export type Partialad_variants = Partial<Iad_variants>;
export type Requiredad_variants = Required<Iad_variants>;