<script setup lang="ts">
const {
  expenses,
  growth,
  metrics,
  info,
  months,
  stages,
  chartRanges,
  formatINR,
  filteredData,
  toggleChartRange,
  rgba
} = useFinancials()

const charts = computed(() => [
  {
    category: 'Totals',
    id: 0,
    title: 'Revenue Growth Over Time',
    subtitle:
      "Shows the increase in revenue, highlighting the business's financial health and growth potential.",
    type: 'bar',
    data: {
      labels: filteredData(
        months.map((month) => `M${month}`),
        chartRanges.value[0]
      ).value,
      datasets: [
        {
          label: 'Burn Rate',
          type: 'line',
          yAxisID: 'y-axis-2',
          data: filteredData(growth.capital.value.burnRate.values, chartRanges.value[0]).value,
          borderColor: rgba('darkOrange', 1),
          backgroundColor: rgba('darkOrange', 1)
        },
        {
          label: 'Effective Revenue',
          data: filteredData(growth.revenue.value.effective.values, chartRanges.value[0]).value,
          borderColor: rgba('lightGreen', 0.3),
          backgroundColor: rgba('darkGreen', 0.3)
        },
        {
          label: 'Expenses',
          data: filteredData(expenses.totals.value.monthlyINR.values, chartRanges.value[0]).value,
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
    category: 'Totals',
    id: 1,
    title: 'Revenue Breakdown by Stream',
    subtitle:
      'Shows the diversity of revenue sources, highlighting multiple income streams which reduce financial risk.',
    type: 'bar',
    data: {
      labels: filteredData(
        months.map((month) => `M${month}`),
        chartRanges.value[1]
      ).value,
      datasets: [
        {
          label: 'Pro Subscription Revenue',
          data: filteredData(growth.customers.value.proRevenue.values, chartRanges.value[1])
            .value,
          backgroundColor: rgba('lightYellow', 0.5)
        },
        {
          label: 'Expert Subscription Revenue',
          data: filteredData(growth.customers.value.expertRevenue.values, chartRanges.value[1])
            .value,
          backgroundColor: rgba('lightGreen', 0.5)
        },
        {
          label: 'Advertising Revenue',
          data: filteredData(growth.advertising.value.total.values, chartRanges.value[1]).value,
          backgroundColor: rgba('lightBlue', 0.5)
        },
        {
          label: 'Affiliate Revenue',
          data: filteredData(growth.affiliate.value.total.values, chartRanges.value[1]).value,
          backgroundColor: rgba('darkRed', 0.5)
        },
        {
          label: 'Promotion Revenue',
          data: filteredData(growth.promotion.value.total.values, chartRanges.value[1]).value,
          backgroundColor: rgba('lightOrange', 0.5)
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          type: 'logarithmic'
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
        months.map((month) => `M${month}`),
        chartRanges.value[2]
      ).value,
      datasets: [
        {
          label: 'Capital Balance',
          data: filteredData(growth.capital.value.balanceEnd.values, chartRanges.value[2]).value,
          type: 'line',
          yAxisID: 'y',
          borderColor: rgba('lightGreen', 1),
          backgroundColor: rgba('darkGreen', 0.7)
        },
        {
          label: 'Burn Rate',
          data: filteredData(growth.capital.value.burnRate.values, chartRanges.value[2]).value,
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
        months.map((month) => `M${month}`),
        chartRanges.value[3]
      ).value,
      datasets: [
        {
          label: growth.revenue.value.effective.name,
          data: filteredData(growth.revenue.value.effective.values, chartRanges.value[3]).value,
          borderColor: rgba('lightGreen', 0.5),
          backgroundColor: rgba('darkGreen', 0.5)
        },
        {
          label: growth.revenue.value.total.name,
          data: filteredData(growth.revenue.value.total.values, chartRanges.value[3]).value,
          borderColor: rgba('lightPurple', 0.5),
          backgroundColor: rgba('darkPurple', 0.5)
        },
        {
          label: 'Total Expenses',
          data: filteredData(expenses.totals.value.monthlyINR.values, chartRanges.value[3]).value,
          borderColor: rgba('lightRed', 0.5),
          backgroundColor: rgba('darkRed', 0.5)
        },
        {
          label: growth.capital.value.balanceEnd.name,
          data: filteredData(growth.capital.value.balanceEnd.values, chartRanges.value[3]).value,
          type: 'bar',
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
  }
])

// const charts = computed(() => [
//   {
//     id: 0,
//     title: 'MAU vs Customers',
//     subtitle: 'Demonstrates monthly active user acquisition and employee count over time.',
//     type: 'line',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[0]
//       ).value,
//       datasets: [
//         {
//           label: 'MAU',
//           data: filteredData(growth.mau.value.total.values, chartRanges.value[0]).value,
//           borderColor: rgba('lightGreen', 0.5),
//           backgroundColor: rgba('darkGreen', 0.5)
//         },
//         {
//           label: 'Customers',
//           type: 'bar',
//           yAxisID: 'y-axis-2',
//           data: filteredData(growth.customers.value.totalCount.values, chartRanges.value[0]).value,
//           borderColor: rgba('lightCyan', 0.5),
//           backgroundColor: rgba('darkCyan', 0.5)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Users'
//           }
//         },
//         'y-axis-2': {
//           type: 'linear',
//           position: 'right',
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Customers'
//           },
//           ticks: {
//             callback: function (value) {
//               return formatINR(value)
//             }
//           },
//           grid: {
//             drawOnChartArea: false // only want the grid lines for one axis to show up
//           }
//         }
//       }
//     }
//   },
//   {
//     id: 1,
//     title: 'Revenue Growth Over Time',
//     subtitle:
//       "Shows the increase in revenue, highlighting the business's financial health and growth potential.",
//     type: 'bar',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[1]
//       ).value,
//       datasets: [
//         {
//           label: 'Burn Rate',
//           type: 'line',
//           yAxisID: 'y-axis-2',
//           data: filteredData(growth.capital.value.burnRate.values, chartRanges.value[1]).value,
//           borderColor: rgba('darkOrange', 1),
//           backgroundColor: rgba('darkOrange', 1)
//         },
//         {
//           label: 'Effective Revenue',
//           data: filteredData(growth.revenue.value.effective.values, chartRanges.value[1]).value,
//           borderColor: rgba('lightGreen', 0.3),
//           backgroundColor: rgba('darkGreen', 0.3)
//         },
//         {
//           label: 'Expenses',
//           data: filteredData(expenses.totals.value.monthlyINR.values, chartRanges.value[1]).value,
//           borderColor: rgba('lightRed', 0.3),
//           backgroundColor: rgba('darkRed', 0.3)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         },
//         'y-axis-2': {
//           type: 'linear',
//           position: 'right',
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Burn Rate'
//           },
//           ticks: {
//             callback: function (value) {
//               return formatINR(value)
//             }
//           },
//           grid: {
//             drawOnChartArea: false // only want the grid lines for one axis to show up
//           }
//         }
//       }
//     }
//   },
//   {
//     id: 2,
//     title: 'Balance Over Time',
//     subtitle:
//       "Shows the company's financial health and sustainability, indicating the ability to cover expenses.",
//     type: 'bar',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[2]
//       ).value,
//       datasets: [
//         {
//           label: 'Runway',
//           type: 'line',
//           yAxisID: 'y-axis-2',
//           data: filteredData(growth.capital.value.runway.values, chartRanges.value[4]).value,
//           borderColor: rgba('lightOrange', 0.5),
//           backgroundColor: rgba('lightOrange', 0.5)
//         },
//         {
//           label: 'Burn Rate',
//           data: filteredData(growth.capital.value.burnRate.values, chartRanges.value[2]).value,
//           borderColor: rgba('darkRed', 0.5),
//           backgroundColor: rgba('darkRed', 0.5)
//         },
//         {
//           label: 'Balance Before',
//           data: filteredData(growth.capital.value.balanceStart.values, chartRanges.value[2]).value,
//           borderColor: rgba('darkGreen', 0.5),
//           backgroundColor: rgba('darkGreen', 0.5)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Burn & Balance'
//           }
//         },
//         'y-axis-2': {
//           type: 'linear',
//           position: 'right',
//           title: {
//             display: true,
//             text: 'Runway'
//           },
//           ticks: {
//             callback: function (value) {
//               return formatINR(value)
//             }
//           },
//           grid: {
//             drawOnChartArea: false // only want the grid lines for one axis to show up
//           }
//         }
//       }
//     }
//   },
//   {
//     id: 3,
//     title: 'Burn Rate Over Time',
//     subtitle:
//       'Illustrates the monthly cash outflow, helping investors understand the company’s cost structure and sustainability.',
//     type: 'line',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[3]
//       ).value,
//       datasets: [
//         {
//           label: 'Burn Rate',
//           data: filteredData(growth.capital.value.burnRate.values, chartRanges.value[3]).value,
//           borderColor: rgba('lightRed', 0.5),
//           backgroundColor: rgba('darkRed', 0.2),
//           fill: true
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   },
//   {
//     id: 4,
//     title: 'Runway Over Time',
//     subtitle:
//       'Indicates how many months the company can continue to operate before needing additional funding, showcasing financial management.',
//     type: 'line',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[4]
//       ).value,
//       datasets: [
//         {
//           label: 'Runway',
//           data: filteredData(growth.capital.value.runway.values, chartRanges.value[4]).value,
//           borderColor: rgba('lightOrange', 0.5),
//           backgroundColor: rgba('lightOrange', 0.5)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   },
//   {
//     id: 5,
//     title: 'Monthly Expenses Breakdown',
//     subtitle:
//       'Provides transparency on how funds are being allocated, reassuring investors about cost management and spending efficiency.',
//     type: 'bar',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[5]
//       ).value,
//       datasets: [
//         {
//           label: 'Employees',
//           data: filteredData(expenses.employees.value.totalCost.values, chartRanges.value[5]).value,
//           backgroundColor: rgba('lightGreen', 0.5)
//         },
//         {
//           label: 'Office',
//           data: filteredData(expenses.office.value.totalCost.values, chartRanges.value[5]).value,
//           backgroundColor: rgba('darkPurple', 0.5)
//         },
//         {
//           label: 'Storage',
//           data: filteredData(expenses.storage.value.totalCost.values, chartRanges.value[5]).value,
//           backgroundColor: rgba('darkBlue', 0.5)
//         },
//         {
//           label: 'Digital Ocean',
//           data: filteredData(expenses.digitalOcean.value.totalCost.values, chartRanges.value[5])
//             .value,
//           backgroundColor: rgba('lightOrange', 0.5)
//         },
//         {
//           label: 'Posthog',
//           data: filteredData(expenses.logging.value.totalCost.values, chartRanges.value[5]).value,
//           backgroundColor: rgba('darkGray', 0.5)
//         },
//         {
//           label: 'DevOps',
//           data: filteredData(expenses.devOps.value.totalCost.values, chartRanges.value[5]).value,
//           backgroundColor: rgba('darkRed', 0.5)
//         },
//         {
//           label: 'OpenAI',
//           data: filteredData(expenses.openAI.value.totalCost.values, chartRanges.value[5]).value,
//           backgroundColor: rgba('darkOrange', 0.5)
//         },
//         {
//           label: 'Loan',
//           data: filteredData(expenses.totals.value.loanTotalCost.values, chartRanges.value[5])
//             .value,
//           backgroundColor: rgba('darkGreen', 0.5)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         x: {
//           stacked: true
//         },
//         y: {
//           stacked: true,
//           beginAtZero: true,
//           type: 'logarithmic'
//         }
//       }
//     }
//   },
//   {
//     id: 6,
//     title: 'Revenue Breakdown by Stream',
//     subtitle:
//       'Shows the diversity of revenue sources, highlighting multiple income streams which reduce financial risk.',
//     type: 'bar',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[6]
//       ).value,
//       datasets: [
//         {
//           label: 'Subscription Revenue',
//           data: filteredData(growth.customers.value.totalRevenue.values, chartRanges.value[6])
//             .value,
//           backgroundColor: rgba('lightGreen', 0.5)
//         },
//         {
//           label: 'Advertising Revenue',
//           data: filteredData(growth.advertising.value.total.values, chartRanges.value[6]).value,
//           backgroundColor: rgba('lightBlue', 0.5)
//         },
//         {
//           label: 'Affiliate Revenue',
//           data: filteredData(growth.affiliate.value.total.values, chartRanges.value[6]).value,
//           backgroundColor: rgba('darkRed', 0.5)
//         },
//         {
//           label: 'Promotion Revenue',
//           data: filteredData(growth.promotion.value.total.values, chartRanges.value[6]).value,
//           backgroundColor: rgba('lightOrange', 0.5)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//           type: 'logarithmic'
//         }
//       }
//     }
//   },
//   {
//     id: 7,
//     title: 'Customer Acquisition and Churn',
//     subtitle:
//       'Tracks new, existing, and churned monthly active users, offering insights into user retention and acquisition strategies.',
//     type: 'line',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[7]
//       ).value,
//       datasets: [
//         {
//           label: 'New Users',
//           data: filteredData(growth.mau.value.new.values, chartRanges.value[7]).value,
//           borderColor: rgba('lightGreen', 0.5),
//           backgroundColor: rgba('darkGreen', 0.5)
//         },
//         {
//           label: 'Existing Users',
//           data: filteredData(growth.mau.value.existing.values, chartRanges.value[7]).value,
//           borderColor: rgba('lightBlue', 0.5),
//           backgroundColor: rgba('darkBlue', 0.5)
//         },
//         {
//           label: 'Churned Users',
//           data: filteredData(growth.mau.value.churned.values, chartRanges.value[7]).value,
//           borderColor: rgba('darkRed', 0.5),
//           backgroundColor: rgba('darkRed', 0.5)
//         },
//         {
//           label: 'Employees',
//           yAxisID: 'y-axis-2',
//           type: 'bar',
//           data: filteredData(expenses.employees.value.totalCount.values, chartRanges.value[7])
//             .value,
//           borderColor: rgba('darkPurple', 0.3),
//           backgroundColor: rgba('darkPurple', 0.3)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         },
//         'y-axis-2': {
//           type: 'linear',
//           position: 'right',
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Burn Rate'
//           },
//           ticks: {
//             callback: function (value) {
//               return formatINR(value)
//             }
//           },
//           grid: {
//             drawOnChartArea: false // only want the grid lines for one axis to show up
//           }
//         }
//       }
//     }
//   },
//   {
//     id: 8,
//     title: 'Employee Cost Breakdown',
//     subtitle: 'Visualizes the costs associated with different types of employees.',
//     type: 'doughnut',
//     data: {
//       labels: ['Support', 'Core', 'Experts', 'Founders', 'Software'],
//       datasets: [
//         {
//           data: [
//             filteredData(
//               expenses.employees.value.supportTotalCost.values.reduce((a, b) => a + b, 0),
//               chartRanges.value[8]
//             ).value,
//             filteredData(
//               expenses.employees.value.coreTotalCost.values.reduce((a, b) => a + b, 0),
//               chartRanges.value[8]
//             ).value,
//             filteredData(
//               expenses.employees.value.expertsTotalCost.values.reduce((a, b) => a + b, 0),
//               chartRanges.value[8]
//             ).value,
//             filteredData(
//               expenses.employees.value.foundersTotalCost.values.reduce((a, b) => a + b, 0),
//               chartRanges.value[8]
//             ).value,
//             filteredData(
//               expenses.employees.value.softwareTotalCost.values.reduce((a, b) => a + b, 0),
//               chartRanges.value[8]
//             ).value
//           ],
//           backgroundColor: [
//             rgba('lightGreen', 0.5),
//             rgba('lightBlue', 0.5),
//             rgba('darkRed', 0.5),
//             rgba('lightOrange', 0.5),
//             rgba('darkGray', 0.5)
//           ],
//           borderColor: rgba('black', 1),
//           borderWidth: 5
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           display: false
//         },
//         x: {
//           display: false
//         }
//       },
//       plugins: {
//         legend: {
//           display: true,
//           position: 'top'
//         }
//       }
//     }
//   },
//   {
//     id: 9,
//     title: 'Customer Segmentation by Revenue',
//     subtitle:
//       'Analyzes revenue contributions from different customer segments, aiding in targeted marketing strategies.',
//     type: 'doughnut',
//     data: {
//       labels: ['Pro Users', 'Expert Users'],
//       datasets: [
//         {
//           data: [
//             filteredData(
//               growth.customers.value.proRevenue.values.reduce((a, b) => a + b, 0),
//               chartRanges.value[9]
//             ).value,
//             filteredData(
//               growth.customers.value.expertRevenue.values.reduce((a, b) => a + b, 0),
//               chartRanges.value[9]
//             ).value
//           ],
//           backgroundColor: [rgba('lightGreen', 0.5), rgba('lightBlue', 0.5)],
//           borderColor: rgba('black', 1),
//           borderWidth: 5
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           display: false
//         },
//         x: {
//           display: false
//         }
//       }
//     }
//   },
//   {
//     id: 10,
//     title: 'Monthly Recurring Revenue (MRR) and Annual Recurring Revenue (ARR) Trends',
//     subtitle:
//       'Highlights the predictability and stability of revenue, crucial for long-term financial planning.',
//     type: 'line',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[10]
//       ).value,
//       datasets: [
//         {
//           label: 'MRR',
//           data: filteredData(metrics.value.MRR.values, chartRanges.value[10]).value,
//           borderColor: rgba('lightGreen', 0.5),
//           backgroundColor: rgba('darkGreen', 0.5)
//         },
//         {
//           label: 'ARR',
//           data: filteredData(metrics.value.ARR.values, chartRanges.value[10]).value,
//           borderColor: rgba('lightBlue', 0.5),
//           backgroundColor: rgba('darkBlue', 0.5)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   },
//   {
//     id: 11,
//     title: 'Gross Margin and Profit/Loss Margin',
//     subtitle:
//       'Demonstrates profitability and operational efficiency, key metrics for evaluating business viability.',
//     type: 'line',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[11]
//       ).value,
//       datasets: [
//         {
//           label: 'Gross Margin',
//           yAxisID: 'y-axis-2',
//           data: filteredData(metrics.value.grossMargin.values, chartRanges.value[11]).value,
//           borderColor: rgba('lightGreen', 0.5),
//           backgroundColor: rgba('darkGreen', 0.2)
//         },
//         {
//           label: 'Profit/Loss Margin',
//           data: filteredData(metrics.value.profitLossMargin.values, chartRanges.value[11]).value,
//           borderColor: rgba('darkRed', 0.5),
//           backgroundColor: rgba('darkRed', 0.2)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Profit/Loss Margin'
//           }
//         },
//         'y-axis-2': {
//           type: 'linear',
//           position: 'right',
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Gross Margin'
//           },
//           ticks: {
//             callback: function (value) {
//               return formatINR(value)
//             }
//           },
//           grid: {
//             drawOnChartArea: false // only want the grid lines for one axis to show up
//           }
//         }
//       }
//     }
//   },
//   {
//     id: 12,
//     title: 'Customer Lifetime Value (LTV) vs. Customer Acquisition Cost (CAC)',
//     subtitle:
//       'Shows the return on investment in acquiring customers, indicating business sustainability.',
//     type: 'bar',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[12]
//       ).value,
//       datasets: [
//         {
//           label: 'LTV',
//           data: filteredData(metrics.value.LTV.values, chartRanges.value[12]).value,
//           backgroundColor: rgba('lightGreen', 0.5)
//         },
//         {
//           label: 'CAC',
//           data: filteredData(metrics.value.CAC.values, chartRanges.value[12]).value,
//           backgroundColor: rgba('lightBlue', 0.5)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   },

//   {
//     id: 13,
//     title: 'Marketing Spend Efficiency',
//     subtitle:
//       'Measures the effectiveness of marketing expenditures in driving revenue, essential for optimizing marketing strategies.',
//     type: 'line',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[13]
//       ).value,
//       datasets: [
//         {
//           label: 'Marketing Spend Efficiency',
//           data: filteredData(metrics.value.marketingSpendEfficiency.values, chartRanges.value[13])
//             .value,
//           borderColor: rgba('lightRed', 0.5),
//           backgroundColor: rgba('darkRed', 0.5)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   },

//   {
//     id: 14,
//     title: 'Churn Rate and Retention Rate',
//     subtitle:
//       'Provides insights into customer loyalty and satisfaction, critical for long-term growth.',
//     type: 'line',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[14]
//       ).value,
//       datasets: [
//         {
//           label: 'Churn Rate',
//           data: filteredData(growth.churn.value.churnRate.values, chartRanges.value[14]).value,
//           borderColor: rgba('lightRed', 0.5),
//           backgroundColor: rgba('darkRed', 0.5)
//         },
//         {
//           label: 'Retention Rate',
//           data: filteredData(metrics.value.retentionRate.values, chartRanges.value[14]).value,
//           borderColor: rgba('lightBlue', 0.5),
//           backgroundColor: rgba('darkBlue', 0.5)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   },

//   {
//     id: 15,
//     title: 'Capital Balance and Burn Rate',
//     subtitle:
//       'Offers a comprehensive view of financial health by showing cash reserves against spending rates.',
//     type: 'bar', // The type here can be 'bar' or 'line' as we specify types in the datasets
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[15]
//       ).value,
//       datasets: [
//         {
//           label: 'Capital Balance',
//           data: filteredData(growth.capital.value.balanceEnd.values, chartRanges.value[15]).value,
//           type: 'line',
//           yAxisID: 'y',
//           borderColor: rgba('lightGreen', 1),
//           backgroundColor: rgba('darkGreen', 0.7)
//         },
//         {
//           label: 'Burn Rate',
//           data: filteredData(growth.capital.value.burnRate.values, chartRanges.value[15]).value,
//           type: 'bar',
//           yAxisID: 'y-axis-2',
//           borderColor: rgba('lightRed', 0.5),
//           backgroundColor: rgba('darkRed', 0.3)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           type: 'linear',
//           position: 'left',
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Capital Balance'
//           },
//           ticks: {
//             callback: function (value) {
//               return formatINR(value)
//             }
//           }
//         },
//         'y-axis-2': {
//           type: 'linear',
//           position: 'right',
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Burn Rate'
//           },
//           ticks: {
//             callback: function (value) {
//               return formatINR(value)
//             }
//           },
//           grid: {
//             drawOnChartArea: false // only want the grid lines for one axis to show up
//           }
//         }
//       }
//     }
//   },

//   {
//     id: 16,
//     title: 'Subscription Revenue by Plan',
//     subtitle:
//       'Breaks down subscription revenue by different plans, highlighting the most profitable segments.',
//     type: 'bar',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[16]
//       ).value,
//       datasets: [
//         {
//           label: 'Pro Users Revenue',
//           data: filteredData(growth.customers.value.proRevenue.values, chartRanges.value[16]).value,
//           backgroundColor: rgba('lightGreen', 0.5)
//         },
//         {
//           label: 'Expert Users Revenue',
//           data: filteredData(growth.customers.value.expertRevenue.values, chartRanges.value[16])
//             .value,
//           backgroundColor: rgba('lightBlue', 0.5)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   },

//   {
//     id: 17,
//     title: 'Cost Efficiency Metrics',
//     subtitle:
//       'Compares various cost efficiency metrics, providing a multi-dimensional view of operational efficiency.',
//     type: 'radar',
//     data: {
//       labels: [
//         'Employee Efficiency',
//         'Office Cost Efficiency',
//         'DevOps Cost Efficiency',
//         'Storage Cost Efficiency'
//       ],
//       datasets: [
//         {
//           label: 'Efficiency Metrics',
//           data: [
//             expenses.employees.value.totalCost.values.reduce((a, b) => a + b, 0) /
//               expenses.employees.value.totalCount.values.reduce((a, b) => a + b, 0),
//             expenses.office.value.totalCost.values.reduce((a, b) => a + b, 0),
//             expenses.devOps.value.totalCost.values.reduce((a, b) => a + b, 0),
//             expenses.storage.value.totalCost.values.reduce((a, b) => a + b, 0)
//           ],
//           backgroundColor: rgba('darkBlue', 0.5),
//           borderColor: rgba('lightBlue', 1), // Adjust border color to make it more visible
//           pointBackgroundColor: rgba('darkBlue', 1), // Point color for better visibility
//           pointBorderColor: '#fff' // White border for points
//         }
//       ]
//     },
//     options: {
//       scales: {
//         r: {
//           angleLines: {
//             display: true
//           },
//           suggestedMin: 0,
//           suggestedMax: 100 // Adjust this based on the expected range of your data
//         }
//       }
//     }
//   },

//   {
//     id: 18,
//     title: 'Monthly vs. Annual Subscription Growth',
//     subtitle:
//       'Differentiates between short-term and long-term revenue streams, showcasing subscription stability.',
//     type: 'line',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[18]
//       ).value,
//       datasets: [
//         {
//           label: 'Monthly Subscription Revenue',
//           data: filteredData(growth.customers.value.totalRevenue.values, chartRanges.value[18])
//             .value,
//           borderColor: rgba('lightGreen', 0.5),
//           backgroundColor: rgba('darkGreen', 0.5)
//         },
//         {
//           label: 'Annual Subscription Revenue',
//           data: filteredData(metrics.value.ARR.values, chartRanges.value[18]).value,
//           borderColor: rgba('lightBlue', 0.5),
//           backgroundColor: rgba('darkBlue', 0.5)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   },

//   {
//     id: 19,
//     title: 'Revenue and Expenses Forecast',
//     subtitle:
//       'Projects future financial performance, helping investors understand potential growth trajectories.',
//     type: 'line',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[19]
//       ).value,
//       datasets: [
//         {
//           label: 'Total Revenue',
//           data: filteredData(growth.revenue.value.total.values, chartRanges.value[19]).value,
//           borderColor: rgba('lightBlue', 0.5),
//           backgroundColor: rgba('darkBlue', 0.5)
//         },
//         {
//           label: 'Total Expenses',
//           data: filteredData(expenses.totals.value.monthlyINR.values, chartRanges.value[19]).value,
//           borderColor: rgba('lightRed', 0.5),
//           backgroundColor: rgba('darkRed', 0.5)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   },

//   {
//     id: 20,
//     title: 'Subscription Customers by Type',
//     subtitle: 'Highlights the number of users by different subscription types.',
//     type: 'bar',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[20]
//       ).value,
//       datasets: [
//         {
//           label: 'Pro Users',
//           data: filteredData(growth.customers.value.proCount.values, chartRanges.value[20]).value,
//           backgroundColor: rgba('lightGreen', 0.5)
//         },
//         {
//           label: 'Expert Users',
//           data: filteredData(growth.customers.value.expertCount.values, chartRanges.value[20])
//             .value,
//           backgroundColor: rgba('lightBlue', 0.5)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   },
//   {
//     id: 21,
//     title: 'DevOps Cost and Efficiency Factor',
//     subtitle: 'Analyzes the cost and efficiency of DevOps operations over time.',
//     info: info.value.devops.vercel,
//     type: 'bar',
//     data: {
//       labels: filteredData(
//         months.map((month) => `M${month}`),
//         chartRanges.value[21]
//       ).value,
//       datasets: [
//         {
//           label: 'DevOps Efficiency Factor',
//           type: 'line',
//           yAxisID: 'y-axis-2',
//           data: filteredData(expenses.devOps.value.efficiencyFactor.values, chartRanges.value[21])
//             .value,
//           borderColor: rgba('lightBlue', 1)
//         },
//         {
//           label: 'DevOps Cost',
//           data: filteredData(expenses.devOps.value.totalCost.values, chartRanges.value[21]).value,
//           backgroundColor: rgba('lightGreen', 0.5)
//         }
//       ]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'DevOps Cost'
//           }
//         },
//         'y-axis-2': {
//           type: 'linear',
//           position: 'right',
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Efficiency Factor'
//           },
//           ticks: {
//             callback: function (value) {
//               return formatINR(value)
//             }
//           },
//           grid: {
//             drawOnChartArea: false // only want the grid lines for one axis to show up
//           }
//         }
//       }
//     }
//   }
// ])
</script>

<template>
  <div class="grid h-full w-full grid-cols-1 gap-4 p-4 xl:gap-12">
    <div
      v-for="(chart, index) in charts"
      :key="`financial-chart-${index}`"
      class="flex flex-col gap-4 lg:flex-row xl:gap-12"
    >
      <div class="border-color w-full min-w-[260px] max-w-[360px] space-y-4 rounded-lg border p-4">
        <h3 class="text-2xl font-semibold text-primary-900">{{ chart.title }}</h3>
        <p class="text-lg">{{ chart.subtitle }}</p>
        <div class="flex items-center gap-4">
          <PrimeButton
            @click="toggleChartRange(index)"
            outlined
          >
            Toggle Range
          </PrimeButton>
          <p class="font-semibold text-primary-700"
            >Months: {{ chartRanges[index].start }} - {{ chartRanges[index].end }}</p
          >
        </div>
      </div>
      <Chart
        class="flex h-full w-full items-center justify-center py-8"
        :chart="chart"
        @update:chart-range="toggleChartRange"
      />
    </div>
  </div>
</template>

<style scoped></style>
