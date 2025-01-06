import { BaseEntity } from '@core/base/entity';


/**
 * 
 */
export interface Ijob_queue_stats extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  queue_name: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  created_count?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  retry_count?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  active_count?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  completed_count?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  cancelled_count?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  failed_count?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  total_count?: number;
  /**
   * 
   * @validation @IsDate
   */
  updated_at?: Date;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
}



export type Partialjob_queue_stats = Partial<Ijob_queue_stats>;
export type Requiredjob_queue_stats = Required<Ijob_queue_stats>;