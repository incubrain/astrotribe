<script setup lang="ts">
const { months, payments, totals, metrics, rgba } = useFinancials()

const stripePaymentTypes = ['InternationalCard', 'AmericanExpress', 'MasterCardVisa']

const stripeTransactions = computed(() => {
  return stripePaymentTypes.reduce((acc, type) => {
    const transactions = payments.value.flatMap((month) =>
      month.stripe.transactions.flatMap((transaction) =>
        transaction.paymentMethod === type
          ? [
              {
                totalCost: transaction.pro.totalCost + transaction.expert.totalCost || 0,
                totalTransactions: transaction.methodCustomers || 0,
                additionalFees:
                  transaction.pro.fees.additionalFees + transaction.expert.fees.additionalFees || 0,
                gst: transaction.pro.fees.gst + transaction.expert.fees.gst || 0,
                subscription:
                  transaction.pro.fees.subscription + transaction.expert.fees.subscription || 0,
                platform: transaction.pro.fees.platform + transaction.expert.fees.platform || 0
              }
            ]
          : []
      )
    )

    acc[type] = {
      transactions,
      totals: transactions.reduce(
        (totals, transaction) => {
          totals.totalCost += transaction.totalCost
          totals.totalTransactions += transaction.totalTransactions
          totals.additionalFees += transaction.additionalFees
          totals.gst += transaction.gst
          totals.subscription += transaction.subscription
          totals.platform += transaction.platform
          return totals
        },
        {
          totalCost: 0,
          totalTransactions: 0,
          additionalFees: 0,
          gst: 0,
          subscription: 0,
          platform: 0
        }
      )
    }

    return acc
  }, {})
})

const totalStripeTransactions = computed(() => {
  const initialTotals = {
    totalCost: 0,
    totalTransactions: 0,
    additionalFees: 0,
    gst: 0,
    subscription: 0,
    platform: 0
  }

  return payments.value.reduce((totals, month) => {
    month.stripe.transactions.forEach((transaction) => {
      totals.totalCost += transaction.pro.totalCost + transaction.expert.totalCost || 0
      totals.totalTransactions += transaction.methodCustomers || 0
      totals.additionalFees +=
        transaction.pro.fees.additionalFees + transaction.expert.fees.additionalFees || 0
      totals.gst += transaction.pro.fees.gst + transaction.expert.fees.gst || 0
      totals.subscription +=
        transaction.pro.fees.subscription + transaction.expert.fees.subscription || 0
      totals.platform += transaction.pro.fees.platform + transaction.expert.fees.platform || 0
    })
    return totals
  }, initialTotals)
})

console.log('totalStripeTransactions', payments.value)

const razorpayPaymentTypes = ['Visa', 'MasterCard', 'UPI']

const razorpayTransactions = computed(() => {
  return razorpayPaymentTypes.reduce((acc, type) => {
    const transactions = payments.value.flatMap((month) =>
      month.razorpay.transactions.flatMap((transaction) =>
        transaction.paymentMethod === type
          ? [
              {
                totalCost: transaction.pro?.totalCost + transaction.expert?.totalCost || 0,
                totalTransactions: transaction.methodCustomers || 0,
                additionalFees:
                  transaction.pro?.fees?.additionalFees +
                    transaction.expert?.fees?.additionalFees || 0,
                gst: transaction.pro?.fees?.gst + transaction.expert?.fees?.gst || 0,
                subscription:
                  transaction.pro?.fees?.subscription + transaction.expert?.fees?.subscription || 0,
                platform: transaction.pro?.fees?.platform + transaction.expert?.fees?.platform || 0
              }
            ]
          : []
      )
    )

    // Calculate totals for each type and store them in the accumulator
    acc[type] = {
      transactions,
      totals: transactions.reduce(
        (totals, transaction) => {
          totals.totalCost += transaction.totalCost
          totals.totalTransactions += transaction.totalTransactions
          totals.additionalFees += transaction.additionalFees
          totals.gst += transaction.gst
          totals.subscription += transaction.subscription
          totals.platform += transaction.platform
          return totals
        },
        {
          totalCost: 0,
          totalTransactions: 0,
          additionalFees: 0,
          gst: 0,
          subscription: 0,
          platform: 0
        }
      )
    }

    return acc
  }, {})
})

console.log('razorpayTransactions', razorpayTransactions)

const totalRazorpayTransactions = computed(() => {
  const initialTotals = {
    totalCost: 0,
    totalTransactions: 0,
    additionalFees: 0,
    gst: 0,
    subscription: 0,
    platform: 0
  }

  return payments.value.reduce((totals, month) => {
    month.razorpay.transactions.forEach((transaction) => {
      totals.totalCost += transaction.pro.totalCost + transaction.expert.totalCost || 0
      totals.totalTransactions += transaction.methodCustomers || 0
      totals.additionalFees +=
        transaction.pro.fees.additionalFees + transaction.expert.fees.additionalFees || 0
      totals.gst += transaction.pro.fees.gst + transaction.expert.fees.gst || 0
      totals.subscription +=
        transaction.pro.fees.subscription + transaction.expert.fees.subscription || 0
      totals.platform += transaction.pro.fees.platform + transaction.expert.fees.platform || 0
    })
    return totals
  }, initialTotals)
})

const stripe = computed(() => {
  return payments.value.flatMap((month) => month.stripe)
})

const razorpay = computed(() => {
  return payments.value.flatMap((month) => month.razorpay)
})

const charts = computed(() => {
  if (!months.value.length) {
    return []
  }

  return [
    {
      title: 'Payment Fee Breakdown',
      subtitle:
        'Shows the breakdown of payment fee costs by provider for the selected time period.',
      type: 'bar',
      data: {
        labels: [
          'Stripe Platform Fees',
          'Stripe Subscription Fees',
          'Stripe Extra Fees',
          'Razorpay Platform Fees',
          'Razorpay Subscription Fees',
          'Razorpay Extra Fees'
        ],
        datasets: [
          {
            label: 'Total Fees',
            valueType: 'currency',
            data: [
              totalStripeTransactions.value.platform,
              totalStripeTransactions.value.subscription,
              totalStripeTransactions.value.additionalFees,
              totalRazorpayTransactions.value.platform,
              totalRazorpayTransactions.value.subscription,
              totalRazorpayTransactions.value.additionalFees
            ],
            backgroundColor: [
              rgba('lightGreen', 0.5),
              rgba('darkBlue', 0.5),
              rgba('lightBlue', 0.5),
              rgba('darkRed', 0.5),
              rgba('lightRed', 0.5),
              rgba('darkCyan', 0.5)
            ]
          }
        ]
      }
    },
    {
      title: 'Total Payment Costs by Provider',
      subtitle: 'Shows the total payment costs for Razorpay and Stripe over time.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Razorpay Total Transactions',
            type: 'line',
            valueType: 'number',
            data: razorpay.value.flatMap((month) => month.totalCustomers),
            borderColor: rgba('darkOrange', 0.8),
            backgroundColor: rgba('black', 1),
          },
          {
            label: 'Stripe Total Transactions',
            type: 'line',
            valueType: 'number',
            data: stripe.value.flatMap((month) => month.totalCustomers),
            borderColor: rgba('darkBlue', 0.8),
            backgroundColor: rgba('black', 1),

          },
          {
            label: 'Razorpay Total Cost',
            valueType: 'currency',
            data: razorpay.value.flatMap((month) => month.totalCost),
            backgroundColor: rgba('darkOrange', 0.3)
          },
          {
            label: 'Stripe Total Cost',
            valueType: 'currency',
            data: stripe.value.flatMap((month) => month.totalCost),
            backgroundColor: rgba('darkBlue', 0.3)
          }
        ]
      }
    },
    {
      title: 'Domestic Payment Costs - Razorpay Totals',
      subtitle: 'Shows the costs for different domestic payment methods over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Visa Cost',
            valueType: 'currency',
            data: razorpayTransactions.value.Visa.transactions.map((m) => m.totalCost),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('black', 1),
          },
          {
            label: 'MasterCard Cost',
            valueType: 'currency',
            data: razorpayTransactions.value.MasterCard.transactions.map((m) => m.totalCost),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('black', 1),
          },
          {
            label: 'UPI Cost',
            valueType: 'currency',
            data: razorpayTransactions.value.UPI.transactions.map((m) => m.totalCost),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('black', 1),
          },
          {
            label: 'Domestic Transactions',
            type: 'bar',
            valueType: 'number',
            data: razorpay.value.map((m) => m.totalCustomers),
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2)
          }
        ]
      }
    },
    {
      title: 'Razorpay UPI Fees',
      subtitle: 'Domestic payment fees for UPI transactions.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Total Transactions',
            type: 'line',
            valueType: 'number',
            data: razorpayTransactions.value.UPI.transactions.map((m) => m.totalTransactions),
            borderColor: rgba('darkGray', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Platform Fees',
            valueType: 'currency',
            data: razorpayTransactions.value.UPI.transactions.map((m) => m.platform),
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Subscription Fees',
            valueType: 'currency',
            data: razorpayTransactions.value.UPI.transactions.map((m) => m.subscription),
            backgroundColor: rgba('darkOrange', 0.5),
            stack: 'stack1'
          },
          {
            label: 'GST Fees',
            valueType: 'currency',
            data: razorpayTransactions.value.UPI.transactions.map((m) => m.gst),
            backgroundColor: rgba('darkPurple', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Extra Fees',
            valueType: 'currency',
            data: razorpayTransactions.value.UPI.transactions.map((m) => m.additionalFees),
            backgroundColor: rgba('darkBlue', 0.3),
            stack: 'stack1'
          }
        ]
      }
    },
    {
      title: 'Razorpay Visa Fees',
      subtitle: 'Domestic payment fees for Visa transactions.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Total Transactions',
            type: 'line',
            valueType: 'number',
            data: razorpayTransactions.value.Visa.transactions.map((m) => m.totalTransactions),
            borderColor: rgba('darkGray', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Platform Fees',
            valueType: 'currency',
            data: razorpayTransactions.value.Visa.transactions.map((m) => m.platform),
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Subscription Fees',
            valueType: 'currency',
            data: razorpayTransactions.value.Visa.transactions.map((m) => m.subscription),
            backgroundColor: rgba('darkOrange', 0.5),
            stack: 'stack1'
          },
          {
            label: 'GST Fees',
            valueType: 'currency',
            data: razorpayTransactions.value.Visa.transactions.map((m) => m.gst),
            backgroundColor: rgba('darkPurple', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Extra Fees',
            valueType: 'currency',
            data: razorpayTransactions.value.Visa.transactions.map((m) => m.additionalFees),
            backgroundColor: rgba('darkBlue', 0.3),
            stack: 'stack1'
          }
        ]
      }
    },
    {
      title: 'Razorpay MasterCard Fees',
      subtitle: 'International payment fees for MasterCard transactions.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Total Transactions',
            type: 'line',
            valueType: 'number',
            data: razorpayTransactions.value.MasterCard.transactions.flatMap(
              (m) => m.totalTransactions
            ),
            borderColor: rgba('darkGray', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Platform Fees',
            valueType: 'currency',
            data: razorpayTransactions.value.MasterCard.transactions.flatMap((m) => m.platform),
            backgroundColor: rgba('darkRed', 0.7)
          },
          {
            label: 'Subscription Fees',
            valueType: 'currency',
            data: razorpayTransactions.value.MasterCard.transactions.flatMap((m) => m.subscription),
            backgroundColor: rgba('darkOrange', 0.5),
            stack: 'stack1'
          },
          {
            label: 'GST Fees',
            valueType: 'currency',
            data: razorpayTransactions.value.MasterCard.transactions.flatMap((m) => m.gst),
            backgroundColor: rgba('darkPurple', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Extra Fees',
            valueType: 'currency',
            data: razorpayTransactions.value.Visa.transactions.flatMap((m) => m.additionalFees),
            backgroundColor: rgba('darkBlue', 0.3),
            stack: 'stack1'
          }
        ]
      }
    },
    {
      title: 'Stripe International Payments - Total Costs',
      subtitle: 'Shows the costs for different international payment methods over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'MasterCard/Visa Cost',
            valueType: 'currency',
            data: stripeTransactions.value.MasterCardVisa.transactions.map((m) => m.totalCost),
            backgroundColor: rgba('black', 1),
            borderColor: rgba('darkBlue', 0.6)
          },
          {
            label: 'American Express Cost',
            valueType: 'currency',
            data: stripeTransactions.value.AmericanExpress.transactions.map((m) => m.totalCost),
            backgroundColor: rgba('black', 1),
            borderColor: rgba('lightGreen', 0.5)
          },
          {
            label: 'International Card Cost',
            valueType: 'currency',
            data: stripeTransactions.value.InternationalCard.transactions.map((m) => m.totalCost),
            backgroundColor: rgba('black', 1),
            borderColor: rgba('lightRed', 0.5)
          },
          {
            label: 'International Transactions',
            type: 'bar',
            valueType: 'number',
            data: stripe.value.map((m) => m.totalCustomers),
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2)
          }
        ]
      }
    },
    {
      title: 'Stripe International Card Fees',
      subtitle:
        'International payment fees from all non Visa/MasterCard/AmericanExpress transactions.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Total Transactions',
            type: 'line',
            valueType: 'number',
            data: stripeTransactions.value.InternationalCard.transactions.flatMap(
              (m) => m.totalTransactions
            ),
            borderColor: rgba('darkGray', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Platform Fees',
            valueType: 'currency',
            data: stripeTransactions.value.InternationalCard.transactions.map(
              (cost) => cost.platform
            ),
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Subscription Fees',
            valueType: 'currency',
            data: stripeTransactions.value.InternationalCard.transactions.map(
              (cost) => cost.subscription
            ),
            backgroundColor: rgba('darkOrange', 0.5),
            stack: 'stack1'
          },
          {
            label: 'GST Fees',
            valueType: 'currency',
            data: stripeTransactions.value.InternationalCard.transactions.map((cost) => cost.gst),
            backgroundColor: rgba('darkPurple', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Extra Fees',
            valueType: 'currency',
            data: stripeTransactions.value.InternationalCard.transactions.map(
              (cost) => cost.additionalFees
            ),
            backgroundColor: rgba('darkBlue', 0.3),
            stack: 'stack1'
          }
        ]
      }
    },
    {
      title: 'Stripe MasterCard / Visa Fees',
      subtitle: 'International payment fees from all Visa MasterCard transactions.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Total Transactions',
            type: 'line',
            valueType: 'number',
            data: stripeTransactions.value.MasterCardVisa.transactions.flatMap(
              (m) => m.totalTransactions
            ),
            borderColor: rgba('darkGray', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Platform Fees',
            valueType: 'currency',
            data: stripeTransactions.value.MasterCardVisa.transactions.map((cost) => cost.platform),
            backgroundColor: rgba('darkRed', 0.7)
          },
          {
            label: 'Subscription Fees',
            valueType: 'currency',
            data: stripeTransactions.value.MasterCardVisa.transactions.map(
              (cost) => cost.subscription
            ),
            backgroundColor: rgba('darkOrange', 0.5),
            stack: 'stack1'
          },
          {
            label: 'GST Fees',
            valueType: 'currency',
            data: stripeTransactions.value.MasterCardVisa.transactions.map((cost) => cost.gst),
            backgroundColor: rgba('darkPurple', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Extra Fees',
            valueType: 'currency',
            data: stripeTransactions.value.MasterCardVisa.transactions.map(
              (cost) => cost.additionalFees
            ),
            backgroundColor: rgba('darkBlue', 0.3),
            stack: 'stack1'
          }
        ]
      }
    },
    {
      title: 'Stripe AmericanExpress Fees',
      subtitle: 'International payment fees for AmericanExpress transactions.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Total Transactions',
            type: 'line',
            valueType: 'number',
            data: stripeTransactions.value.AmericanExpress.transactions.flatMap(
              (m) => m.totalTransactions
            ),
            borderColor: rgba('darkGray', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Platform Fees',
            valueType: 'currency',
            data: stripeTransactions.value.AmericanExpress.transactions.map(
              (cost) => cost.platform
            ),
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Subscription Fees',
            valueType: 'currency',
            data: stripeTransactions.value.AmericanExpress.transactions.map(
              (cost) => cost.subscription
            ),
            backgroundColor: rgba('darkOrange', 0.5),
            stack: 'stack1'
          },
          {
            label: 'GST Fees',
            valueType: 'currency',
            data: stripeTransactions.value.AmericanExpress.transactions.map((cost) => cost.gst),
            backgroundColor: rgba('darkPurple', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Extra Fees',
            valueType: 'currency',
            data: stripeTransactions.value.AmericanExpress.transactions.map(
              (cost) => cost.additionalFees
            ),
            backgroundColor: rgba('darkBlue', 0.3),
            stack: 'stack1'
          }
        ]
      }
    }
  ]
})
</script>

<template>
  <AdminFinancialCharts :charts="charts" />
</template>

<style scoped></style>
