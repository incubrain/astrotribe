import { ROUND0, USD2INR, CHURN_TO_LIFESPAN_MONTHS, EFFICIENCY_FACTOR } from './helpers'
import { INCOME_STREAMS } from './income'
import { metricConfig } from './totals'

function calculateRecurringRevenue(revenue: number) {
  const monthlyRecurringRevenue = revenue
  const annualRecurringRevenue = monthlyRecurringRevenue * 12
  return {
    monthlyRecurringRevenue: ROUND0(monthlyRecurringRevenue),
    annualRecurringRevenue: ROUND0(annualRecurringRevenue)
  }
}

function calculateAverageRevenuePerUser(monthlyRecurringRevenue: number, totalUsers: number) {
  return totalUsers > 0 ? ROUND0(monthlyRecurringRevenue / totalUsers) : 0
}

function calculateCustomerLifetimeValue(averageRevenuePerUser: number, customerLifespan: number) {
  return ROUND0(averageRevenuePerUser * customerLifespan)
}

function calculateCustomerAcquisitionCost(totalMarketingCosts: number, newCustomers: number) {
  return newCustomers > 0 ? ROUND0(totalMarketingCosts / newCustomers) : 0
}

function calculateRetentionRate(churnRate: number) {
  return 100 - churnRate * 100
}

function calculateTotalConversionRate(customers: number, monthlyActiveUsers: number) {
  return monthlyActiveUsers > 0 ? parseInt(((customers / monthlyActiveUsers) * 100).toFixed(0)) : 0
}

function calculateGrossMargin(revenue: number, costOfGoodsSold: number) {
  return revenue > 0 ? parseInt((((revenue - costOfGoodsSold) / revenue) * 100).toFixed(0)) : 0
}

function calculateMarketingSpendEfficiency(totalMarketingCosts: number, revenue: number) {
  return revenue > 0 ? parseInt(((revenue / totalMarketingCosts) * 100).toFixed(0)) : 0
}


interface AllMetricsParams {
  MAU: number
  currentMonth: number
  marketingCost: number
  leads: number
  currentBalance: number
  expenses: number
  effectiveRevenue: number
  customers: {
    all: number
    new: number
    churned: number
  }
}

export interface AllMetrics {
  monthlyRecurringRevenue: number
  annualRecurringRevenue: number
  averageRevenuePerUser: number
  customerLifetimeValue: number
  customerAcquisitionCost: number
  customerLifespan: number
  retentionRate: number
  totalConversionRate: number
  grossMargin: number
  marketingSpendEfficiency: number
  profitLossMargin: number
}

export function calculateAllMetrics(params: AllMetricsParams): AllMetrics {
  const { MAU, marketingCost, expenses, effectiveRevenue, customers, currentMonth } = params

  const churnRate = EFFICIENCY_FACTOR({
    currentMonth,
    pessimistic: metricConfig.YEARLY_CHURN.CUSTOMERS.PESSIMISTIC,
    optimistic: metricConfig.YEARLY_CHURN.CUSTOMERS.OPTIMISTIC
  })

  const { monthlyRecurringRevenue, annualRecurringRevenue } =
    calculateRecurringRevenue(effectiveRevenue)
  const customerLifespan = CHURN_TO_LIFESPAN_MONTHS(churnRate)
  const averageRevenuePerUser = calculateAverageRevenuePerUser(
    monthlyRecurringRevenue,
    customers.all
  )
  const customerLifetimeValue = calculateCustomerLifetimeValue(
    averageRevenuePerUser,
    customerLifespan
  )
  const customerAcquisitionCost = calculateCustomerAcquisitionCost(marketingCost, customers.new)
  const retentionRate = calculateRetentionRate(churnRate)
  const totalConversionRate = calculateTotalConversionRate(customers.all, MAU)
  const grossMargin = calculateGrossMargin(effectiveRevenue, expenses)
  const marketingSpendEfficiency = calculateMarketingSpendEfficiency(
    marketingCost,
    effectiveRevenue
  )

  return {
    monthlyRecurringRevenue,
    annualRecurringRevenue,
    averageRevenuePerUser,
    customerLifetimeValue,
    customerAcquisitionCost,
    customerLifespan,
    retentionRate,
    totalConversionRate,
    grossMargin,
    marketingSpendEfficiency,
    profitLossMargin: parseFloat((((effectiveRevenue - expenses) / expenses) * 100).toFixed(1))
  }
}
