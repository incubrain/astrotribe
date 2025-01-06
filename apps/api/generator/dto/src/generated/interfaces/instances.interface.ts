import { BaseEntity } from '@core/base/entity';


/**
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iinstances extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsString
   */
  uuid?: string;
  /**
   * 
   * @validation @IsString
   */
  raw_base_config?: string;
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



export type Partialinstances = Partial<Iinstances>;
export type Requiredinstances = Required<Iinstances>;