import { BaseEntity } from '@core/base/entity';
import { Icustomer_subscriptions } from './customer_subscriptions.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icustomer_subscription_plans extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsString
   */
  external_plan_id?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  name: string;
  /**
   * 
   * @validation @IsString
   */
  description?: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  interval: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  interval_type: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  monthly_amount: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  annual_amount: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  currency: string;
  /**
   * 
   */
  features?: Record<string, any>;
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
  customer_subscriptions: any;
}

export interface Icustomer_subscription_plansWithcustomer_subscriptions
extends Icustomer_subscription_plans
{
customer_subscriptions:
Icustomer_subscriptions; }

export type Partialcustomer_subscription_plans = Partial<Icustomer_subscription_plans>;
export type Requiredcustomer_subscription_plans = Required<Icustomer_subscription_plans>;