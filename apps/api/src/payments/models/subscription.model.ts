// templates/entity/model.ejs
import { BaseModel } from '@core'
import { SubscriptionStatus } from 'src/types/subscription.types'
import { PlanModel } from './plan.model'
import { ProviderModel } from './provider.model'

// Model interface
export interface SubscriptionModel extends BaseModel {
  id: string
  external_subscription_id: string
  name: string
  status: SubscriptionStatus
  quantity: number

  cancel_at_period_end: boolean
  total_count: number
  paid_count: number
  remaining_count: number
  auth_attempts: number
  type: number
  customer_notify: boolean
  short_url: string
  has_scheduled_changes: boolean
  source: string
  offer_id: string
  pause_initiated_by: string
  cancel_initiated_by: string
  notes?: Record<string, any>
  
  
  created_at: Date
  updated_at?: Date
  start_at: Date
  end_at: Date
  change_scheduled_at: Date
  charge_at: Date
  ended_at: Date
  current_start?: Date
  current_end?: Date
  expire_by: Date

  user_id: string
  plan_id: number
  payment_provider_id: number

  plan: PlanModel
  provider: ProviderModel
}
