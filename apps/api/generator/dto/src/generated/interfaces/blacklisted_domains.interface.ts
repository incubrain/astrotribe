import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iblacklisted_domains extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  created_at: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  url: string;
  /**
   * 
   * @validation @IsString
   */
  reason?: string;
}



export type Partialblacklisted_domains = Partial<Iblacklisted_domains>;
export type Requiredblacklisted_domains = Required<Iblacklisted_domains>;