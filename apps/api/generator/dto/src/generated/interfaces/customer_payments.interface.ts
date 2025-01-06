import { BaseEntity } from '@core/base/entity';
import { Ipayment_providers } from './payment_providers.interface';
import { Icustomer_subscriptions } from './customer_subscriptions.interface';
import { Iuser_profiles } from './user_profiles.interface';
import { Icustomer_refunds } from './customer_refunds.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icustomer_payments extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  user_id: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  subscription_id?: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  payment_provider_id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  external_payment_id: string;
  /**
   * 
   * @validation @IsString
   */
  external_order_id?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  amount: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  currency: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  status: string;
  /**
   * 
   * @validation @IsString
   */
  method?: string;
  /**
   * 
   * @validation @IsString
   */
  description?: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  fee?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  tax?: number;
  /**
   * 
   * @validation @IsString
   */
  error_code?: string;
  /**
   * 
   * @validation @IsString
   */
  error_description?: string;
  /**
   * 
   */
  acquirer_data?: Record<string, any>;
  /**
   * 
   */
  notes?: Record<string, any>;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
  /**
   * 
   * @validation @IsString
   */
  order_id?: string;
  /**
   * 
   * @validation @IsString
   */
  invoice_id?: string;
  /**
   * 
   * @validation @IsBoolean
   */
  international?: boolean;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  amount_refunded?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  amount_transferred?: number;
  /**
   * 
   * @validation @IsString
   */
  refund_status?: string;
  /**
   * 
   * @validation @IsBoolean
   */
  captured?: boolean;
  /**
   * 
   * @validation @IsString
   */
  bank?: string;
  /**
   * 
   * @validation @IsString
   */
  wallet?: string;
  /**
   * 
   * @validation @IsString
   */
  vpa?: string;
  /**
   * 
   * @validation @IsString
   */
  error_source?: string;
  /**
   * 
   * @validation @IsString
   */
  error_step?: string;
  /**
   * 
   * @validation @IsString
   */
  error_reason?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  payment_providers: any;
  /**
   * 
   */
  customer_subscriptions?: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  user_profiles: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  customer_refunds: any;
}

export interface Icustomer_paymentsWithpayment_providers
extends Icustomer_payments
{
payment_providers:
Ipayment_providers; }

export interface Icustomer_paymentsWithcustomer_subscriptions
extends Icustomer_payments
{
customer_subscriptions:
Icustomer_subscriptions; }

export interface Icustomer_paymentsWithuser_profiles
extends Icustomer_payments
{
user_profiles:
Iuser_profiles; }

export interface Icustomer_paymentsWithcustomer_refunds
extends Icustomer_payments
{
customer_refunds:
Icustomer_refunds; }

export type Partialcustomer_payments = Partial<Icustomer_payments>;
export type Requiredcustomer_payments = Required<Icustomer_payments>;