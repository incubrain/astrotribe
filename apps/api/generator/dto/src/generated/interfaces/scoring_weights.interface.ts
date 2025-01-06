import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iscoring_weights extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  name: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  weight: number;
  /**
   * 
   * @validation @IsString
   */
  description?: string;
  /**
   * 
   * @validation @IsDate
   */
  updated_at?: Date;
}



export type Partialscoring_weights = Partial<Iscoring_weights>;
export type Requiredscoring_weights = Required<Iscoring_weights>;