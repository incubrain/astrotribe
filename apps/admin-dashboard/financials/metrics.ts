import { ROUND0, USD2INR, ROUND2, CHURN_TO_LIFESPAN_MONTHS, EFFICIENCY_FACTOR } from './helpers'
import { calculateCostPerUser, type CostPerUser } from './metrics-users'
import { INCOME_STREAMS } from './customers'
import { metricConfig } from './totals'

function calculateRecurringRevenue(revenue: { free: number; pro: number; expert: number }) {
  const freeMRR = revenue.free
  const proMRR = revenue.pro
  const expertMRR = revenue.expert

  const freeARR = freeMRR * 12
  const proARR = proMRR * 12
  const expertARR = expertMRR * 12

  return {
    totalMRR: freeMRR + proMRR + expertMRR,
    totalARR: freeARR + proARR + expertARR,
    free: {
      monthly: freeMRR,
      annual: freeARR,
    },
    pro: {
      monthly: proMRR,
      annual: proARR,
    },
    expert: {
      monthly: expertMRR,
      annual: expertARR,
    },
  }
}

interface ARPU {
  MRR: { free: number; pro: number; expert: number }
  users: { free: number; pro: number; expert: number }
}
function calculateAverageRevenuePerUser({ MRR, users }: ARPU) {
  const totalUsers = users.free + users.pro + users.expert
  const monthlyRecurringRevenue = MRR.free + MRR.pro + MRR.expert

  return {
    total: totalUsers > 0 ? ROUND0(monthlyRecurringRevenue / totalUsers) : 0,
    free: users.free > 0 ? ROUND0(MRR.free / users.free) : 0,
    pro: users.pro > 0 ? ROUND0(MRR.pro / users.pro) : 0,
    expert: users.expert > 0 ? ROUND0(MRR.expert / users.expert) : 0,
  }
}
interface CLVParams {
  avgRevenue: {
    free: number
    pro: number
    expert: number
  }
  lifespan: { free: number; pro: number; expert: number }
}

function calculateCustomerLifetimeValue(params: CLVParams) {
  const freeCLV = params.avgRevenue.free * params.lifespan.free
  const proCLV = params.avgRevenue.pro * params.lifespan.pro
  const expertCLV = params.avgRevenue.expert * params.lifespan.expert
  return {
    average: ROUND2(freeCLV + proCLV + expertCLV) / 3,
    free: ROUND2(freeCLV),
    pro: ROUND2(proCLV),
    expert: ROUND2(expertCLV),
  }
}

interface CACParams {
  totalMarketingCosts: number
  newUsers: { free: number; pro: number; expert: number }
}

function calculateCustomerAcquisitionCost({ totalMarketingCosts, newUsers }: CACParams) {
  const { free, pro, expert } = newUsers
  const newCustomers = free + pro + expert

  const averageCAC = newCustomers > 0 ? Math.round(totalMarketingCosts / newCustomers) : 0
  const freeCAC = free > 0 ? Math.round(totalMarketingCosts / free) : 0
  const proCAC = pro > 0 ? Math.round(totalMarketingCosts / pro) : 0
  const expertCAC = expert > 0 ? Math.round(totalMarketingCosts / expert) : 0

  return {
    average: averageCAC,
    free: freeCAC,
    pro: proCAC,
    expert: expertCAC,
  }
}

function calculateRetentionRate(churnRate: { free: number; pro: number; expert: number }) {
  return {
    average: 100 - ((churnRate.free + churnRate.pro + churnRate.expert) * 100) / 3,
    free: 100 - churnRate.free * 100,
    pro: 100 - churnRate.pro * 100,
    expert: 100 - churnRate.expert * 100,
  }
}

function calculateConversionRates(users: {
  mau: number
  free: number
  pro: number
  expert: number
}) {
  return users.mau > 0
    ? {
        total: parseInt((((users.pro + users.expert) / users.mau) * 100).toFixed(0)),
        pro: parseInt(((users.pro / users.mau) * 100).toFixed(0)),
        expert: parseInt(((users.expert / users.mau) * 100).toFixed(0)),
      }
    : { total: 0, pro: 0, expert: 0 }
}

function calculateGrossMargin(revenue: number, costOfGoodsSold: number) {
  return revenue > 0 ? parseInt((((revenue - costOfGoodsSold) / revenue) * 100).toFixed(0)) : 0
}

function calculateMarketingSpendEfficiency(totalMarketingCosts: number, revenue: number) {
  return revenue > 0 ? parseInt(((revenue / totalMarketingCosts) * 100).toFixed(0)) : 0
}

interface ChurnRefundParams {
  currentMonth: number
  users: {
    free: number
    pro: number
    expert: number
  }
  revenue: {
    pro: number
    expert: number
  }
}

function calculateChurnAndRefunds({ currentMonth, users, revenue }: ChurnRefundParams) {
  const { subscription } = INCOME_STREAMS

  const { PRO, EXPERT } = metricConfig.MONTHLY_CHURN

  const freeChurnRate = EFFICIENCY_FACTOR({
    currentMonth,
    pessimistic: metricConfig.MONTHLY_CHURN.MAU.PESSIMISTIC,
    optimistic: metricConfig.MONTHLY_CHURN.MAU.OPTIMISTIC,
  })

  const proChurnRate = EFFICIENCY_FACTOR({
    currentMonth,
    pessimistic: PRO.PESSIMISTIC,
    optimistic: PRO.OPTIMISTIC,
  })

  const expertChurnRate = EFFICIENCY_FACTOR({
    currentMonth,
    pessimistic: EXPERT.PESSIMISTIC,
    optimistic: EXPERT.OPTIMISTIC,
  })

  const proRefundRate = EFFICIENCY_FACTOR({
    currentMonth,
    pessimistic: subscription.pro.refund.yearly.pessimistic,
    optimistic: subscription.pro.refund.yearly.optimistic,
  })

  const expertRefundRate = EFFICIENCY_FACTOR({
    currentMonth,
    pessimistic: subscription.expert.refund.yearly.pessimistic,
    optimistic: subscription.expert.refund.yearly.optimistic,
  })

  const proRefundCost = revenue.pro * proRefundRate
  const expertRefundCost = revenue.expert * expertRefundRate
  const totalRefundAmount = proRefundCost + expertRefundCost

  const proChurnedUsers = users.pro * proChurnRate
  const expertChurnedUsers = users.expert * expertChurnRate

  const totalChurnedUsers = proChurnedUsers + expertChurnedUsers

  const proRefundUsers = users.pro * proRefundRate
  const expertRefundUsers = users.expert * expertRefundRate
  const totalRefundedUsers = proRefundUsers + expertRefundUsers

  const proChurnCost = revenue.pro * proChurnRate
  const expertChurnCost = revenue.expert * expertChurnRate
  const totalChurnCost = proChurnCost + expertChurnCost

  return {
    refund: {
      total: {
        cost: totalRefundAmount,
        rate: (proRefundRate + expertRefundRate) * 100,
        count: totalRefundedUsers,
      },
      pro: {
        count: proRefundUsers,
        cost: proRefundCost,
        rate: proRefundRate,
      },
      expert: {
        count: expertRefundUsers,
        cost: expertRefundCost,
        rate: expertRefundRate,
      },
    },
    churn: {
      total: {
        cost: totalChurnCost,
        rate: proChurnRate + expertChurnRate,
        count: totalChurnedUsers,
      },
      free: {
        rate: freeChurnRate,
        count: users.free * freeChurnRate,
      },
      pro: {
        count: proChurnedUsers,
        cost: proChurnCost,
        rate: proChurnRate,
      },
      expert: {
        count: expertChurnedUsers,
        cost: expertChurnCost,
        rate: expertChurnRate,
      },
    },
  }
}

interface AllMetricsParams {
  currentMonth: number
  marketing: {
    cost: number
    leads: number
  }
  expenses: {
    total: number
    free: number
    pro: number
    expert: number
  }
  revenue: {
    free: number
    pro: number
    expert: number
  }
  users: {
    mau: number
    free: number
    pro: number
    expert: number
    totalCustomers: number
    new: number
    newCustomers: number
  }
}

export function calculateAllMetrics(params: AllMetricsParams): AllMetrics {
  const { marketing, expenses, revenue, users, currentMonth } = params

  const { churn, refund } = calculateChurnAndRefunds({
    currentMonth,
    users,
    revenue: {
      pro: revenue.pro,
      expert: revenue.expert,
    },
  })

  const effectiveRevenue =
    revenue.free + revenue.pro + revenue.expert - refund.total.cost - churn.total.cost
  const recurringRevenue = calculateRecurringRevenue(revenue)

  const freeLifespan = CHURN_TO_LIFESPAN_MONTHS(churn.free.rate)
  const proLifespan = CHURN_TO_LIFESPAN_MONTHS(churn.pro.rate)
  const expertLifespan = CHURN_TO_LIFESPAN_MONTHS(churn.expert.rate)

  const avgRevenue = calculateAverageRevenuePerUser({
    MRR: {
      free: recurringRevenue.free.monthly,
      pro: recurringRevenue.pro.monthly,
      expert: recurringRevenue.expert.monthly,
    },
    users,
  })

  const lifetimeValue = calculateCustomerLifetimeValue({
    avgRevenue: {
      free: avgRevenue.free,
      pro: avgRevenue.pro,
      expert: avgRevenue.expert,
    },
    lifespan: {
      free: freeLifespan,
      pro: proLifespan,
      expert: expertLifespan,
    },
  })

  const customerAcquisitionCost = calculateCustomerAcquisitionCost({
    totalMarketingCosts: marketing.cost,
    newUsers: {
      free: users.free,
      pro: users.pro,
      expert: users.expert,
    },
  })

  const retentionRate = calculateRetentionRate({
    free: churn.free.rate,
    pro: churn.pro.rate,
    expert: churn.expert.rate,
  })

  const totalConversionRate = calculateConversionRates(users)

  const grossMargin = calculateGrossMargin(effectiveRevenue, expenses.total)

  const marketingSpendEfficiency = calculateMarketingSpendEfficiency(
    marketing.cost,
    effectiveRevenue,
  )

  const userCost = calculateCostPerUser({
    users,
    totalCosts: {
      free: expenses.free,
      pro: expenses.pro,
      expert: expenses.expert,
    },
  })

  console.log('PLMargin', effectiveRevenue, expenses.total)

  return {
    mau: {
      total: users.mau,
      new: users.new,
      churned: churn.total.count,
      free: users.free,
      pro: users.pro,
      expert: users.expert,
      customers: users.totalCustomers,
    },
    monthlyRecurringRevenue: {
      effective: effectiveRevenue,
      free: recurringRevenue.free.monthly,
      pro: recurringRevenue.pro.monthly,
      expert: recurringRevenue.expert.monthly,
    },
    annualRecurringRevenue: {
      effective: effectiveRevenue * 12,
      free: recurringRevenue.free.annual,
      pro: recurringRevenue.pro.annual,
      expert: recurringRevenue.expert.annual,
    },
    averageRevenuePerUser: {
      total: avgRevenue.total,
      free: avgRevenue.free,
      pro: avgRevenue.pro,
      expert: avgRevenue.expert,
    },
    customerLifetimeValue: lifetimeValue,
    customerAcquisitionCost: customerAcquisitionCost,
    customerLifespan: {
      average: (freeLifespan + proLifespan + expertLifespan) / 3,
      free: freeLifespan,
      pro: proLifespan,
      expert: expertLifespan,
    },
    retentionRate: {
      average: retentionRate.average,
      free: retentionRate.free,
      pro: retentionRate.pro,
      expert: retentionRate.expert,
    },
    refund,
    churn,
    userCost,
    conversionRate: {
      total: totalConversionRate.total,
      pro: totalConversionRate.pro,
      expert: totalConversionRate.expert,
    },
    grossMargin,
    marketingSpendEfficiency,
    profitLossMargin: parseFloat(
      (((effectiveRevenue - expenses.total) / expenses.total) * 100).toFixed(1),
    ),
  }
}

export interface AllMetrics {
  mau: {
    total: number
    new: number
    churned: number
    free: number
    pro: number
    expert: number
    customers: number
  }
  monthlyRecurringRevenue: {
    effective: number
    free: number
    pro: number
    expert: number
  }
  annualRecurringRevenue: {
    effective: number
    free: number
    pro: number
    expert: number
  }
  averageRevenuePerUser: {
    total: number
    free: number
    pro: number
    expert: number
  }
  customerLifetimeValue: {
    average: number
    free: number
    pro: number
    expert: number
  }
  customerAcquisitionCost: {
    average: number
    free: number
    pro: number
    expert: number
  }
  customerLifespan: {
    average: number
    free: number
    pro: number
    expert: number
  }
  retentionRate: {
    average: number
    free: number
    pro: number
    expert: number
  }
  refund: {
    total: {
      cost: number
      rate: number
      count: number
    }
    pro: {
      count: number
      cost: number
      rate: number
    }
    expert: {
      count: number
      cost: number
      rate: number
    }
  }
  churn: {
    total: {
      cost: number
      rate: number
      count: number
    }
    free: {
      rate: number
      count: number
    }
    pro: {
      count: number
      cost: number
      rate: number
    }
    expert: {
      count: number
      cost: number
      rate: number
    }
  }
  userCost: CostPerUser
  conversionRate: {
    total: number
    pro: number
    expert: number
  }
  grossMargin: number
  marketingSpendEfficiency: number
  profitLossMargin: number
}
