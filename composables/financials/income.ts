import { USD2INR, ROUND0, EFFICIENCY_FACTOR } from './helpers'
import { metricConfig } from './totals'

export const INCOME_STREAMS = {
  subscription: {
    pro: {
      price: 20, // USD
      conversion: {
        current: 0,
        pessimistic: 0.018,
        optimistic: 0.05
      },
      refund: {
        yearly: {
          pessimistic: 0.12, // Yearly refund rate
          optimistic: 0.06
        }
      }
    },
    expert: {
      price: 50, // USD
      conversion: {
        current: 0,
        pessimistic: 0.005,
        optimistic: 0.025
      },
      refund: {
        yearly: {
          pessimistic: 0.12, // Yearly refund rate
          optimistic: 0.06
        }
      }
    }
  },
  advertising: 0.04, // USD per MAU
  promotion: 0.03, // USD per MAU
  affiliate: 0.02 // USD per MAU
}

function adjustConversionRates(MAU: number) {
  const { subscription } = INCOME_STREAMS
  subscription.pro.conversion.current = Math.min(
    subscription.pro.conversion.pessimistic +
      (MAU / 150000) *
        (subscription.pro.conversion.optimistic - subscription.pro.conversion.pessimistic),
    subscription.pro.conversion.optimistic
  )

  subscription.expert.conversion.current =
    MAU >= 5000
      ? Math.min(
          subscription.expert.conversion.pessimistic +
            (MAU / 100000) *
              (subscription.expert.conversion.optimistic -
                subscription.expert.conversion.pessimistic),
          subscription.expert.conversion.optimistic
        )
      : 0
}

function calculatePayingUsers(MAU: number) {
  const { subscription } = INCOME_STREAMS
  let proCustomers = ROUND0(MAU * subscription.pro.conversion.current)
  const expertFromMau = ROUND0(MAU * subscription.expert.conversion.current) // Small percentage directly from MAU
  const proUpgrades = ROUND0(proCustomers * subscription.expert.conversion.current) // Small percentage from Pro users upgrading
  const expertCustomers = expertFromMau + proUpgrades
  proCustomers = proCustomers - proUpgrades
  return { proCustomers, expertCustomers }
}

function calculateRevenueFromCustomers(proCustomers: number, expertCustomers: number) {
  const { subscription } = INCOME_STREAMS
  const proRevenue = proCustomers * subscription.pro.price
  const expertRevenue = expertCustomers * subscription.expert.price
  const totalSubscriptionRevenue = proRevenue + expertRevenue
  return { proRevenue, expertRevenue, totalSubscriptionRevenue }
}

interface ChurnRefundParams {
  currentMonth: number
  proCustomers: number
  expertCustomers: number
  proRevenue: number
  expertRevenue: number
}

function calculateChurnAndRefunds({
  currentMonth,
  proCustomers,
  expertCustomers,
  proRevenue,
  expertRevenue
}: ChurnRefundParams) {
  const { subscription } = INCOME_STREAMS
  const { PESSIMISTIC, OPTIMISTIC } = metricConfig.YEARLY_CHURN.CUSTOMERS

  const customerChurn = EFFICIENCY_FACTOR({
    currentMonth,
    pessimistic: PESSIMISTIC,
    optimistic: OPTIMISTIC
  })
  const proRefund = EFFICIENCY_FACTOR({
    currentMonth,
    pessimistic: subscription.pro.refund.yearly.pessimistic,
    optimistic: subscription.pro.refund.yearly.optimistic
  })

  const expertRefund = EFFICIENCY_FACTOR({
    currentMonth,
    pessimistic: subscription.expert.refund.yearly.pessimistic,
    optimistic: subscription.expert.refund.yearly.optimistic
  })

  const proChurnedUsers = proCustomers * customerChurn

  const expertChurnedUsers = expertCustomers * customerChurn

  const churnUsers = proChurnedUsers + expertChurnedUsers

  const proRefundUsers = proCustomers * proRefund

  const expertRefundUsers = expertCustomers * expertRefund

  const refundUsers = proRefundUsers + expertRefundUsers

  const churnAmount = proRevenue * customerChurn + expertRevenue * customerChurn
  const refundAmount = proRevenue * proRefund + expertRevenue * expertRefund
  const effectiveRevenue = proRevenue + expertRevenue - (churnAmount + refundAmount)

  return {
    effectiveRevenue,
    refund: {
      cost: refundAmount,
      pro: proRefund,
      expert: expertRefund,
      count: refundUsers
    },
    churn: {
      cost: churnAmount,
      rate: customerChurn,
      count: churnUsers
    }
  }
}

function calculateAdditionalRevenue(MAU: number) {
  const advertisingRevenue = MAU * INCOME_STREAMS.advertising
  const affiliateRevenue = MAU * INCOME_STREAMS.affiliate
  const promotionRevenue = MAU * INCOME_STREAMS.promotion
  return { advertisingRevenue, affiliateRevenue, promotionRevenue }
}

interface RevenueParams {
  month: number
  mau: {
    total: number
    new: number
    existing: number
    churned: number
  }
  customers: {
    existing: number
    pro: number
    expert: number
  }
}

export interface RevenueResult {
  total: {
    revenue: number
    effective: number
  }
  customers: {
    totalRevenue: number
    totalCount: number
    newCount: number
    totalConversion: number
    pro: {
      count: number
      new: number
      revenue: number
      price: number
      conversion: number
    }
    expert: {
      count: number
      new: number
      revenue: number
      price: number
      conversion: number
    }
    churn: {
      cost: number
      rate: number
      count: number
    }
    refund: {
      cost: number
      pro: number
      expert: number
      count: number
    }
  }
  streams: {
    advertising: {
      revenue: number
    }
    affiliate: {
      revenue: number
    }
    promotion: {
      revenue: number
    }
  }
}

export function calculateRevenue({ mau, customers, month }: RevenueParams): RevenueResult {
  adjustConversionRates(mau.total)
  const { subscription } = INCOME_STREAMS

  const { proCustomers, expertCustomers } = calculatePayingUsers(mau.new)

  const totalPro = proCustomers + customers.pro
  const totalExpert = expertCustomers + customers.expert
  const { proRevenue, expertRevenue, totalSubscriptionRevenue } = calculateRevenueFromCustomers(
    totalPro,
    totalExpert
  )

  const { churn, refund, effectiveRevenue } = calculateChurnAndRefunds({
    currentMonth: month,
    proCustomers: totalPro,
    expertCustomers: totalExpert,
    proRevenue,
    expertRevenue
  })

  const { advertisingRevenue, affiliateRevenue, promotionRevenue } = calculateAdditionalRevenue(
    mau.total
  )

  const totalEffectiveRevenue =
    effectiveRevenue + advertisingRevenue + affiliateRevenue + promotionRevenue

  const totalRevenue =
    proRevenue + expertRevenue + advertisingRevenue + affiliateRevenue + promotionRevenue

  const totalConversionRate = ((proCustomers + expertCustomers) / mau.new) * 100

  return {
    total: {
      revenue: USD2INR(totalRevenue),
      effective: USD2INR(totalEffectiveRevenue)
    },
    customers: {
      totalRevenue: USD2INR(totalSubscriptionRevenue - (churn.cost + refund.cost)),
      totalCount: totalExpert + totalPro - churn.count,
      newCount: proCustomers + expertCustomers,
      totalConversion: parseFloat(totalConversionRate.toFixed(2)),
      pro: {
        count: totalPro,
        new: proCustomers,
        revenue: USD2INR(proRevenue),
        price: subscription.pro.price,
        conversion: parseFloat((subscription.pro.conversion.current * 100).toFixed(2))
      },
      expert: {
        count: totalExpert,
        new: expertCustomers,
        revenue: USD2INR(expertRevenue),
        price: subscription.expert.price,
        conversion: parseFloat((subscription.expert.conversion.current * 100).toFixed(2))
      },
      churn: {
        cost: USD2INR(churn.cost),
        rate: churn.rate,
        count: parseInt(churn.count.toFixed(0))
      },
      refund: {
        cost: USD2INR(refund.cost),
        pro: refund.pro,
        expert: refund.expert,
        count: parseInt(refund.count.toFixed(0))
      }
    },
    streams: {
      advertising: {
        revenue: USD2INR(advertisingRevenue)
      },
      affiliate: { revenue: USD2INR(affiliateRevenue) },
      promotion: { revenue: USD2INR(promotionRevenue) }
    }
  }
}
