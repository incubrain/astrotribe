// templates/entity/model.ejs
import { BaseModel } from '@core'
import { OfferModel } from './offer.model'

// Model interface
export interface PlanModel extends BaseModel {
  id: string
  external_plan_id: string
  name: string
  description: string
  interval: number
  interval_type: string
  monthly_amount: number
  annual_amount: number
  current: string
  features: string[]
  is_active: boolean
  created_at: Date
  updated_at?: Date
  offers: OfferModel[]
}
