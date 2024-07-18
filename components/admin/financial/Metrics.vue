<script setup lang="ts">
const { months, metrics, chartRanges, formatINR, filteredData, toggleChartRange, rgba } =
  useFinancials()

const charts = ref([] as any[])

watchEffect(() => {
  if (!metrics.value.monthlyRecurringRevenue || !months.value.length) {
    charts.value = []
    return
  }

  charts.value = [
    {
      category: 'Metrics',
      id: 0,
      title: 'Monthly Recurring Revenue (MRR) and Annual Recurring Revenue (ARR) Trends',
      subtitle:
        'Highlights the predictability and stability of revenue, crucial for long-term financial planning.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[0]
        ).value,
        datasets: [
          {
            label: 'MRR',
            data: filteredData(metrics.value.monthlyRecurringRevenue.values, chartRanges.value[0])
              .value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('darkGreen', 0.5)
          },
          {
            label: 'ARR',
            data: filteredData(metrics.value.annualRecurringRevenue.values, chartRanges.value[0])
              .value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('darkBlue', 0.5)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    },
    {
      category: 'Metrics',
      id: 1,
      title: 'Gross Margin and Profit/Loss Margin',
      subtitle:
        'Demonstrates profitability and operational efficiency, key metrics for evaluating business viability.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[1]
        ).value,
        datasets: [
          {
            label: 'Gross Margin',
            yAxisID: 'y-axis-2',
            data: filteredData(metrics.value.grossMargin.values, chartRanges.value[1]).value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('darkGreen', 0.2)
          },
          {
            label: 'Profit/Loss Margin',
            data: filteredData(metrics.value.profitLossMargin.values, chartRanges.value[1]).value,
            borderColor: rgba('darkRed', 0.5),
            backgroundColor: rgba('darkRed', 0.2)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Profit/Loss Margin'
            }
          },
          'y-axis-2': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Gross Margin'
            },
            ticks: {
              callback: function (value) {
                return formatINR(value)
              }
            },
            grid: {
              drawOnChartArea: false // only want the grid lines for one axis to show up
            }
          }
        }
      }
    },
    {
      category: 'Metrics',
      id: 2,
      title: 'Cost Per User',
      subtitle:
        'Measures the effectiveness of marketing expenditures in driving revenue, essential for optimizing marketing strategies.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[2]
        ).value,
        datasets: [
          {
            label: 'Cost Per Free User',
            data: filteredData(metrics.value.costPerFreeUser.values, chartRanges.value[2]).value,
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Cost Per Pro User',
            data: filteredData(metrics.value.costPerProUser.values, chartRanges.value[2]).value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Cost Per Expert User',
            data: filteredData(metrics.value.costPerExpertUser.values, chartRanges.value[2]).value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('darkGreen', 0.5)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    },
    {
      category: 'Metrics',
      id: 3,
      title: 'Churn Rate and Retention Rate',
      subtitle:
        'Provides insights into customer loyalty and satisfaction, critical for long-term growth.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[3]
        ).value,
        datasets: [
          {
            label: 'Customer Lifespan',
            yAxisID: 'y-axis-2',
            type: 'line',
            data: filteredData(metrics.value.customerLifespan.values, chartRanges.value[4]).value,
            borderColor: rgba('lightPink', 1),
            backgroundColor: rgba('black', 1)
          },
          {
            label: metrics.value.mauLifespanMonths.name,
            yAxisID: 'y-axis-2',
            type: 'line',
            data: filteredData(metrics.value.mauLifespanMonths.values, chartRanges.value[4]).value,
            borderColor: rgba('lightGray', 1),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'MAU Churn',
            data: filteredData(metrics.value.mauChurnRate.values, chartRanges.value[3]).value,
            backgroundColor: rgba('darkOrange', 0.5)
          },
          {
            label: 'Customer Churn',
            data: filteredData(metrics.value.customerChurnRate.values, chartRanges.value[3]).value,
            backgroundColor: rgba('darkRed', 0.5)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Percentage'
            }
          }
        },
        'y-axis-2': {
          type: 'linear',
          position: 'right',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Months'
          },
          grid: {
            drawOnChartArea: false // only want the grid lines for one axis to show up
          }
        }
      }
    },
    {
      category: 'Metrics',
      id: 4,
      title: 'Customer Lifetime Value (LTV) vs. Customer Acquisition Cost (CAC)',
      subtitle:
        'Shows the return on investment in acquiring customers, indicating business sustainability.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[4]
        ).value,
        datasets: [
          {
            label: 'Customer Lifespan',
            yAxisID: 'y-axis-2',
            type: 'line',
            data: filteredData(metrics.value.customerLifespan.values, chartRanges.value[4]).value,
            borderColor: rgba('lightPink', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'LTV',
            data: filteredData(metrics.value.customerLifetimeValue.values, chartRanges.value[4])
              .value,
            backgroundColor: rgba('lightGreen', 0.5)
          },
          {
            label: 'CAC',
            data: filteredData(metrics.value.customerAcquisitionCost.values, chartRanges.value[4])
              .value,
            backgroundColor: rgba('lightRed', 0.5)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Value'
            }
          },
          'y-axis-2': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Months'
            },
            grid: {
              drawOnChartArea: false // only want the grid lines for one axis to show up
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
