// types/plan.types.ejs
export enum PlanType {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

export interface PlanFeature {
  name: string
  limit?: number
  enabled: boolean
}

export interface Plan {
  id: string
  name: string
  type: PlanType
  features: PlanFeature[]
  price: number
}
