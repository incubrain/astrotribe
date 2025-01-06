import { BaseEntity } from '@core/base/entity';


/**
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ischema_migrations extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  version: string;
}



export type Partialschema_migrations = Partial<Ischema_migrations>;
export type Requiredschema_migrations = Required<Ischema_migrations>;