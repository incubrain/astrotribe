import { BaseEntity } from '@core/base/entity';
import { Iuser_profiles } from './user_profiles.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ifeedbacks extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsString
   */
  user_id?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  page_identifier: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  rating?: number;
  /**
   * 
   */
  feedback_type?: any;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  message: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  created_at: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  updated_at: Date;
  /**
   * 
   * @validation @IsString
   */
  device_info?: string;
  /**
   * 
   * @validation @IsString
   */
  resolution_comment?: string;
  /**
   * 
   */
  feedback_status?: any;
  /**
   * 
   */
  user_profiles?: any;
}

export interface IfeedbacksWithuser_profiles
extends Ifeedbacks
{
user_profiles:
Iuser_profiles; }

export type Partialfeedbacks = Partial<Ifeedbacks>;
export type Requiredfeedbacks = Required<Ifeedbacks>;