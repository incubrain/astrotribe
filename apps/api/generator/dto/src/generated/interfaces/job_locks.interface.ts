import { BaseEntity } from '@core/base/entity';


/**
 * 
 */
export interface Ijob_locks extends BaseEntity {
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
  lock_key: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  lock_value: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  acquired_at: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  expires_at: Date;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
}



export type Partialjob_locks = Partial<Ijob_locks>;
export type Requiredjob_locks = Required<Ijob_locks>;