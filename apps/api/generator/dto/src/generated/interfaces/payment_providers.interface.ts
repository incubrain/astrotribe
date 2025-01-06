import { BaseEntity } from '@core/base/entity';
import { Icustomer_payments } from './customer_payments.interface';
import { Icustomer_subscriptions } from './customer_subscriptions.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ipayment_providers extends BaseEntity {
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
   * @validation @IsBoolean
   */
  is_active?: boolean;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
  /**
   * 
   * @validation @IsDate
   */
  updated_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty
   */
  customer_payments: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  customer_subscriptions: any;
}

export interface Ipayment_providersWithcustomer_payments
extends Ipayment_providers
{
customer_payments:
Icustomer_payments; }

export interface Ipayment_providersWithcustomer_subscriptions
extends Ipayment_providers
{
customer_subscriptions:
Icustomer_subscriptions; }

export type Partialpayment_providers = Partial<Ipayment_providers>;
export type Requiredpayment_providers = Required<Ipayment_providers>;