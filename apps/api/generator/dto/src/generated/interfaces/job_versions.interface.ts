import { BaseEntity } from '@core/base/entity';


/**
 * 
 */
export interface Ijob_versions extends BaseEntity {
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
  version: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  changes: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  config: Record<string, any>;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  created_at: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  updated_at: Date;
}



export type Partialjob_versions = Partial<Ijob_versions>;
export type Requiredjob_versions = Required<Ijob_versions>;