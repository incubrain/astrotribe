import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iplan_permissions extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsNotEmpty
   */
  plan: any;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  feature: string;
}



export type Partialplan_permissions = Partial<Iplan_permissions>;
export type Requiredplan_permissions = Required<Iplan_permissions>;