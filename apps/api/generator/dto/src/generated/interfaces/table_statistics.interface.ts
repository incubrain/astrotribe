import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Itable_statistics extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  table_name: string;
  /**
   * 
   */
  row_count?: bigint;
  /**
   * 
   */
  table_size?: bigint;
  /**
   * 
   */
  index_size?: bigint;
  /**
   * 
   */
  live_tuples?: bigint;
  /**
   * 
   */
  dead_tuples?: bigint;
  /**
   * 
   * @validation @IsDate
   */
  last_vacuum?: Date;
  /**
   * 
   * @validation @IsDate
   */
  last_analyze?: Date;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  estimated_bloat_ratio?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  buffer_cache_hit_ratio?: number;
  /**
   * 
   */
  index_usage?: Record<string, any>;
  /**
   * 
   */
  seq_scan_count?: bigint;
  /**
   * 
   */
  index_scan_count?: bigint;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  capture_time: Date;
}



export type Partialtable_statistics = Partial<Itable_statistics>;
export type Requiredtable_statistics = Required<Itable_statistics>;