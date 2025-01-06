import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Icustomer_processed_webhooks extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  id: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  event_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  event_type: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsDate
   */
  processed_at: Date;
}



export type Partialcustomer_processed_webhooks = Partial<Icustomer_processed_webhooks>;
export type Requiredcustomer_processed_webhooks = Required<Icustomer_processed_webhooks>;