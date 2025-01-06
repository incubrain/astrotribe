import { BaseEntity } from '@core/base/entity';
import { Iuser_profiles } from './user_profiles.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iuser_metrics extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  user_id: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  total_votes?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  upvote_count?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  downvote_count?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  vote_accuracy?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  current_streak?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  best_streak?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  today_vote_count?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  total_reading_time?: number;
  /**
   * 
   * @validation @IsDate
   */
  last_vote_date?: Date;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  points?: number;
  /**
   * 
   */
  points_breakdown?: Record<string, any>;
  /**
   * 
   */
  interaction_stats?: Record<string, any>;
  /**
   * 
   */
  achievements?: Record<string, any>;
  /**
   * 
   */
  titles?: Record<string, any>;
  /**
   * 
   */
  multipliers?: Record<string, any>;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  current_level?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  current_xp?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  xp_to_next_level?: number;
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
   * @validation @IsNotEmpty
   */
  user_profiles: any;
}

export interface Iuser_metricsWithuser_profiles
extends Iuser_metrics
{
user_profiles:
Iuser_profiles; }

export type Partialuser_metrics = Partial<Iuser_metrics>;
export type Requireduser_metrics = Required<Iuser_metrics>;