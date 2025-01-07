// templates/entity/model.ejs
import { BaseModel } from '@core'

// Model interface
export interface ProviderModel extends BaseModel {
  id: string
  name: string
  is_active: boolean
  created_at: Date
  updated_at?: Date
}
