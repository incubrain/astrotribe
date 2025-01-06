import { BaseEntity } from '@core/base/entity';
import { Iads } from './ads.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iad_packages extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  name: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  position: string;
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
   * @validation @IsNotEmpty, @IsString
   */
  description: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  price: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  features: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  expected_ctr?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  avg_roi?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  view_frequency?: number;
  /**
   * 
   * @validation @IsNotEmpty
   */
  ads: any;
}

export interface Iad_packagesWithads
extends Iad_packages
{
ads:
Iads; }

export type Partialad_packages = Partial<Iad_packages>;
export type Requiredad_packages = Required<Iad_packages>;