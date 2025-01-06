import { BaseEntity } from '@core/base/entity';


/**
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iaudit_log_entries extends BaseEntity {
  /**
   * 
   * @validation @IsString
   */
  instance_id?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   */
  payload?: Record<string, any>;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  ip_address: string;
}



export type Partialaudit_log_entries = Partial<Iaudit_log_entries>;
export type Requiredaudit_log_entries = Required<Iaudit_log_entries>;