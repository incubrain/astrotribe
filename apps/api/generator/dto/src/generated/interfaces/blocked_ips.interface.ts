import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iblocked_ips extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  ip_address: string;
  /**
   * 
   * @validation @IsDate
   */
  blocked_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  blocked_until: Date;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  failed_attempts?: number;
  /**
   * 
   * @validation @IsString
   */
  reason?: string;
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



export type Partialblocked_ips = Partial<Iblocked_ips>;
export type Requiredblocked_ips = Required<Iblocked_ips>;