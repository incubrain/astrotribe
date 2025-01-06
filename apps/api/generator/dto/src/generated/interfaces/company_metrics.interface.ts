import { BaseEntity } from '@core/base/entity';
import { Imetric_definitions } from './metric_definitions.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icompany_metrics extends BaseEntity {
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
   * @validation @IsNotEmpty, @IsString
   */
  company_id: string;
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

export interface Icompany_metricsWithmetric_definitions
extends Icompany_metrics
{
metric_definitions:
Imetric_definitions; }

export type Partialcompany_metrics = Partial<Icompany_metrics>;
export type Requiredcompany_metrics = Required<Icompany_metrics>;