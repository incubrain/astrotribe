import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Itable_maintenance_log extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsString
   */
  operation?: string;
  /**
   * 
   * @validation @IsString
   */
  detail?: string;
  /**
   * 
   * @validation @IsDate
   */
  logged_at?: Date;
}



export type Partialtable_maintenance_log = Partial<Itable_maintenance_log>;
export type Requiredtable_maintenance_log = Required<Itable_maintenance_log>;