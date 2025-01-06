import { BaseEntity } from '@core/base/entity';


/**
 * 
 */
export interface Ijob_metrics extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  job_name: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  job_id: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  status: any;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  started_at: Date;
  /**
   * 
   * @validation @IsDate
   */
  completed_at?: Date;
  /**
   * 
   * @validation @IsDate
   */
  failed_at?: Date;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  duration_ms?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  items_processed?: number;
  /**
   * 
   * @validation @IsString
   */
  error_message?: string;
  /**
   * 
   * @validation @IsString
   */
  error_stack?: string;
  /**
   * 
   */
  metadata?: Record<string, any>;
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
}



export type Partialjob_metrics = Partial<Ijob_metrics>;
export type Requiredjob_metrics = Required<Ijob_metrics>;