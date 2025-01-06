import { BaseEntity } from '@core/base/entity';
import { Icompany_metrics } from './company_metrics.interface';
import { Ispider_metrics } from './spider_metrics.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Imetric_definitions extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  name: string;
  /**
   * 
   * @validation @IsString
   */
  description?: string;
  /**
   * 
   * @validation @IsString
   */
  category?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  type: string;
  /**
   * 
   * @validation @IsString
   */
  unit?: string;
  /**
   * 
   * @validation @IsBoolean
   */
  is_dimensional?: boolean;
  /**
   * 
   * @validation @IsNotEmpty
   */
  company_metrics: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  spider_metrics: any;
}

export interface Imetric_definitionsWithcompany_metrics
extends Imetric_definitions
{
company_metrics:
Icompany_metrics; }

export interface Imetric_definitionsWithspider_metrics
extends Imetric_definitions
{
spider_metrics:
Ispider_metrics; }

export type Partialmetric_definitions = Partial<Imetric_definitions>;
export type Requiredmetric_definitions = Required<Imetric_definitions>;