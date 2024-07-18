<script setup lang="ts">
const {
  months,
  mau,
  customers,
  employees,
  metrics,
  chartRanges,
  formatINR,
  filteredData,
  toggleChartRange,
  rgba
} = useFinancials()

const charts = ref([] as any[])

watchEffect(() => {
  if (!mau.value.total || !months.value.length) {
    charts.value = []
    return
  }

  charts.value = [
    {
      category: 'Growth',
      id: 0,
      title: 'MAU vs Customers',
      subtitle: 'Demonstrates monthly active user acquisition and employee count over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[0]
        ).value,
        datasets: [
          {
            label: 'MAU',
            data: filteredData(mau.value.total.values, chartRanges.value[0]).value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('darkGreen', 0.5)
          },
          {
            label: 'Customers',
            type: 'bar',
            yAxisID: 'y-axis-2',
            data: filteredData(customers.value.totalCount.values, chartRanges.value[0]).value,
            borderColor: rgba('lightCyan', 0.5),
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
              text: 'Users'
            }
          },
          'y-axis-2': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Customers'
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
    // {
    //   category: 'Growth',
    //   id: 1,
    //   title: 'Cost Efficiency Metrics',
    //   subtitle:
    //     'Compares various cost efficiency metrics, providing a multi-dimensional view of operational efficiency.',
    //   type: 'radar',
    //   data: {
    //     labels: [
    //       'Employee Efficiency',
    //       'Office Cost Efficiency',
    //       'DevOps Cost Efficiency',
    //       'Storage Cost Efficiency'
    //     ],
    //     datasets: [
    //       {
    //         label: 'Efficiency Metrics',
    //         data: [
    //           employees.value.totalCost.values.reduce((a, b) => a + b, 0) /
    //             employees.value.totalCount.values.reduce((a, b) => a + b, 0),
    //           office.totalCost.values.reduce((a, b) => a + b, 0),
    //           devOpsVercel.totalCost.values.reduce((a, b) => a + b, 0),
    //           storage.totalCost.values.reduce((a, b) => a + b, 0)
    //         ],
    //         backgroundColor: rgba('darkBlue', 0.5),
    //         borderColor: rgba('lightBlue', 1), // Adjust border color to make it more visible
    //         pointBackgroundColor: rgba('darkBlue', 1), // Point color for better visibility
    //         pointBorderColor: '#fff' // White border for points
    //       }
    //     ]
    //   },
    //   options: {
    //     scales: {
    //       r: {
    //         angleLines: {
    //           display: true
    //         },
    //         suggestedMin: 0,
    //         suggestedMax: 100 // Adjust this based on the expected range of your data
    //       }
    //     }
    //   }
    // },
    {
      category: 'Growth',
      id: 2,
      title: 'Monthly vs. Annual Subscription Growth',
      subtitle:
        'Differentiates between short-term and long-term revenue streams, showcasing subscription stability.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[2]
        ).value,
        datasets: [
          {
            label: 'Monthly Subscription Revenue',
            data: filteredData(customers.value.totalRevenue.values, chartRanges.value[2]).value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('darkGreen', 0.5)
          },
          {
            label: 'Annual Subscription Revenue',
            data: filteredData(metrics.value.annualRecurringRevenue.values, chartRanges.value[2])
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
      id: 3,
      title: 'User Acquisition / Churn vs Employees',
      subtitle:
        'Tracks new, existing, and churned monthly active users, offering insights into user retention and acquisition strategies.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[1]
        ).value,
        datasets: [
          {
            label: mau.value.new.name,
            data: filteredData(mau.value.new.values, chartRanges.value[3]).value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('darkGreen', 0.5)
          },
          {
            label: mau.value.existing.name,
            data: filteredData(mau.value.existing.values, chartRanges.value[3]).value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('darkBlue', 0.5)
          },
          {
            label: mau.value.churned.name,
            data: filteredData(mau.value.churned.values, chartRanges.value[3]).value,
            borderColor: rgba('darkRed', 0.5),
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Employees',
            yAxisID: 'y-axis-2',
            type: 'bar',
            data: filteredData(employees.value.totalCount.values, chartRanges.value[3]).value,
            borderColor: rgba('darkPurple', 0.3),
            backgroundColor: rgba('darkPurple', 0.3)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Users'
            }
          },
          'y-axis-2': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Employee Count'
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
