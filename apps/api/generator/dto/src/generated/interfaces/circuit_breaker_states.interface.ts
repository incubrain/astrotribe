import { BaseEntity } from '@core/base/entity';


/**
 * 
 */
export interface Icircuit_breaker_states extends BaseEntity {
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
  state: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  failure_count?: number;
  /**
   * 
   * @validation @IsDate
   */
  last_failure?: Date;
  /**
   * 
   * @validation @IsDate
   */
  last_success?: Date;
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



export type Partialcircuit_breaker_states = Partial<Icircuit_breaker_states>;
export type Requiredcircuit_breaker_states = Required<Icircuit_breaker_states>;