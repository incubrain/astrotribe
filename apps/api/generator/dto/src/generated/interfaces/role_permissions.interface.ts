import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Irole_permissions extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsNotEmpty
   */
  role: any;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  table_name: string;
  /**
   * 
   */
  conditions?: Record<string, any>;
  /**
   * 
   */
  permissions?: Record<string, any>;
  /**
   * 
   */
  cached_permissions?: Record<string, any>;
  /**
   * 
   * @validation @IsNotEmpty
   */
  inherit_from: any;
  /**
   * 
   * @validation @IsDate
   */
  last_updated?: Date;
}



export type Partialrole_permissions = Partial<Irole_permissions>;
export type Requiredrole_permissions = Required<Irole_permissions>;