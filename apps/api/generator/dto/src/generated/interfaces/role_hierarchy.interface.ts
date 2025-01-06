import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Irole_hierarchy extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty
   */
  parent_role: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  child_role: any;
}



export type Partialrole_hierarchy = Partial<Irole_hierarchy>;
export type Requiredrole_hierarchy = Required<Irole_hierarchy>;