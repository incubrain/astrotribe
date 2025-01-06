import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iclassified_urls extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  url: string;
  /**
   * 
   */
  predicted_category?: any;
  /**
   * 
   */
  actual_category?: any;
  /**
   * 
   * @validation @IsBoolean
   */
  is_reviewed?: boolean;
  /**
   * 
   * @validation @IsBoolean
   */
  added_to_training?: boolean;
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



export type Partialclassified_urls = Partial<Iclassified_urls>;
export type Requiredclassified_urls = Required<Iclassified_urls>;