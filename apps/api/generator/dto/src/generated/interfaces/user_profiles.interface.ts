import { BaseEntity } from '@core/base/entity';
import { Iaddresses } from './addresses.interface';
import { Icomments } from './comments.interface';
import { Icompany_employees } from './company_employees.interface';
import { Icontacts } from './contacts.interface';
import { Icontent_source_visits } from './content_source_visits.interface';
import { Icustomer_payments } from './customer_payments.interface';
import { Icustomer_subscriptions } from './customer_subscriptions.interface';
import { Ifeedbacks } from './feedbacks.interface';
import { Ifeeds } from './feeds.interface';
import { Ifollows } from './follows.interface';
import { Iuser_metrics } from './user_metrics.interface';
import { Iusers } from './users.interface';


/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export interface Iuser_profiles extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  email: string;
  /**
   * 
   * @validation @IsString
   */
  given_name?: string;
  /**
   * 
   * @validation @IsString
   */
  surname?: string;
  /**
   * 
   * @validation @IsString
   */
  username?: string;
  /**
   * 
   * @validation @IsDate
   */
  dob?: Date;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  gender_id?: number;
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
   * @validation @IsDate
   */
  last_seen?: Date;
  /**
   * 
   * @validation @IsString
   */
  avatar?: string;
  /**
   * 
   * @validation @IsString
   */
  introduction?: string;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  followed_count?: number;
  /**
   * 
   * @validation @IsNumber([object Object])
   */
  followers_count?: number;
  /**
   * 
   */
  plan?: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  role: any;
  /**
   * 
   * @validation @IsBoolean
   */
  is_active?: boolean;
  /**
   * 
   * @validation @IsNotEmpty
   */
  addresses: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  comments: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  company_employees: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  contacts: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  content_source_visits: any;
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
  /**
   * 
   * @validation @IsNotEmpty
   */
  feedbacks: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  feeds: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  follows: any;
  /**
   * 
   */
  user_metrics?: any;
  /**
   * 
   * @validation @IsNotEmpty
   */
  users: any;
}

export interface Iuser_profilesWithaddresses
extends Iuser_profiles
{
addresses:
Iaddresses; }

export interface Iuser_profilesWithcomments
extends Iuser_profiles
{
comments:
Icomments; }

export interface Iuser_profilesWithcompany_employees
extends Iuser_profiles
{
company_employees:
Icompany_employees; }

export interface Iuser_profilesWithcontacts
extends Iuser_profiles
{
contacts:
Icontacts; }

export interface Iuser_profilesWithcontent_source_visits
extends Iuser_profiles
{
content_source_visits:
Icontent_source_visits; }

export interface Iuser_profilesWithcustomer_payments
extends Iuser_profiles
{
customer_payments:
Icustomer_payments; }

export interface Iuser_profilesWithcustomer_subscriptions
extends Iuser_profiles
{
customer_subscriptions:
Icustomer_subscriptions; }

export interface Iuser_profilesWithfeedbacks
extends Iuser_profiles
{
feedbacks:
Ifeedbacks; }

export interface Iuser_profilesWithfeeds
extends Iuser_profiles
{
feeds:
Ifeeds; }

export interface Iuser_profilesWithfollows
extends Iuser_profiles
{
follows:
Ifollows; }

export interface Iuser_profilesWithuser_metrics
extends Iuser_profiles
{
user_metrics:
Iuser_metrics; }

export interface Iuser_profilesWithusers
extends Iuser_profiles
{
users:
Iusers; }

export type Partialuser_profiles = Partial<Iuser_profiles>;
export type Requireduser_profiles = Required<Iuser_profiles>;