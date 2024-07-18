<script setup lang="ts">
const { months, payments, totals, metrics, chartRanges, filteredData, rgba } = useFinancials()

const charts = ref([] as any[])

watchEffect(() => {
  if (!metrics.value.profitLossMargin || !months.value.length) {
    charts.value = []
    return
  }

  charts.value = [
    {
      id: 0,
      title: 'Payments Costs Breakdown',
      subtitle: 'Shows the breakdown of payments costs between Stripe and Razorpay.',
      type: 'pie',
      data: {
        labels: ['Razorpay', 'Stripe'],
        datasets: [
          {
            label: ['Razorpay Fees', 'Stripe Fee'],
            data: [
              filteredData(
                payments.value.razorpayTotalCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                payments.value.stripeTotalCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0)
            ],
            hoverOffset: 40,
            backgroundColor: [rgba('darkOrange', 0.4), rgba('darkBlue', 0.4)],
            borderColor: rgba('black', 1),
            borderWidth: 8,
            borderRadius: 20
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: true
          }
        },
        grid: {
          display: false
        },
        scales: {
          x: {
            display: false
          },
          y: {
            display: false
          },
          'y-axis-2': {
            display: false
          }
        }
      }
    },
    {
      category: 'Payment Costs',
      id: 0,
      title: 'Total Payment Costs by Provider',
      subtitle: 'Shows the total payment costs for Razorpay and Stripe over time.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[0]
        ).value,
        datasets: [
          {
            label: 'Razorpay Total Transactions',
            type: 'line',
            yAxisID: 'y-axis-2',
            data: filteredData(
              payments.value.razorpayTotalTransactions.values,
              chartRanges.value[0]
            ).value,
            borderColor: rgba('darkOrange', 0.5)
          },
          {
            label: 'Stripe Total Transactions',
            type: 'line',
            yAxisID: 'y-axis-2',
            data: filteredData(payments.value.stripeTotalTransactions.values, chartRanges.value[0])
              .value,
            borderColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Razorpay Total Cost',
            data: filteredData(payments.value.razorpayTotalCost.values, chartRanges.value[0]).value,
            backgroundColor: rgba('darkOrange', 0.5)
          },
          {
            label: 'Stripe Total Cost',
            data: filteredData(payments.value.stripeTotalCost.values, chartRanges.value[0]).value,
            backgroundColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Combined Total Cost',
            data: filteredData(totals.value.paymentsCost.values, chartRanges.value[0]).value,
            backgroundColor: rgba('darkCyan', 0.5)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cost (INR)'
            }
          },
          'y-axis-2': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Transactions'
            }
          }
        }
      }
    },
    {
      id: 1,
      title: 'Total Transaction Costs by Provider',
      subtitle: 'Shows the annual payment costs for Razorpay and Stripe over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[1]
        ).value,
        datasets: [
          {
            label: 'Razorpay Avg Cost',
            data: filteredData(payments.value.razorpayAvgCost.values, chartRanges.value[1]).value,
            borderColor: rgba('darkPurple', 0.8)
          },
          {
            label: 'Stripe Avg Cost',
            data: filteredData(payments.value.stripeAvgCost.values, chartRanges.value[1]).value,
            borderColor: rgba('darkGreen', 0.8)
          },
          {
            label: 'Razorpay Total Transactions',
            type: 'bar',
            yAxisID: 'y-axis-2',
            data: filteredData(
              payments.value.razorpayTotalTransactions.values,
              chartRanges.value[1]
            ).value,
            backgroundColor: rgba('lightRed', 0.5)
          },
          {
            label: 'Stripe Total Transactions',
            type: 'bar',
            yAxisID: 'y-axis-2',
            data: filteredData(payments.value.stripeTotalTransactions.values, chartRanges.value[1])
              .value,
            backgroundColor: rgba('lightBlue', 0.5)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Avg. Cost'
            }
          },
          'y-axis-2': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Transactions'
            }
          }
        }
      }
    },
    {
      id: 2,
      title: 'Domestic Payment Method Costs - Razorpay',
      subtitle: 'Shows the costs for different domestic payment methods over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[2]
        ).value,
        datasets: [
          {
            label: 'Visa Cost',
            data: filteredData(
              payments.value.domesticVisa.values.flatMap((month) => month.totalCost),
              chartRanges.value[2]
            ).value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2)
          },
          {
            label: 'MasterCard Cost',
            data: filteredData(
              payments.value.domesticMasterCard.values.flatMap((month) => month.totalCost),
              chartRanges.value[2]
            ).value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2)
          },
          {
            label: 'UPI Cost',
            data: filteredData(
              payments.value.domesticUPI.values.flatMap((month) => month.totalCost),
              chartRanges.value[2]
            ).value,
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
          },
          {
            label: 'Domestic Transactions',
            type: 'bar',
            yAxisID: 'y-axis-2',
            data: filteredData(
              payments.value.razorpayTotalTransactions.values,
              chartRanges.value[2]
            ).value,
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cost (INR)'
            }
          },
          'y-axis-2': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Transactions'
            }
          }
        }
      }
    },
    {
      id: 3,
      title: 'Razorpay UPI Fees',
      subtitle: 'Domestic payment fees for UPI transactions.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[3]
        ).value,
        datasets: [
          {
            label: 'Total Transactions',
            type: 'line',
            yAxisID: 'y-axis-2',
            data: filteredData(
              payments.value.domesticUPI.values.flatMap((cost) => cost.totalTransactions),
              chartRanges.value[3]
            ).value,
            borderColor: rgba('darkGray', 0.5)
          },
          {
            label: 'Base Fees',
            data: filteredData(
              payments.value.domesticUPI.values.flatMap((cost) => cost.base),
              chartRanges.value[3]
            ).value,
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Subscription Fees',
            data: filteredData(
              payments.value.domesticUPI.values.flatMap((cost) => cost.subscription),
              chartRanges.value[3]
            ).value,
            backgroundColor: rgba('darkOrange', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Gst Fees',
            data: filteredData(
              payments.value.domesticUPI.values.flatMap((cost) => cost.gst),
              chartRanges.value[3]
            ).value,
            backgroundColor: rgba('darkPurple', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Extra Fees',
            data: filteredData(
              payments.value.domesticUPI.values.flatMap((cost) => cost.additionalFees),
              chartRanges.value[3]
            ).value,
            backgroundColor: rgba('darkBlue', 0.3),
            stack: 'stack1'
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cost (INR)'
            }
          },
          'y-axis-2': {
            display: true,
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Transactions'
            }
          }
        }
      }
    },
    {
      id: 4,
      title: 'Razorpay Visa Fees',
      subtitle: 'Domestic payment fees for Visa transactions.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[4]
        ).value,
        datasets: [
          {
            label: 'Total Transactions',
            type: 'line',
            yAxisID: 'y-axis-2',
            data: filteredData(
              payments.value.domesticVisa.values.flatMap((cost) => cost.totalTransactions),
              chartRanges.value[4]
            ).value,
            borderColor: rgba('darkGray', 0.5)
          },
          {
            label: 'Base Fees',
            data: filteredData(
              payments.value.domesticVisa.values.flatMap((cost) => cost.base),
              chartRanges.value[4]
            ).value,
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Subscription Fees',
            data: filteredData(
              payments.value.domesticVisa.values.flatMap((cost) => cost.subscription),
              chartRanges.value[4]
            ).value,
            backgroundColor: rgba('darkOrange', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Gst Fees',
            data: filteredData(
              payments.value.domesticVisa.values.flatMap((cost) => cost.gst),
              chartRanges.value[4]
            ).value,
            backgroundColor: rgba('darkPurple', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Extra Fees',
            data: filteredData(
              payments.value.domesticVisa.values.flatMap((cost) => cost.additionalFees),
              chartRanges.value[4]
            ).value,
            backgroundColor: rgba('darkBlue', 0.3),
            stack: 'stack1'
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cost (INR)'
            }
          },
          'y-axis-2': {
            display: true,
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Transactions'
            }
          }
        }
      }
    },
    {
      id: 5,
      title: 'Razorpay MasterCard Fees',
      subtitle: 'International payment fees for MasterCard transactions.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[5]
        ).value,
        datasets: [
          {
            label: 'Total Transactions',
            type: 'line',
            yAxisID: 'y-axis-2',
            data: filteredData(
              payments.value.domesticMasterCard.values.flatMap((cost) => cost.totalTransactions),
              chartRanges.value[5]
            ).value,
            borderColor: rgba('darkGray', 0.5)
          },
          {
            label: 'Base Fees',
            data: filteredData(
              payments.value.domesticMasterCard.values.flatMap((cost) => cost.base),
              chartRanges.value[5]
            ).value,
            backgroundColor: rgba('darkRed', 0.7)
          },
          {
            label: 'Subscription Fees',
            data: filteredData(
              payments.value.domesticMasterCard.values.flatMap((cost) => cost.subscription),
              chartRanges.value[5]
            ).value,
            backgroundColor: rgba('darkOrange', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Gst Fees',
            data: filteredData(
              payments.value.domesticMasterCard.values.flatMap((cost) => cost.gst),
              chartRanges.value[5]
            ).value,
            backgroundColor: rgba('darkPurple', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Extra Fees',
            data: filteredData(
              payments.value.domesticMasterCard.values.flatMap((cost) => cost.additionalFees),
              chartRanges.value[5]
            ).value,
            backgroundColor: rgba('darkBlue', 0.3),
            stack: 'stack1'
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cost (INR)'
            }
          },
          'y-axis-2': {
            display: true,
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Transactions'
            }
          }
        }
      }
    },
    {
      id: 6,
      title: 'Stripe International Payments - Total Costs',
      subtitle: 'Shows the costs for different international payment methods over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[6]
        ).value,
        datasets: [
          {
            label: 'MasterCard/Visa Cost',
            data: filteredData(
              payments.value.internationalMasterCardVisa.values.flatMap((cost) => cost.totalCost),
              chartRanges.value[6]
            ).value,
            backgroundColor: rgba('darkBlue', 0.5),
            borderColor: rgba('lightBlue', 0.5)
          },
          {
            label: 'American Express Cost',
            data: filteredData(
              payments.value.internationalAmericanExpress.values.flatMap((cost) => cost.totalCost),
              chartRanges.value[6]
            ).value,
            backgroundColor: rgba('darkGreen', 0.5),
            borderColor: rgba('lightGreen', 0.5)
          },
          {
            label: 'International Card Cost',
            data: filteredData(
              payments.value.internationalCard.values.flatMap((cost) => cost.totalCost),
              chartRanges.value[6]
            ).value,
            backgroundColor: rgba('darkRed', 0.5),
            borderColor: rgba('lightRed', 0.5)
          },
          {
            label: 'International Transactions',
            type: 'bar',
            yAxisID: 'y-axis-2',
            data: filteredData(payments.value.stripeTotalTransactions.values, chartRanges.value[6])
              .value,
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cost (INR)'
            }
          },
          'y-axis-2': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Transactions'
            }
          }
        }
      }
    },
    {
      id: 7,
      title: 'Stripe International Card Fees',
      subtitle:
        'International payment fees from all non Visa/MasterCard/AmericanExpress transactions.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[7]
        ).value,
        datasets: [
          {
            label: 'Total Transactions',
            type: 'line',
            yAxisID: 'y-axis-2',
            data: filteredData(
              payments.value.internationalCard.values.flatMap((cost) => cost.totalTransactions),
              chartRanges.value[7]
            ).value,
            borderColor: rgba('darkGray', 0.5)
          },
          {
            label: 'Base Fees',
            data: filteredData(
              payments.value.internationalCard.values.flatMap((cost) => cost.base),
              chartRanges.value[7]
            ).value,
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Subscription Fees',
            data: filteredData(
              payments.value.internationalCard.values.flatMap((cost) => cost.subscription),
              chartRanges.value[7]
            ).value,
            backgroundColor: rgba('darkOrange', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Gst Fees',
            data: filteredData(
              payments.value.internationalCard.values.flatMap((cost) => cost.gst),
              chartRanges.value[7]
            ).value,
            backgroundColor: rgba('darkPurple', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Extra Fees',
            data: filteredData(
              payments.value.internationalCard.values.flatMap((cost) => cost.additionalFees),
              chartRanges.value[7]
            ).value,
            backgroundColor: rgba('darkBlue', 0.3),
            stack: 'stack1'
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cost (INR)'
            }
          },
          'y-axis-2': {
            display: true,
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Transactions'
            }
          }
        }
      }
    },
    {
      id: 8,
      title: 'Stripe MasterCard / Visa Fees',
      subtitle: 'International payment fees from all Visa MasterCard transactions.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[8]
        ).value,
        datasets: [
          {
            label: 'Total Transactions',
            type: 'line',
            yAxisID: 'y-axis-2',
            data: filteredData(
              payments.value.internationalMasterCardVisa.values.flatMap(
                (cost) => cost.totalTransactions
              ),
              chartRanges.value[8]
            ).value,
            borderColor: rgba('darkGray', 0.5)
          },
          {
            label: 'Base Fees',
            data: filteredData(
              payments.value.internationalMasterCardVisa.values.flatMap((cost) => cost.base),
              chartRanges.value[8]
            ).value,
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Subscription Fees',
            data: filteredData(
              payments.value.internationalMasterCardVisa.values.flatMap(
                (cost) => cost.subscription
              ),
              chartRanges.value[8]
            ).value,
            backgroundColor: rgba('darkOrange', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Gst Fees',
            data: filteredData(
              payments.value.internationalMasterCardVisa.values.flatMap((cost) => cost.gst),
              chartRanges.value[8]
            ).value,
            backgroundColor: rgba('darkPurple', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Extra Fees',
            data: filteredData(
              payments.value.internationalMasterCardVisa.values.flatMap(
                (cost) => cost.additionalFees
              ),
              chartRanges.value[8]
            ).value,
            backgroundColor: rgba('darkBlue', 0.3),
            stack: 'stack1'
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cost (INR)'
            }
          },
          'y-axis-2': {
            display: true,
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Transactions'
            }
          }
        }
      }
    },
    {
      id: 9,
      title: 'Stripe AmericanExpress Fees',
      subtitle: 'International payment fees for AmericanExpress transactions.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[9]
        ).value,
        datasets: [
          {
            label: 'Total Transactions',
            type: 'line',
            yAxisID: 'y-axis-2',
            data: filteredData(
              payments.value.internationalAmericanExpress.values.flatMap(
                (cost) => cost.totalTransactions
              ),
              chartRanges.value[9]
            ).value,
            borderColor: rgba('darkGray', 0.5)
          },
          {
            label: 'Base Fees',
            data: filteredData(
              payments.value.internationalAmericanExpress.values.flatMap((cost) => cost.base),
              chartRanges.value[9]
            ).value,
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Subscription Fees',
            data: filteredData(
              payments.value.internationalAmericanExpress.values.flatMap(
                (cost) => cost.subscription
              ),
              chartRanges.value[9]
            ).value,
            backgroundColor: rgba('darkOrange', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Gst Fees',
            data: filteredData(
              payments.value.internationalAmericanExpress.values.flatMap((cost) => cost.gst),
              chartRanges.value[9]
            ).value,
            backgroundColor: rgba('darkPurple', 0.5),
            stack: 'stack1'
          },
          {
            label: 'Extra Fees',
            data: filteredData(
              payments.value.internationalAmericanExpress.values.flatMap(
                (cost) => cost.additionalFees
              ),
              chartRanges.value[9]
            ).value,
            backgroundColor: rgba('darkBlue', 0.3),
            stack: 'stack1'
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cost (INR)'
            }
          },
          'y-axis-2': {
            display: true,
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Transactions'
            }
          }
        }
      }
    }
  ]
})
</script>

<template>
  <AdminFinancialCharts :charts="charts" />
</template>

<style scoped></style>
