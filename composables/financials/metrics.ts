import { ROUND0 } from './totals'
import { subscription } from './income'

function calculateRecurringRevenue(revenue: number) {
  const MRR = revenue
  const ARR = MRR * 12
  return { MRR: ROUND0(MRR), ARR: ROUND0(ARR) }
}

function calculateARPU(MRR: number, totalUsers: number) {
  return totalUsers > 0 ? ROUND0(MRR / totalUsers) : 0
}

function calculateLTV(ARPU: number, customerLifespan: number) {
  return ROUND0(ARPU * customerLifespan)
}

function calculateCAC(totalMarketingCosts: number, newCustomers: number) {
  return newCustomers > 0 ? ROUND0(totalMarketingCosts / newCustomers) : 0
}

function calculateRetentionRate(churnRate: number) {
  return 100 - churnRate * 100
}

function calculateTotalConversionRate(customers: number, MAU: number) {
  return MAU > 0 ? parseInt(((customers / MAU) * 100).toFixed(0)) : 0
}

function calculateGrossMargin(revenue: number, COGS: number) {
  return revenue > 0 ? parseInt((((revenue - COGS) / revenue) * 100).toFixed(0)) : 0
}

function calculateMarketingSpendEfficiency(totalMarketingCosts: number, revenue: number) {
  return revenue > 0 ? parseInt(((revenue / totalMarketingCosts) * 100).toFixed(0)) : 0
}

interface AllMetricsParams {
  MAU: number
  marketingCost: number
  leads: number
  customerLifespan: number
  currentBalance: number
  expenses: number
  effectiveRevenue: number
  customers: {
    all: number
    new: number
    existing: number
    churned: number
  }
}

export interface AllMetrics {
  MRR: number
  ARR: number
  ARPU: number
  LTV: number
  CAC: number
  retentionRate: number
  totalConversionRate: number
  grossMargin: number
  marketingSpendEfficiency: number
  profitLossMargin: number
}

export function calculateAllMetrics(params: AllMetricsParams): AllMetrics {
  const { MAU, marketingCost, leads, customerLifespan, expenses, effectiveRevenue, customers } =
    params

  const { MRR, ARR } = calculateRecurringRevenue(effectiveRevenue)

  const ARPU = calculateARPU(MRR, customers.all)
  const LTV = calculateLTV(ARPU, customerLifespan)
  const CAC = calculateCAC(marketingCost, customers.new)
  const retentionRate = calculateRetentionRate(subscription.pro.churn.yearly)

  const totalConversionRate = calculateTotalConversionRate(customers.all, MAU)

  const grossMargin = calculateGrossMargin(effectiveRevenue, expenses)

  const marketingSpendEfficiency = calculateMarketingSpendEfficiency(
    marketingCost,
    effectiveRevenue
  )

  return {
    MRR,
    ARR,
    ARPU,
    LTV,
    CAC,
    retentionRate,
    totalConversionRate,
    grossMargin,
    marketingSpendEfficiency,
    profitLossMargin: parseFloat((((effectiveRevenue - expenses) / expenses) * 100).toFixed(1))
  }
}
