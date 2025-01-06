import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Istrapi_migrations_internal extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsString
   */
  name?: string;
  /**
   * 
   * @validation @IsDate
   */
  time?: Date;
}



export type Partialstrapi_migrations_internal = Partial<Istrapi_migrations_internal>;
export type Requiredstrapi_migrations_internal = Required<Istrapi_migrations_internal>;