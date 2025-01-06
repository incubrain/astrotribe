import { BaseEntity } from '@core/base/entity';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Ireferrals extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  referrer_code: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  visitor_id: string;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
  /**
   * 
   * @validation @IsDate
   */
  converted_at?: Date;
  /**
   * 
   */
  status?: any;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  conversion_value?: number;
  /**
   * 
   * @validation @IsString
   */
  user_agent?: string;
  /**
   * 
   * @validation @IsString
   */
  ip_address?: string;
  /**
   * 
   * @validation @IsString
   */
  landing_page?: string;
  /**
   * 
   * @validation @IsString
   */
  utm_source?: string;
  /**
   * 
   * @validation @IsString
   */
  utm_medium?: string;
  /**
   * 
   * @validation @IsString
   */
  utm_campaign?: string;
  /**
   * 
   * @validation @IsString
   */
  device_type?: string;
  /**
   * 
   * @validation @IsString
   */
  browser?: string;
  /**
   * 
   * @validation @IsString
   */
  country_code?: string;
  /**
   * 
   * @validation @IsString
   */
  region?: string;
  /**
   * 
   * @validation @IsBoolean
   */
  is_suspicious?: boolean;
  /**
   * 
   */
  security_flags?: Record<string, any>;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  validation_attempts?: number;
  /**
   * 
   * @validation @IsDate
   */
  last_failed_attempt?: Date;
  /**
   * 
   * @validation @IsString
   */
  client_fingerprint?: string;
}



export type Partialreferrals = Partial<Ireferrals>;
export type Requiredreferrals = Required<Ireferrals>;