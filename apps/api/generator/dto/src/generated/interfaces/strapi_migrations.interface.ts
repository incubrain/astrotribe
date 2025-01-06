import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Istrapi_migrations extends BaseEntity {
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



export type Partialstrapi_migrations = Partial<Istrapi_migrations>;
export type Requiredstrapi_migrations = Required<Istrapi_migrations>;