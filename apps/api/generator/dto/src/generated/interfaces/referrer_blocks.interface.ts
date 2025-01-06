import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ireferrer_blocks extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  referrer_code: string;
  /**
   * 
   * @validation @IsDate
   */
  blocked_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  blocked_by: string;
  /**
   * 
   * @validation @IsString
   */
  reason?: string;
  /**
   * 
   * @validation @IsBoolean
   */
  is_permanent?: boolean;
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



export type Partialreferrer_blocks = Partial<Ireferrer_blocks>;
export type Requiredreferrer_blocks = Required<Ireferrer_blocks>;