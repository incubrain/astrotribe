import { USD2INR } from './helpers'

type PaymentProvider = 'Razorpay' | 'Stripe'
type SubscriptionType = 'Pro' | 'Expert'
type PaymentFrequency = 'Monthly' | 'Annual'

type DomesticPaymentMethod = 'Visa' | 'MasterCard' | 'UPI'
type InternationalPaymentMethod = 'MasterCardVisa' | 'AmericanExpress' | 'InternationalCard'

const subscriptionPrices: Record<SubscriptionType, number> = {
  Pro: 20,
  Expert: 50
}

const paymentMethodDistribution = {
  domestic: {
    Visa: 25,
    MasterCard: 15,
    UPI: 60
  },
  international: {
    MasterCardVisa: 50,
    AmericanExpress: 30,
    InternationalCard: 20
  }
}

function distributeCustomers(
  numCustomers: number,
  distribution: Record<string, number>
): Record<string, number> {
  let result: Record<string, number> = {}
  let totalAssigned = 0

  for (const method in distribution) {
    const count = Math.floor(numCustomers * (distribution[method] / 100))
    result[method] = count
    totalAssigned += count
  }

  // Handle rounding differences by adjusting the last method's count
  if (totalAssigned < numCustomers) {
    const lastMethod = Object.keys(distribution).pop()!
    result[lastMethod] += numCustomers - totalAssigned
  }

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
        autoDebit: 17
      }
    },
    MasterCard: {
      baseFeePercentage: 0.005,
      additionalFees1kInrPlus: {
        registration: 7,
        autoDebit: 17
      }
    },
    UPI: {
      baseFeePercentage: 0.0099,
      additionalFees1kInrPlus: {
        registration: 7,
        autoDebit: 17
      }
    }
  }
}

const stripeConfig = {
  international: {
    MasterCardVisa: {
      platformFeePercentage: 0.03,
      conversionFeePercentage: 0.02
    },
    AmericanExpress: {
      platformFeePercentage: 0.035,
      conversionFeePercentage: 0.02
    },
    InternationalCard: {
      platformFeePercentage: 0.043,
      conversionFeePercentage: 0.02
    }
  },
  billing: {
    subscriptionFeePercentage: 0.007
  }
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
    base: number
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
  additionalFees
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
      base: platformCost * numCustomers,
      subscription: subscriptionCost * numCustomers,
      gst: gstCost * numCustomers,
      additionalFees: extraCost * numCustomers
    }
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
  frequency
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
    additionalFees
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

export interface ProviderChunk {
  provider: PaymentProvider
  totalCustomers: number
  totalCost: number
  transactions: TransactionChunk[]
}

export function handleSubscriptions({
  numCustomers,
  isInternational,
  frequency
}: HandleSubscriptionParams): ProviderChunk {
  const paymentDistribution = isInternational
    ? paymentMethodDistribution.international
    : paymentMethodDistribution.domestic

  const proDistribution = distributeCustomers(numCustomers.pro, paymentDistribution)
  const expertDistribution = distributeCustomers(numCustomers.expert, paymentDistribution)

  console.log('Customer Input', numCustomers)
  let totalCost = 0
  let totalCustomers = 0
  const provider = isInternational ? 'Stripe' : 'Razorpay'

  const combinedResults: TransactionChunk[] = []

  Object.keys(paymentDistribution).forEach((paymentMethod) => {
    const proCount = proDistribution[paymentMethod] || 0
    const expertCount = expertDistribution[paymentMethod] || 0

    if (proCount > 0 || expertCount > 0) {
      const transactionDetailsPro = calculateFees({
        numCustomers: proCount,
        paymentMethod: paymentMethod as DomesticPaymentMethod | InternationalPaymentMethod,
        amountInUSD: subscriptionPrices.Pro,
        frequency
      })

      const transactionDetailsExpert = calculateFees({
        numCustomers: expertCount,
        paymentMethod: paymentMethod as DomesticPaymentMethod | InternationalPaymentMethod,
        amountInUSD: subscriptionPrices.Expert,
        frequency
      })

      totalCost += transactionDetailsPro.totalCost + transactionDetailsExpert.totalCost
      totalCustomers += proCount + expertCount
      combinedResults.push({
        paymentMethod: paymentMethod as DomesticPaymentMethod | InternationalPaymentMethod,
        methodCost: transactionDetailsPro.totalCost + transactionDetailsExpert.totalCost,
        methodCustomers: proCount + expertCount,
        frequency,
        pro: transactionDetailsPro,
        expert: transactionDetailsExpert
      })
    }
  })

  console.log('Customer Output', totalCustomers)

  return {
    provider,
    totalCustomers,
    totalCost,
    transactions: combinedResults
  }
}

interface SimulatePurchasesParams {
  newCustomers: {
    pro: number
    expert: number
  }
  frequency: PaymentFrequency
}

export interface TransactionChunk {
  paymentMethod: DomesticPaymentMethod | InternationalPaymentMethod
  frequency: PaymentFrequency
  methodCost: number
  methodCustomers: number
  pro: PaymentCosts
  expert: PaymentCosts
}

export interface TransactionDetails {
  totalCost: number
  totalCustomers: number
  razorpay: ProviderChunk
  stripe: ProviderChunk
}

export function simulateRealWorldPurchases({
  newCustomers,
  frequency
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
      expert: razorpayExpertCustomers
    },
    isInternational: false,
    frequency
  })

  const stripeTransaction = handleSubscriptions({
    numCustomers: {
      pro: stripeProCustomers,
      expert: stripeExpertCustomers
    },
    isInternational: true,
    frequency
  })

  console.log(
    'Razorpay Customers',
    razorpayProCustomers,
    razorpayExpertCustomers,
    razorpayTransactions
  )

  return {
    totalCost: razorpayTransactions.totalCost + stripeTransaction.totalCost,
    totalCustomers: razorpayTransactions.totalCustomers + stripeTransaction.totalCustomers,
    razorpay: razorpayTransactions,
    stripe: stripeTransaction
  }
}
