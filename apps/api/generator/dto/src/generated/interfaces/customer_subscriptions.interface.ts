import { BaseEntity } from '@core/base/entity';
import { Icustomer_payments } from './customer_payments.interface';
import { Ipayment_providers } from './payment_providers.interface';
import { Icustomer_subscription_plans } from './customer_subscription_plans.interface';
import { Iuser_profiles } from './user_profiles.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icustomer_subscriptions extends BaseEntity {
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
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  plan_id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  payment_provider_id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  external_subscription_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  status: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  quantity?: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  current_start: Date;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  current_end: Date;
  /**
   * 
   * @validation @IsDate
   */
  ended_at?: Date;
  /**
   * 
   * @validation @IsBoolean
   */
  cancel_at_period_end?: boolean;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  total_count?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  paid_count?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  remaining_count?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  auth_attempts?: number;
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
   * @validation @IsDate
   */
  updated_at?: Date;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  type?: number;
  /**
   * 
   * @validation @IsDate
   */
  charge_at?: Date;
  /**
   * 
   * @validation @IsDate
   */
  start_at?: Date;
  /**
   * 
   * @validation @IsDate
   */
  end_at?: Date;
  /**
   * 
   * @validation @IsBoolean
   */
  customer_notify?: boolean;
  /**
   * 
   * @validation @IsDate
   */
  expire_by?: Date;
  /**
   * 
   * @validation @IsString
   */
  short_url?: string;
  /**
   * 
   * @validation @IsBoolean
   */
  has_scheduled_changes?: boolean;
  /**
   * 
   * @validation @IsDate
   */
  change_scheduled_at?: Date;
  /**
   * 
   * @validation @IsString
   */
  source?: string;
  /**
   * 
   * @validation @IsString
   */
  offer_id?: string;
  /**
   * 
   * @validation @IsString
   */
  pause_initiated_by?: string;
  /**
   * 
   * @validation @IsString
   */
  cancel_initiated_by?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  customer_payments: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  payment_providers: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  customer_subscription_plans: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  user_profiles: any;
}

export interface Icustomer_subscriptionsWithcustomer_payments
extends Icustomer_subscriptions
{
customer_payments:
Icustomer_payments; }

export interface Icustomer_subscriptionsWithpayment_providers
extends Icustomer_subscriptions
{
payment_providers:
Ipayment_providers; }

export interface Icustomer_subscriptionsWithcustomer_subscription_plans
extends Icustomer_subscriptions
{
customer_subscription_plans:
Icustomer_subscription_plans; }

export interface Icustomer_subscriptionsWithuser_profiles
extends Icustomer_subscriptions
{
user_profiles:
Iuser_profiles; }

export type Partialcustomer_subscriptions = Partial<Icustomer_subscriptions>;
export type Requiredcustomer_subscriptions = Required<Icustomer_subscriptions>;