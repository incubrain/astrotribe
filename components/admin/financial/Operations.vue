<script setup lang="ts">
const {
  months,
  metrics,
  capital,
  customers,
  chartRanges,
  formatINR,
  filteredData,
  toggleChartRange,
  rgba
} = useFinancials()

const charts = ref([] as any[])

watchEffect(() => {
  if (!metrics.value.profitLossMargin || !months.value.length) {
    charts.value = []
    return
  }

  charts.value = [
    {
      category: 'Operations',
      id: 0,
      title: 'Balance Over Time',
      subtitle:
        "Shows the company's financial health and sustainability, indicating the ability to cover expenses.",
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[0]
        ).value,
        datasets: [
          {
            label: 'PL Margin',
            type: 'line',
            yAxisID: 'y-axis-2',
            data: filteredData(metrics.value.profitLossMargin.values, chartRanges.value[0]).value,
            borderColor: rgba('lightOrange', 0.5),
            backgroundColor: rgba('lightOrange', 0.5)
          },
          {
            label: 'Burn Rate',
            data: filteredData(capital.value.burnRate.values, chartRanges.value[0]).value,
            borderColor: rgba('darkRed', 0.5),
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Balance End',
            data: filteredData(capital.value.balanceEnd.values, chartRanges.value[0]).value,
            borderColor: rgba('darkGreen', 0.5),
            backgroundColor: rgba('darkGreen', 0.5)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Burn & Balance'
            }
          },
          'y-axis-2': {
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Runway'
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
      category: 'Operations',
      id: 1,
      title: 'Runway Over Time',
      subtitle:
        'Indicates how many months the company can continue to operate before needing additional funding, showcasing financial management.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[1]
        ).value,
        datasets: [
          {
            label: 'Runway',
            data: filteredData(capital.value.runway.values, chartRanges.value[1]).value,
            borderColor: rgba('lightOrange', 0.5),
            backgroundColor: rgba('lightOrange', 0.5)
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
      category: 'Operations',
      id: 2,
      title: 'Subscription Revenue by Plan',
      subtitle:
        'Breaks down subscription revenue by different plans, highlighting the most profitable segments.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[2]
        ).value,
        datasets: [
          // {
          //   label: customers.value.totalCount.name,
          //   type: 'line',
          //   yAxisID: 'y-axis-2',
          //   data: filteredData(customers.value.totalCount.values, chartRanges.value[2]).value,
          //   borderColor: rgba('lightPurple', 0.5)
          // },
          {
            label: customers.value.totalConversion.name,
            type: 'line',
            yAxisID: 'y-axis-2',
            data: filteredData(customers.value.totalConversion.values, chartRanges.value[2]).value,
            borderColor: rgba('lightPurple', 0.5)
          },
          {
            label: 'Pro Users Revenue',
            data: filteredData(customers.value.proRevenue.values, chartRanges.value[2]).value,
            backgroundColor: rgba('lightGreen', 0.5)
          },
          {
            label: 'Expert Users Revenue',
            data: filteredData(customers.value.expertRevenue.values, chartRanges.value[2]).value,
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
              text: 'Revenue'
            }
          },
          'y-axis-2': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total Customers'
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
    }
  ]
})
</script>

<template>
  <AdminFinancialCharts :charts="charts" />
</template>

<style scoped></style>
