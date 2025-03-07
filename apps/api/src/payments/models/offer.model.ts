// templates/entity/model.ejs
import { BaseModel } from '@core'
import { PlanModel } from './plan.model'
import { DiscountPeriod, DiscountType } from '../../types/offer.types'

// Model interface
export interface OfferModel extends BaseModel {
  id: string
  is_active: boolean
  created_at: Date
  updated_at?: Date
  discount: number
  discount_type: DiscountType
  discount_period: DiscountPeriod
  already_discounted: boolean
  expiry_date: Date

  plan_id: string
  plan: PlanModel
}
