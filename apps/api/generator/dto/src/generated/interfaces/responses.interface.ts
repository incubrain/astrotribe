import { BaseEntity } from '@core/base/entity';
import { Isearches } from './searches.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iresponses extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty
   */
  id: bigint;
  /**
   * 
   * @validation @IsNotEmpty
   */
  search_id: bigint;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  output: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  upvotes?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  downvotes?: number;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty
   */
  searches: any;
}

export interface IresponsesWithsearches
extends Iresponses
{
searches:
Isearches; }

export type Partialresponses = Partial<Iresponses>;
export type Requiredresponses = Required<Iresponses>;