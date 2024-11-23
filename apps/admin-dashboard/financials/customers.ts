import { USD2INR, ROUND0, EFFICIENCY_FACTOR } from './helpers'
import { metricConfig } from './totals'

export const INCOME_STREAMS = {
  subscription: {
    pro: {
      price: 20, // USD
      conversion: {
        current: 0,
        pessimistic: 0.018,
        optimistic: 0.05,
      },
      refund: {
        yearly: {
          pessimistic: 0.12, // Yearly refund rate
          optimistic: 0.06,
        },
      },
    },
    expert: {
      price: 50, // USD
      conversion: {
        current: 0,
        pessimistic: 0.005,
        optimistic: 0.025,
      },
      refund: {
        yearly: {
          pessimistic: 0.12, // Yearly refund rate
          optimistic: 0.06,
        },
      },
    },
  },
  advertising: 0.04, // USD per MAU
  promotion: 0.03, // USD per MAU
  affiliate: 0.02, // USD per MAU
}

function adjustConversionRates(MAU: number) {
  const { subscription } = INCOME_STREAMS
  subscription.pro.conversion.current = Math.min(
    subscription.pro.conversion.pessimistic +
    (MAU / 150000) *
    (subscription.pro.conversion.optimistic - subscription.pro.conversion.pessimistic),
    subscription.pro.conversion.optimistic,
  )

  subscription.expert.conversion.current =
    MAU >= 5000 ?
      Math.min(
        subscription.expert.conversion.pessimistic +
        (MAU / 100000) *
        (subscription.expert.conversion.optimistic -
          subscription.expert.conversion.pessimistic),
        subscription.expert.conversion.optimistic,
      ) :
      0
}

function newMauToCustomers(MAU: number) {
  const { subscription } = INCOME_STREAMS
  let proCustomers = ROUND0(MAU * subscription.pro.conversion.current)
  const expertFromMau = ROUND0(MAU * subscription.expert.conversion.current) // Small percentage directly from MAU
  const proUpgrades = ROUND0(proCustomers * subscription.expert.conversion.current) // Small percentage from Pro users upgrading
  const expertCustomers = expertFromMau + proUpgrades
  proCustomers = proCustomers - proUpgrades
  return { proCustomers, expertCustomers }
}

function subscriptionRevenueFromCustomers(proCustomers: number, expertCustomers: number) {
  const { subscription } = INCOME_STREAMS
  const proRevenue = proCustomers * subscription.pro.price
  const expertRevenue = expertCustomers * subscription.expert.price
  return { proRevenue, expertRevenue }
}

function calculateAdditionalRevenue(users: { free: number; pro: number; expert: number }) {
  const totalUsers = users.free + users.pro + users.expert
  return {
    advertisingRevenue: {
      total: totalUsers * INCOME_STREAMS.advertising,
      free: users.free * INCOME_STREAMS.advertising,
      pro: users.pro * INCOME_STREAMS.advertising,
      expert: users.expert * INCOME_STREAMS.advertising,
    },
    affiliateRevenue: {
      total: totalUsers * INCOME_STREAMS.affiliate,
      free: users.free * INCOME_STREAMS.affiliate,
      pro: users.pro * INCOME_STREAMS.affiliate,
      expert: users.expert * INCOME_STREAMS.affiliate,
    },
    promotionRevenue: {
      total: totalUsers * INCOME_STREAMS.promotion,
      free: users.free * INCOME_STREAMS.promotion,
      pro: users.pro * INCOME_STREAMS.promotion,
      expert: users.expert * INCOME_STREAMS.promotion,
    },
  }
}

interface RevenueParams {
  mau: {
    total: number
    new: number
  }
  customers: {
    pro: number
    expert: number
  }
}

export function calculateRevenue({ mau, customers }: RevenueParams): RevenueResult {
  adjustConversionRates(mau.total)
  const { subscription } = INCOME_STREAMS

  const { proCustomers, expertCustomers } = newMauToCustomers(mau.new)

  const totalPro = proCustomers + customers.pro
  const totalExpert = expertCustomers + customers.expert

  const { proRevenue, expertRevenue } = subscriptionRevenueFromCustomers(totalPro, totalExpert)

  const { advertisingRevenue, affiliateRevenue, promotionRevenue } = calculateAdditionalRevenue({
    free: mau.total - totalPro - totalExpert,
    pro: totalPro,
    expert: totalExpert,
  })

  const proExtraRevenue = affiliateRevenue.pro + promotionRevenue.pro + advertisingRevenue.pro
  const expertExtraRevenue =
    affiliateRevenue.expert + promotionRevenue.expert + advertisingRevenue.expert
  const freeExtraRevenue = affiliateRevenue.free + promotionRevenue.free + advertisingRevenue.free

  const proTotalRevenue = proRevenue + proExtraRevenue
  const expertTotalRevenue = expertRevenue + expertExtraRevenue
  const totalAdditionalRevenue =
    advertisingRevenue.total + affiliateRevenue.total + promotionRevenue.total
  const totalRevenue = proRevenue + expertRevenue + totalAdditionalRevenue

  return {
    total: {
      revenue: USD2INR(totalRevenue),
      free: USD2INR(freeExtraRevenue),
      pro: USD2INR(proTotalRevenue),
      expert: USD2INR(expertTotalRevenue),
      advertising: USD2INR(advertisingRevenue.total),
      affiliate: USD2INR(affiliateRevenue.total),
      promotion: USD2INR(promotionRevenue.total),
    },
    customers: {
      free: {
        revenue: USD2INR(freeExtraRevenue),
        advertising: USD2INR(advertisingRevenue.free),
        affiliate: USD2INR(affiliateRevenue.free),
        promotion: USD2INR(promotionRevenue.free),
      },
      pro: {
        count: totalPro,
        new: proCustomers,
        revenue: USD2INR(proRevenue),
        price: subscription.pro.price,
        conversion: parseFloat((subscription.pro.conversion.current * 100).toFixed(2)),
        affiliate: USD2INR(affiliateRevenue.pro),
        advertising: USD2INR(advertisingRevenue.pro),
        promotion: USD2INR(promotionRevenue.pro),
      },
      expert: {
        count: totalExpert,
        new: expertCustomers,
        revenue: USD2INR(expertRevenue),
        price: subscription.expert.price,
        conversion: parseFloat((subscription.expert.conversion.current * 100).toFixed(2)),
        advertising: USD2INR(advertisingRevenue.expert),
        affiliate: USD2INR(affiliateRevenue.expert),
        promotion: USD2INR(promotionRevenue.expert),
      },
    },
  }
}

export interface RevenueResult {
  total: {
    revenue: number
    free: number
    pro: number
    expert: number
    advertising: number
    affiliate: number
    promotion: number
  }
  customers: {
    free: {
      revenue: number
      advertising: number
      affiliate: number
      promotion: number
    }
    pro: {
      count: number
      new: number
      revenue: number
      price: number
      conversion: number
      advertising: number
      affiliate: number
      promotion: number
    }
    expert: {
      count: number
      new: number
      revenue: number
      price: number
      conversion: number
      advertising: number
      affiliate: number
      promotion: number
    }
  }
}
