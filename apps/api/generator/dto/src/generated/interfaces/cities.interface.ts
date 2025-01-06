import { BaseEntity } from '@core/base/entity';
import { Iaddresses } from './addresses.interface';
import { Icountries } from './countries.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icities extends BaseEntity {
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
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  country_id: number;
  /**
   * 
   * @validation @IsString
   */
  state?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  addresses: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  countries: any;
}

export interface IcitiesWithaddresses
extends Icities
{
addresses:
Iaddresses; }

export interface IcitiesWithcountries
extends Icities
{
countries:
Icountries; }

export type Partialcities = Partial<Icities>;
export type Requiredcities = Required<Icities>;