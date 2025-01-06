import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ierror_logs extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  service_name: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  error_type: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  severity: any;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  message: string;
  /**
   * 
   * @validation @IsString
   */
  stack_trace?: string;
  /**
   * 
   */
  metadata?: Record<string, any>;
  /**
   * 
   */
  context?: Record<string, any>;
  /**
   * 
   * @validation @IsString
   */
  user_id?: string;
  /**
   * 
   * @validation @IsString
   */
  request_id?: string;
  /**
   * 
   * @validation @IsString
   */
  correlation_id?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  environment: string;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
  /**
   * 
   * @validation @IsString
   */
  error_hash?: string;
  /**
   * 
   * @validation @IsString
   */
  error_pattern?: string;
  /**
   * 
   * @validation @IsBoolean
   */
  is_new_pattern?: boolean;
  /**
   * 
   * @validation @IsString
   */
  github_repo?: string;
  /**
   * 
   */
  related_errors?: Record<string, any>;
  /**
   * 
   */
  frequency_data?: Record<string, any>;
  /**
   * 
   * @validation @IsString
   */
  domain?: string;
}



export type Partialerror_logs = Partial<Ierror_logs>;
export type Requirederror_logs = Required<Ierror_logs>;