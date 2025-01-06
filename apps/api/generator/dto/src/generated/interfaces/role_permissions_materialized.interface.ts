import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Irole_permissions_materialized extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty
   */
  role: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  permissions: Record<string, any>;
  /**
   * 
   * @validation @IsDate
   */
  last_updated?: Date;
}



export type Partialrole_permissions_materialized = Partial<Irole_permissions_materialized>;
export type Requiredrole_permissions_materialized = Required<Irole_permissions_materialized>;