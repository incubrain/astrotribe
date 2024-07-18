<script setup lang="ts">
const { months, logging, chartRanges, filteredData, rgba } = useFinancials()

const charts = ref([] as any[])

watchEffect(() => {
  if (!logging.value.ingestedCost || !months.value.length) {
    charts.value = []
    return
  }

  charts.value = [
    {
      id: 0,
      title: 'Logging Costs Breakdown',
      subtitle: 'Shows the breakdown of logging costs for the selected timeperiod.',
      type: 'bar',
      data: {
        labels: [
          logging.value.ingestedCost.name,
          logging.value.retentionCost.name,
          logging.value.metricsCost.name,
          logging.value.analyticsCost.name
        ],
        datasets: [
          {
            label: 'Total Logging Costs',
            data: [
              filteredData(logging.value.ingestedCost.values, chartRanges.value[0]).value.reduce(
                (a, b) => a + b,
                0
              ),
              filteredData(logging.value.retentionCost.values, chartRanges.value[0]).value.reduce(
                (a, b) => a + b,
                0
              ),
              filteredData(logging.value.metricsCost.values, chartRanges.value[0]).value.reduce(
                (a, b) => a + b,
                0
              ),
              filteredData(logging.value.analyticsCost.values, chartRanges.value[0]).value.reduce(
                (a, b) => a + b,
                0
              )
            ],
            backgroundColor: [
              rgba('lightGreen', 0.5),
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
      category: 'Logging Costs',
      id: 1,
      title: 'Ingested vs. Retention Costs',
      subtitle: 'Comparison of ingested and retention costs over time.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[1]
        ).value,
        datasets: [
          {
            label: 'Ingested Cost',
            data: filteredData(logging.value.ingestedCost.values, chartRanges.value[1]).value,
            backgroundColor: rgba('lightBlue', 0.5)
          },
          {
            label: 'Retention Cost',
            data: filteredData(logging.value.retentionCost.values, chartRanges.value[1]).value,
            backgroundColor: rgba('darkBlue', 0.5)
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
      category: 'Logging Costs',
      id: 2,
      title: 'Metrics and Analytics Costs',
      subtitle: 'Breakdown of metrics and analytics costs over time.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[2]
        ).value,
        datasets: [
          {
            label: 'Metrics Cost',
            data: filteredData(logging.value.metricsCost.values, chartRanges.value[2]).value,
            backgroundColor: rgba('lightOrange', 0.5)
          },
          {
            label: 'Analytics Cost',
            data: filteredData(logging.value.analyticsCost.values, chartRanges.value[2]).value,
            backgroundColor: rgba('darkOrange', 0.5)
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
      category: 'Logging Costs',
      id: 3,
      title: 'Detailed Breakdown of Logging Costs',
      subtitle: 'Shows detailed breakdown of logging costs over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[3]
        ).value,
        datasets: [
          {
            label: 'Ingested Cost',
            data: filteredData(logging.value.ingestedCost.values, chartRanges.value[3]).value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Retention Cost',
            data: filteredData(logging.value.retentionCost.values, chartRanges.value[3]).value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('darkGreen', 0.5)
          },
          {
            label: 'Metrics Cost',
            data: filteredData(logging.value.metricsCost.values, chartRanges.value[3]).value,
            borderColor: rgba('lightOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.5)
          },
          {
            label: 'Analytics Cost',
            data: filteredData(logging.value.analyticsCost.values, chartRanges.value[3]).value,
            borderColor: rgba('lightRed', 0.5),
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
