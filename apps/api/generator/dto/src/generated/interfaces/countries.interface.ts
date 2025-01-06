import { BaseEntity } from '@core/base/entity';
import { Iaddresses } from './addresses.interface';
import { Icities } from './cities.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icountries extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  name: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  code: string;
  /**
   * 
   * @validation @IsString
   */
  code_3?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  addresses: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  cities: any;
}

export interface IcountriesWithaddresses
extends Icountries
{
addresses:
Iaddresses; }

export interface IcountriesWithcities
extends Icountries
{
cities:
Icities; }

export type Partialcountries = Partial<Icountries>;
export type Requiredcountries = Required<Icountries>;