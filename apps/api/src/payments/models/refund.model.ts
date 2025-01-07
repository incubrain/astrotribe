// templates/entity/model.ejs
import { BaseModel } from '@core'

// Model interface
export interface RefundModel extends BaseModel {
  acquirer_data: Record<string, any>
  amount: number
  batch_id: string
  created_at: Date
  currency: string
  external_refund_id: string
  id: number
  notes: Record<string, any>
  payment_id: number
  receipt: string
  speed_processed: string
  speed_requested: string
  status: string
}