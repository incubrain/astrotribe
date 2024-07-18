<script setup lang="ts">
const { months, devOpsVercel, devOpsInhouse, chartRanges, filteredData, formatStorage, rgba } =
  useFinancials()

const charts = ref([] as any[])

watchEffect(() => {
  if (!devOpsVercel.value.baseCost || !months.value.length) {
    charts.value = []
    return
  }

  charts.value = [
    {
      id: 0,
      title: 'Vercel Costs Breakdown',
      subtitle: 'Shows the breakdown of Vercel costs for the selected timeperiod.',
      type: 'bar',
      data: {
        labels: [
          devOpsVercel.value.baseCost.name,
          devOpsVercel.value.dataTransferCost.name,
          devOpsVercel.value.originTransferCost.name,
          devOpsVercel.value.edgeRequestsCost.name,
          devOpsVercel.value.middlewareInvocationsCost.name,
          devOpsVercel.value.functionInvocationsCost.name,
          devOpsVercel.value.functionDurationCost.name,
          devOpsVercel.value.edgeFunctionExecutionsCost.name,
          devOpsVercel.value.dataCacheReadsCost.name,
          devOpsVercel.value.dataCacheWritesCost.name,
          devOpsVercel.value.edgeConfigReadsCost.name,
          devOpsVercel.value.edgeConfigWritesCost.name
        ],
        datasets: [
          {
            label: 'Total Vercel Costs',
            data: [
              filteredData(devOpsVercel.value.baseCost.values, chartRanges.value[0]).value.reduce(
                (a, b) => a + b,
                0
              ),
              filteredData(
                devOpsVercel.value.dataTransferCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                devOpsVercel.value.originTransferCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                devOpsVercel.value.edgeRequestsCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                devOpsVercel.value.middlewareInvocationsCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                devOpsVercel.value.functionInvocationsCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                devOpsVercel.value.functionDurationCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                devOpsVercel.value.edgeFunctionExecutionsCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                devOpsVercel.value.dataCacheReadsCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                devOpsVercel.value.dataCacheWritesCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                devOpsVercel.value.edgeConfigReadsCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0),
              filteredData(
                devOpsVercel.value.edgeConfigWritesCost.values,
                chartRanges.value[0]
              ).value.reduce((a, b) => a + b, 0)
            ],
            backgroundColor: [
              rgba('lightGreen', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5)
            ]
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cost'
            }
          }
        }
      }
    },
    {
      category: 'DevOps Costs',
      id: 0,
      title: 'Total DevOps Cost and Breakdown',
      subtitle: 'Shows the total DevOps cost and its breakdown over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[0]
        ).value,
        datasets: [
          {
            label: 'Base Cost',
            data: filteredData(devOpsVercel.value.baseCost.values, chartRanges.value[0]).value,
            borderColor: rgba('lightCyan', 0.5)
          },
          {
            label: 'Data Transfer Cost',
            data: filteredData(devOpsVercel.value.dataTransferCost.values, chartRanges.value[0])
              .value,
            borderColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Origin Transfer Cost',
            data: filteredData(devOpsVercel.value.originTransferCost.values, chartRanges.value[0])
              .value,
            borderColor: rgba('lightGreen', 0.5)
          },
          {
            label: 'Edge Requests Cost',
            data: filteredData(devOpsVercel.value.edgeRequestsCost.values, chartRanges.value[0])
              .value,
            borderColor: rgba('lightRed', 0.5)
          },
          {
            label: 'Middleware Invocations Cost',
            data: filteredData(
              devOpsVercel.value.middlewareInvocationsCost.values,
              chartRanges.value[0]
            ).value,
            borderColor: rgba('darkGreen', 0.5)
          },
          {
            label: 'Function Invocations Cost',
            data: filteredData(
              devOpsVercel.value.functionInvocationsCost.values,
              chartRanges.value[0]
            ).value,
            borderColor: rgba('darkOrange', 0.5)
          },
          {
            label: 'Function Duration Cost',
            data: filteredData(devOpsVercel.value.functionDurationCost.values, chartRanges.value[0])
              .value,
            borderColor: rgba('darkPurple', 0.5)
          },
          {
            label: 'Edge Function Executions Cost',
            data: filteredData(
              devOpsVercel.value.edgeFunctionExecutionsCost.values,
              chartRanges.value[0]
            ).value,
            borderColor: rgba('darkPink', 0.5)
          },
          {
            label: 'Data Cache Reads Cost',
            data: filteredData(devOpsVercel.value.dataCacheReadsCost.values, chartRanges.value[0])
              .value,
            borderColor: rgba('darkCyan', 0.5)
          },
          {
            label: 'Data Cache Writes Cost',
            data: filteredData(devOpsVercel.value.dataCacheWritesCost.values, chartRanges.value[0])
              .value,
            borderColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Edge Config Reads Cost',
            data: filteredData(devOpsVercel.value.edgeConfigReadsCost.values, chartRanges.value[0])
              .value,
            borderColor: rgba('darkBrown', 0.5)
          },
          {
            label: 'Edge Config Writes Cost',
            data: filteredData(devOpsVercel.value.edgeConfigWritesCost.values, chartRanges.value[0])
              .value,
            borderColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Total Cost',
            type: 'bar',
            yAxisID: 'y-axis-2',
            data: filteredData(devOpsVercel.value.totalCost.values, chartRanges.value[0]).value,
            backgroundColor: rgba('darkBlue', 0.3)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Single Cost'
            }
          }
        }
      }
    },
    {
      category: 'Usage Metrics',
      id: 1,
      title: 'Vercel Usage Metrics Over Time',
      subtitle: 'Tracks the usage metrics for various Vercel components over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[1]
        ).value,
        datasets: [
          {
            label: 'Data Transfer GB',
            data: filteredData(devOpsVercel.value.dataTransferGB.values, chartRanges.value[1])
              .value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2)
          },
          {
            label: 'Origin Transfer GB',
            data: filteredData(devOpsVercel.value.originTransferGB.values, chartRanges.value[1])
              .value,
            borderColor: rgba('darkRed', 0.5),
            backgroundColor: rgba('darkRed', 0.2)
          },
          {
            label: 'Edge Requests',
            data: filteredData(devOpsVercel.value.edgeRequests.values, chartRanges.value[1]).value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2)
          },
          {
            label: 'Middleware Invocations',
            data: filteredData(
              devOpsVercel.value.middlewareInvocations.values,
              chartRanges.value[1]
            ).value,
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
          },
          {
            label: 'Function Invocations',
            data: filteredData(devOpsVercel.value.functionInvocations.values, chartRanges.value[1])
              .value,
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2)
          },
          {
            label: 'Function Duration GB Hours',
            data: filteredData(
              devOpsVercel.value.functionDurationGBHours.values,
              chartRanges.value[1]
            ).value,
            borderColor: rgba('darkPurple', 0.5),
            backgroundColor: rgba('darkPurple', 0.2)
          },
          {
            label: 'Edge Function Executions',
            data: filteredData(
              devOpsVercel.value.edgeFunctionExecutions.values,
              chartRanges.value[1]
            ).value,
            borderColor: rgba('darkPink', 0.5),
            backgroundColor: rgba('darkPink', 0.2)
          },
          {
            label: 'Data Cache Reads',
            data: filteredData(devOpsVercel.value.dataCacheReads.values, chartRanges.value[1])
              .value,
            borderColor: rgba('darkCyan', 0.5),
            backgroundColor: rgba('darkCyan', 0.2)
          },
          {
            label: 'Data Cache Writes',
            data: filteredData(devOpsVercel.value.dataCacheWrites.values, chartRanges.value[1])
              .value,
            borderColor: rgba('darkBlue', 0.5),
            backgroundColor: rgba('darkBlue', 0.2)
          },
          {
            label: 'Edge Config Reads',
            data: filteredData(devOpsVercel.value.edgeConfigReads.values, chartRanges.value[1])
              .value,
            borderColor: rgba('darkBrown', 0.5),
            backgroundColor: rgba('darkBrown', 0.2)
          },
          {
            label: 'Edge Config Writes',
            data: filteredData(devOpsVercel.value.edgeConfigWrites.values, chartRanges.value[1])
              .value,
            borderColor: rgba('darkBlue', 0.5),
            backgroundColor: rgba('darkBlue', 0.2)
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
          }
        }
      }
    },
    {
      category: 'Vercel Function Metrics',
      id: 2,
      title: 'Function Invocations and Duration',
      subtitle: 'Tracks the number of function invocations, their duration, and costs over time.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[2]
        ).value,
        datasets: [
          {
            label: 'Function Invocations',
            data: filteredData(devOpsVercel.value.functionInvocations.values, chartRanges.value[2])
              .value,
            borderColor: rgba('lightBlue', 0.5)
          },
          {
            label: 'Function Duration (GB Hours)',
            data: filteredData(
              devOpsVercel.value.functionDurationGBHours.values,
              chartRanges.value[2]
            ).value,
            backgroundColor: rgba('lightGreen', 0.5)
          },
          {
            label: 'Function Invocations Cost',
            data: filteredData(
              devOpsVercel.value.functionInvocationsCost.values,
              chartRanges.value[2]
            ).value,
            backgroundColor: rgba('lightRed', 0.5)
          },
          {
            label: 'Function Duration Cost',
            data: filteredData(devOpsVercel.value.functionDurationCost.values, chartRanges.value[2])
              .value,
            backgroundColor: rgba('darkOrange', 0.5)
          }
        ]
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Count / GB Hours / Cost (INR)'
            }
          }
        }
      }
    },
    {
      category: 'Vercel Edge and Cache Operations',
      id: 3,
      title: 'Edge Function Executions and Data Cache Operations',
      subtitle:
        'Tracks the number of edge function executions, data cache reads/writes, and costs over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[3]
        ).value,
        datasets: [
          {
            label: 'Edge Function Executions',
            data: filteredData(
              devOpsVercel.value.edgeFunctionExecutions.values,
              chartRanges.value[3]
            ).value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2)
          },
          {
            label: 'Data Cache Reads',
            data: filteredData(devOpsVercel.value.dataCacheReads.values, chartRanges.value[3])
              .value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2)
          },
          {
            label: 'Data Cache Writes',
            data: filteredData(devOpsVercel.value.dataCacheWrites.values, chartRanges.value[3])
              .value,
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
          },
          {
            label: 'Edge Function Executions Cost',
            data: filteredData(
              devOpsVercel.value.edgeFunctionExecutionsCost.values,
              chartRanges.value[3]
            ).value,
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2)
          },
          {
            label: 'Data Cache Reads Cost',
            data: filteredData(devOpsVercel.value.dataCacheReadsCost.values, chartRanges.value[3])
              .value,
            borderColor: rgba('darkPurple', 0.5),
            backgroundColor: rgba('darkPurple', 0.2)
          },
          {
            label: 'Data Cache Writes Cost',
            data: filteredData(devOpsVercel.value.dataCacheWritesCost.values, chartRanges.value[3])
              .value,
            borderColor: rgba('darkPink', 0.5),
            backgroundColor: rgba('darkPink', 0.2)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Count / Cost (INR)'
            }
          }
        }
      }
    },
    // {
    //   category: 'Vercel Monitoring and Analytics',
    //   id: 4,
    //   title: 'Monitoring Events, Speed Insights, and Web Analytics',
    //   subtitle:
    //     'Tracks the usage and costs of monitoring events, speed insights data points, and web analytics events over time.',
    //   type: 'line',
    //   data: {
    //     labels: filteredData(
    //       months.value.map((month) => `M${month}`),
    //       chartRanges.value[4]
    //     ).value,
    //     datasets: [
    //       {
    //         label: 'Monitoring Events',
    //         data: filteredData(devOpsVercel.value.monitoringEvents.values, chartRanges.value[4])
    //           .value,
    //         borderColor: rgba('lightBlue', 0.5),
    //         backgroundColor: rgba('lightBlue', 0.2)
    //       },
    //       {
    //         label: 'Speed Insights Data Points',
    //         data: filteredData(
    //           devOpsVercel.value.speedInsightsDataPoints.values,
    //           chartRanges.value[4]
    //         ).value,
    //         borderColor: rgba('darkRed', 0.5),
    //         backgroundColor: rgba('darkRed', 0.2)
    //       },
    //       {
    //         label: 'Web Analytics Events',
    //         data: filteredData(devOpsVercel.value.webAnalyticsEvents.values, chartRanges.value[4])
    //           .value,
    //         borderColor: rgba('lightGreen', 0.5),
    //         backgroundColor: rgba('lightGreen', 0.2)
    //       },
    //       {
    //         label: 'Monitoring Cost',
    //         data: filteredData(devOpsVercel.value.monitoringCost.values, chartRanges.value[4]).value,
    //         borderColor: rgba('lightRed', 0.5),
    //         backgroundColor: rgba('lightRed', 0.2)
    //       },
    //       {
    //         label: 'Speed Insights Cost',
    //         data: filteredData(devOpsVercel.value.SpeedInsights.values, chartRanges.value[4]).value,
    //         borderColor: rgba('darkOrange', 0.5),
    //         backgroundColor: rgba('darkOrange', 0.2)
    //       },
    //       {
    //         label: 'Web Analytics Cost',
    //         data: filteredData(devOpsVercel.value.WebAnalytics.values, chartRanges.value[4]).value,
    //         borderColor: rgba('darkPurple', 0.5),
    //         backgroundColor: rgba('darkPurple', 0.2)
    //       }
    //     ]
    //   },
    //   options: {
    //     scales: {
    //       y: {
    //         beginAtZero: true,
    //         title: {
    //           display: true,
    //           text: 'Usage / Cost (INR)'
    //         }
    //       }
    //     }
    //   }
    // },
    {
      category: 'Vercel Usage Metrics',
      id: 5,
      title: 'Total Usage Metrics',
      subtitle: 'Provides an overview of all significant usage metrics over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[5]
        ).value,
        datasets: [
          {
            label: 'Data Transfer GB',
            type: 'bar',
            yAxisID: 'y-axis-2',
            data: filteredData(devOpsVercel.value.dataTransferGB.values, chartRanges.value[5])
              .value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2)
          },
          {
            label: 'Origin Transfer GB',
            type: 'bar',
            yAxisID: 'y-axis-2',
            data: filteredData(devOpsVercel.value.originTransferGB.values, chartRanges.value[5])
              .value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2)
          },
          {
            label: 'Edge Requests',
            data: filteredData(devOpsVercel.value.edgeRequests.values, chartRanges.value[5]).value,
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
          },
          {
            label: 'Middleware Invocations',
            data: filteredData(
              devOpsVercel.value.middlewareInvocations.values,
              chartRanges.value[5]
            ).value,
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2)
          },
          {
            label: 'Function Invocations',
            data: filteredData(devOpsVercel.value.functionInvocations.values, chartRanges.value[5])
              .value,
            borderColor: rgba('darkPurple', 0.5),
            backgroundColor: rgba('darkPurple', 0.2)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Invoations'
            }
          },
          'y-axis-2': {
            title: {
              display: true,
              text: 'Data (GB)'
            },
            ticks: {
              callback: function (value) {
                return formatStorage(value)
              }
            }
          }
        }
      }
    },
    {
      category: 'Vercel Cost Breakdown',
      id: 6,
      title: 'Cost Breakdown by Function Type',
      subtitle: 'Shows the cost breakdown for different Vercel functions over time.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[6]
        ).value,
        datasets: [
          {
            label: 'Edge Requests Cost',
            data: filteredData(devOpsVercel.value.edgeRequestsCost.values, chartRanges.value[6])
              .value,
            backgroundColor: rgba('lightBlue', 0.5)
          },
          {
            label: 'Middleware Invocations Cost',
            data: filteredData(
              devOpsVercel.value.middlewareInvocationsCost.values,
              chartRanges.value[6]
            ).value,
            backgroundColor: rgba('lightGreen', 0.5)
          },
          {
            label: 'Function Invocations Cost',
            data: filteredData(
              devOpsVercel.value.functionInvocationsCost.values,
              chartRanges.value[6]
            ).value,
            backgroundColor: rgba('lightRed', 0.5)
          },
          {
            label: 'Function Duration Cost',
            data: filteredData(devOpsVercel.value.functionDurationCost.values, chartRanges.value[6])
              .value,
            backgroundColor: rgba('darkOrange', 0.5)
          },
          {
            label: 'Data Cache Reads Cost',
            data: filteredData(devOpsVercel.value.dataCacheReadsCost.values, chartRanges.value[6])
              .value,
            backgroundColor: rgba('darkPurple', 0.5)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Invocations'
            }
          }
        }
      }
    },
    {
      category: 'Vercel Data Transfer and Processing',
      id: 7,
      title: 'Data Transfer and Processing Costs',
      subtitle: 'Shows the costs associated with data transfer and processing over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[7]
        ).value,
        datasets: [
          {
            label: 'Data Transfer Cost',
            data: filteredData(devOpsVercel.value.dataTransferCost.values, chartRanges.value[7])
              .value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2)
          },
          {
            label: 'Origin Transfer Cost',
            data: filteredData(devOpsVercel.value.originTransferCost.values, chartRanges.value[7])
              .value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2)
          },
          {
            label: 'Function Duration Cost',
            data: filteredData(devOpsVercel.value.functionDurationCost.values, chartRanges.value[7])
              .value,
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
          },
          {
            label: 'Data Cache Writes Cost',
            data: filteredData(devOpsVercel.value.dataCacheWritesCost.values, chartRanges.value[7])
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
