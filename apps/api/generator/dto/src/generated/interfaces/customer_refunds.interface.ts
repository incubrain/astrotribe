import { BaseEntity } from '@core/base/entity';
import { Icustomer_payments } from './customer_payments.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icustomer_refunds extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  payment_id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  external_refund_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  amount: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  status: string;
  /**
   * 
   * @validation @IsString
   */
  speed_processed?: string;
  /**
   * 
   * @validation @IsString
   */
  speed_requested?: string;
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
  currency?: string;
  /**
   * 
   * @validation @IsString
   */
  receipt?: string;
  /**
   * 
   */
  acquirer_data?: Record<string, any>;
  /**
   * 
   * @validation @IsString
   */
  batch_id?: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  customer_payments: any;
}

export interface Icustomer_refundsWithcustomer_payments
extends Icustomer_refunds
{
customer_payments:
Icustomer_payments; }

export type Partialcustomer_refunds = Partial<Icustomer_refunds>;
export type Requiredcustomer_refunds = Required<Icustomer_refunds>;