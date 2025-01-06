import { BaseEntity } from '@core/base/entity';
import { Iad_variants } from './ad_variants.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iad_daily_metrics extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsString
   */
  variant_id?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  date: Date;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  views?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  clicks?: number;
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
  ad_variants?: any;
}

export interface Iad_daily_metricsWithad_variants
extends Iad_daily_metrics
{
ad_variants:
Iad_variants; }

export type Partialad_daily_metrics = Partial<Iad_daily_metrics>;
export type Requiredad_daily_metrics = Required<Iad_daily_metrics>;