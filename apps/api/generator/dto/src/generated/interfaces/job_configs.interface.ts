import { BaseEntity } from '@core/base/entity';


/**
 * 
 */
export interface Ijob_configs extends BaseEntity {
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
   * @validation @IsString
   */
  schedule?: string;
  /**
   * 
   */
  priority?: any;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  timeout_ms?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  retry_limit?: number;
  /**
   * 
   * @validation @IsBoolean
   */
  circuit_breaker_enabled?: boolean;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  circuit_breaker_threshold?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  circuit_breaker_timeout_ms?: number;
  /**
   * 
   * @validation @IsBoolean
   */
  enabled?: boolean;
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



export type Partialjob_configs = Partial<Ijob_configs>;
export type Requiredjob_configs = Required<Ijob_configs>;