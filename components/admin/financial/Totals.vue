<script setup lang="ts">
const {
  months,
  capital,
  revenue,
  totals,
  advertising,
  affiliate,
  promotion,
  customers,
  chartRanges,
  formatINR,
  filteredData,
  toggleChartRange,
  rgba
} = useFinancials()

const charts = ref([] as any[])

watchEffect(() => {
  if (!capital.value.burnRate || !months.value.length) {
    charts.value = []
    return
  }
  charts.value = [
    {
      category: 'Totals',
      id: 0,
      title: 'Revenue Growth Over Time',
      subtitle:
        "Shows the increase in revenue, highlighting the business's financial health and growth potential.",
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[0]
        ).value,
        datasets: [
          {
            label: 'Burn Rate',
            type: 'line',
            yAxisID: 'y-axis-2',
            data: filteredData(capital.value.burnRate.values, chartRanges.value[0]).value,
            borderColor: rgba('darkOrange', 1),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Effective Revenue',
            data: filteredData(revenue.value.effective.values, chartRanges.value[0]).value,
            borderColor: rgba('lightGreen', 0.3),
            backgroundColor: rgba('darkGreen', 0.3)
          },
          {
            label: 'Expenses',
            data: filteredData(totals.value.monthlyINR.values, chartRanges.value[0]).value,
            borderColor: rgba('lightRed', 0.3),
            backgroundColor: rgba('darkRed', 0.3)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          },
          'y-axis-2': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Burn Rate'
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
      id: 1,
      title: 'Monthly Revenue Breakdown by Stream',
      subtitle:
        'Shows the diversity of revenue sources, highlighting multiple income streams which reduce financial risk.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[1]
        ).value,
        datasets: [
          {
            label: 'Advertising Revenue',
            yAxisID: 'y-axis-2',
            type: 'line',
            data: filteredData(advertising.value.total.values, chartRanges.value[1]).value,
            borderColor: rgba('darkCyan', 1),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Affiliate Revenue',
            yAxisID: 'y-axis-2',
            type: 'line',
            data: filteredData(affiliate.value.total.values, chartRanges.value[1]).value,
            borderColor: rgba('darkOrange', 0.8),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Promotion Revenue',
            yAxisID: 'y-axis-2',
            type: 'line',
            data: filteredData(promotion.value.total.values, chartRanges.value[1]).value,
            borderColor: rgba('darkYellow', 0.7),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Pro Subscription Revenue',
            stack: 'stack1',
            data: filteredData(customers.value.proRevenue.values, chartRanges.value[1]).value,
            backgroundColor: rgba('darkGreen', 0.5)
          },
          {
            label: 'Expert Subscription Revenue',
            stack: 'stack1',
            data: filteredData(customers.value.expertRevenue.values, chartRanges.value[1]).value,
            backgroundColor: rgba('darkBlue', 0.3)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            type: 'linear',
            title: {
              display: true,
              text: 'Subscription Income'
            }
          },
          'y-axis-2': {
            title: {
              display: true,
              text: 'Other Income'
            }
          }
        }
      }
    },
    {
      category: 'Totals',
      id: 2,
      title: 'Capital Balance and Burn Rate',
      subtitle:
        'Offers a comprehensive view of financial health by showing cash reserves against spending rates.',
      type: 'bar', // The type here can be 'bar' or 'line' as we specify types in the datasets
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[2]
        ).value,
        datasets: [
          {
            label: 'Capital Balance',
            data: filteredData(capital.value.balanceEnd.values, chartRanges.value[2]).value,
            type: 'line',
            yAxisID: 'y',
            borderColor: rgba('lightGreen', 1),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Burn Rate',
            data: filteredData(capital.value.burnRate.values, chartRanges.value[2]).value,
            type: 'bar',
            yAxisID: 'y-axis-2',
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('darkRed', 0.3)
          }
        ]
      },
      options: {
        scales: {
          y: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Capital Balance'
            },
            ticks: {
              callback: function (value) {
                return formatINR(value)
              }
            }
          },
          'y-axis-2': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Burn Rate'
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
      category: 'Totals',
      id: 3,
      title: 'Revenue and Expenses Forecast',
      subtitle:
        'Projects future financial performance, helping investors understand potential growth trajectories.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[3]
        ).value,
        datasets: [
          {
            label: revenue.value.effective.name,
            data: filteredData(revenue.value.effective.values, chartRanges.value[3]).value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: revenue.value.total.name,
            data: filteredData(revenue.value.total.values, chartRanges.value[3]).value,
            borderColor: rgba('lightPurple', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Total Expenses',
            data: filteredData(totals.value.monthlyINR.values, chartRanges.value[3]).value,
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: capital.value.balanceEnd.name,
            data: filteredData(capital.value.balanceEnd.values, chartRanges.value[3]).value,
            type: 'bar',
            backgroundColor: rgba('darkBlue', 0.3)
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
    }
  ]
})
</script>

<template>
  <AdminFinancialCharts :charts="charts" />
</template>

<style scoped></style>
