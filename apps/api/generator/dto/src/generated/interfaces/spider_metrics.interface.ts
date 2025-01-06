import { BaseEntity } from '@core/base/entity';
import { Imetric_definitions } from './metric_definitions.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ispider_metrics extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty
   */
  id: bigint;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  crawl_id: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  metric_id?: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  timestamp: Date;
  /**
   * 
   * @validation @IsNotEmpty
   */
  value: Record<string, any>;
  /**
   * 
   */
  metric_definitions?: any;
}

export interface Ispider_metricsWithmetric_definitions
extends Ispider_metrics
{
metric_definitions:
Imetric_definitions; }

export type Partialspider_metrics = Partial<Ispider_metrics>;
export type Requiredspider_metrics = Required<Ispider_metrics>;