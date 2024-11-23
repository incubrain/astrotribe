import { USD2INR } from './helpers'

type PaymentProvider = 'Razorpay' | 'Stripe'
type SubscriptionType = 'Pro' | 'Expert'
type PaymentFrequency = 'Monthly' | 'Annual'

type DomesticPaymentMethod = 'Visa' | 'MasterCard' | 'UPI'
type InternationalPaymentMethod = 'MasterCardVisa' | 'AmericanExpress' | 'InternationalCard'

const subscriptionPrices: Record<SubscriptionType, number> = {
  Pro: 20,
  Expert: 50,
}

const paymentMethodDistribution = {
  domestic: {
    Visa: 25,
    MasterCard: 15,
    UPI: 60,
  },
  international: {
    MasterCardVisa: 50,
    AmericanExpress: 30,
    InternationalCard: 20,
  },
}

function distributeCustomers(
  numCustomers: number,
  distribution: Record<string, number>,
): Record<string, number> {
  const result: Record<string, number> = {}
  let totalAssigned = 0
  let fractionalPart = 0

  Object.keys(distribution).forEach((method, index, array) => {
    const proportion = distribution[method] / 100
    const calculated = numCustomers * proportion + fractionalPart
    const count = Math.floor(calculated)

    fractionalPart = calculated - count // Keep track of fractional part for more precise distribution
    result[method] = count
    totalAssigned += count

    // Distribute any remaining customers more evenly
    if (index === array.length - 1 && totalAssigned < numCustomers) {
      result[method] += numCustomers - totalAssigned
    }
  })

  return result
}

const razorpayConfig = {
  platformFeePercentage: 0.02,
  gstPercentage: 0.18,
  subscription: {
    Visa: {
      baseFeePercentage: 0.009,
      additionalFees1kInrPlus: {
        registration: 7,
        autoDebit: 17,
      },
    },
    MasterCard: {
      baseFeePercentage: 0.005,
      additionalFees1kInrPlus: {
        registration: 7,
        autoDebit: 17,
      },
    },
    UPI: {
      baseFeePercentage: 0.0099,
      additionalFees1kInrPlus: {
        registration: 7,
        autoDebit: 17,
      },
    },
  },
}

const stripeConfig = {
  international: {
    MasterCardVisa: {
      platformFeePercentage: 0.03,
      conversionFeePercentage: 0.02,
    },
    AmericanExpress: {
      platformFeePercentage: 0.035,
      conversionFeePercentage: 0.02,
    },
    InternationalCard: {
      platformFeePercentage: 0.043,
      conversionFeePercentage: 0.02,
    },
  },
  billing: {
    subscriptionFeePercentage: 0.007,
  },
}

interface PaymentCostsInput {
  numCustomers: number
  priceInUSD: number
  subscriptionFee: number
  platformFee: number
  gst: number
  additionalFees:
    | {
      registration: number
      autoDebit: number
    }
    | { conversionFee: number }
}

interface PaymentCosts {
  numCustomers: number
  totalCost: number
  percentage: number
  fees: {
    platform: number
    subscription: number
    gst: number
    additionalFees: number
  }
}

function calculatePaymentCosts({
  numCustomers,
  priceInUSD,
  subscriptionFee,
  platformFee,
  gst,
  additionalFees,
}: PaymentCostsInput): PaymentCosts {
  const platformCost = USD2INR(priceInUSD * platformFee)
  const subscriptionCost = USD2INR(priceInUSD * subscriptionFee)
  const gstCost = (platformCost + subscriptionCost) * gst

  let costPerCustomer = platformCost + gstCost + subscriptionCost
  let extraCost = 0

  if ('conversionFee' in additionalFees) {
    const conversionFee = USD2INR(priceInUSD * additionalFees.conversionFee)
    extraCost += conversionFee
    costPerCustomer += conversionFee
  } else {
    extraCost = additionalFees.registration + additionalFees.autoDebit
    costPerCustomer += extraCost
  }

  return {
    numCustomers,
    totalCost: costPerCustomer * numCustomers,
    percentage: (costPerCustomer / priceInUSD) * 100,
    fees: {
      platform: platformCost * numCustomers,
      subscription: subscriptionCost * numCustomers,
      gst: gstCost * numCustomers,
      additionalFees: extraCost * numCustomers,
    },
  }
}

interface PlatformFeesInput {
  numCustomers: number
  paymentMethod: DomesticPaymentMethod | InternationalPaymentMethod
  amountInUSD: number
  frequency: PaymentFrequency
}

// Stripe

function calculateFees({
  numCustomers,
  paymentMethod,
  amountInUSD,
  frequency,
}: PlatformFeesInput): PaymentCosts {
  let subscriptionFee, platformFee, additionalFees, gst

  if (paymentMethod in razorpayConfig.subscription) {
    // Handle Razorpay fees
    const methodConfig = razorpayConfig.subscription[paymentMethod as DomesticPaymentMethod]
    platformFee = razorpayConfig.platformFeePercentage
    subscriptionFee = methodConfig.baseFeePercentage
    additionalFees = methodConfig.additionalFees1kInrPlus // Specific for Razorpay domestic methods
    gst = (platformFee + subscriptionFee) * razorpayConfig.gstPercentage
  } else {
    // Handle Stripe fees
    const methodConfig = stripeConfig.international[paymentMethod as InternationalPaymentMethod]
    platformFee = methodConfig.platformFeePercentage
    subscriptionFee = stripeConfig.billing.subscriptionFeePercentage // Using a generic subscription fee for all Stripe methods
    additionalFees = { conversionFee: methodConfig.conversionFeePercentage } // Specific for Stripe international methods
    gst = 0
  }

  // Call calculatePaymentCosts for detailed fee calculation
  return calculatePaymentCosts({
    numCustomers,
    priceInUSD: amountInUSD,
    subscriptionFee,
    platformFee,
    gst,
    additionalFees,
  })
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

interface HandleSubscriptionParams {
  numCustomers: {
    pro: number
    expert: number
  }
  isInternational: boolean
  frequency: PaymentFrequency
}

export function handleSubscriptions({
  numCustomers,
  isInternational,
  frequency,
}: HandleSubscriptionParams): ProviderChunk {
  const paymentDistribution = isInternational ?
    paymentMethodDistribution.international :
    paymentMethodDistribution.domestic

  const proDistribution = distributeCustomers(numCustomers.pro, paymentDistribution)
  const expertDistribution = distributeCustomers(numCustomers.expert, paymentDistribution)

  let totalCost = 0
  let totalCustomers = 0
  const provider = isInternational ? 'Stripe' : 'Razorpay'

  const combinedResults: TransactionChunk[] = []

  console.log('Distributed Customers:', proDistribution, expertDistribution)

  Object.keys(paymentDistribution).forEach((paymentMethod) => {
    const proCount = proDistribution[paymentMethod] || 0
    const expertCount = expertDistribution[paymentMethod] || 0

    const blankTransaction = {
      totalCost: 0,
      numCustomers: 0,
      percentage: 0,
      fees: {
        platform: 0,
        subscription: 0,
        gst: 0,
        additionalFees: 0,
      },
    }

    if (proCount > 0 || expertCount > 0) {
      const transactionDetailsPro = calculateFees({
        numCustomers: proCount,
        paymentMethod: paymentMethod as DomesticPaymentMethod | InternationalPaymentMethod,
        amountInUSD: subscriptionPrices.Pro,
        frequency,
      })

      const transactionDetailsExpert = calculateFees({
        numCustomers: expertCount,
        paymentMethod: paymentMethod as DomesticPaymentMethod | InternationalPaymentMethod,
        amountInUSD: subscriptionPrices.Expert,
        frequency,
      })

      totalCost += transactionDetailsPro.totalCost + transactionDetailsExpert.totalCost
      totalCustomers += proCount + expertCount
      combinedResults.push({
        paymentMethod: paymentMethod as DomesticPaymentMethod | InternationalPaymentMethod,
        methodCost: transactionDetailsPro.totalCost + transactionDetailsExpert.totalCost,
        methodCustomers: proCount + expertCount,
        frequency,
        pro: transactionDetailsPro,
        expert: transactionDetailsExpert,
      })
    } else {
      combinedResults.push({
        paymentMethod: paymentMethod as DomesticPaymentMethod | InternationalPaymentMethod,
        methodCost: 0,
        methodCustomers: 0,
        frequency,
        pro: blankTransaction,
        expert: blankTransaction,
      })
    }
  })

  return {
    provider,
    totalCustomers,
    totalCost,
    transactions: combinedResults,
  }
}

interface SimulatePurchasesParams {
  newCustomers: {
    pro: number
    expert: number
  }
  frequency: PaymentFrequency
}

export function simulateRealWorldPurchases({
  newCustomers,
  frequency,
}: SimulatePurchasesParams): TransactionDetails {
  const razorpayPercentage = getRandomInt(50, 60)
  const stripePercentage = 100 - razorpayPercentage

  const razorpayProCustomers = Math.floor(newCustomers.pro * (razorpayPercentage / 100))
  const stripeProCustomers = newCustomers.pro - razorpayProCustomers

  const razorpayExpertCustomers = Math.floor(newCustomers.expert * (razorpayPercentage / 100))
  const stripeExpertCustomers = newCustomers.expert - razorpayExpertCustomers

  const razorpayTransactions = handleSubscriptions({
    numCustomers: {
      pro: razorpayProCustomers,
      expert: razorpayExpertCustomers,
    },
    isInternational: false,
    frequency,
  })

  const stripeTransaction = handleSubscriptions({
    numCustomers: {
      pro: stripeProCustomers,
      expert: stripeExpertCustomers,
    },
    isInternational: true,
    frequency,
  })

  return {
    totalCost: razorpayTransactions.totalCost + stripeTransaction.totalCost,
    totalCustomers: razorpayTransactions.totalCustomers + stripeTransaction.totalCustomers,
    razorpay: razorpayTransactions,
    stripe: stripeTransaction,
  }
}

export interface TransactionDetails {
  totalCost: number
  totalCustomers: number
  razorpay: ProviderChunk
  stripe: ProviderChunk
}

export interface ProviderChunk {
  provider: PaymentProvider
  totalCustomers: number
  totalCost: number
  transactions: TransactionChunk[]
}

export interface TransactionChunk {
  paymentMethod: DomesticPaymentMethod | InternationalPaymentMethod
  frequency: PaymentFrequency
  methodCost: number
  methodCustomers: number
  pro: PaymentCosts
  expert: PaymentCosts
}
