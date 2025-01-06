import { BaseEntity } from '@core/base/entity';
import { Iresponses } from './responses.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Isearches extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty
   */
  id: bigint;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  input: string;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  tokens_used?: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  user_ids: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  responses: any;
}

export interface IsearchesWithresponses
extends Isearches
{
responses:
Iresponses; }

export type Partialsearches = Partial<Isearches>;
export type Requiredsearches = Required<Isearches>;