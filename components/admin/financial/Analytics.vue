<script setup lang="ts">
const { months, analytics, chartRanges, filteredData, rgba } = useFinancials()

const charts = ref([] as any[])

watchEffect(() => {
  if (!analytics.value.totalCost || !months.value.length) {
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
          analytics.value.eventsCost.name,
          analytics.value.recordingsCost.name,
          analytics.value.featureRequestsCost.name,
          analytics.value.surveyResponsesCost.name
        ],
        datasets: [
          {
            label: 'Total Logging Costs',
            data: [
              filteredData(analytics.value.eventsCost.values, chartRanges.value[0]).value.reduce(
                (a, b) => a + b,
                0
              ),
              filteredData(analytics.value.recordingsCost.values, chartRanges.value[0]).value.reduce(
                (a, b) => a + b,
                0
              ),
              filteredData(analytics.value.featureRequestsCost.values, chartRanges.value[0]).value.reduce(
                (a, b) => a + b,
                0
              ),
              filteredData(analytics.value.surveyResponsesCost.values, chartRanges.value[0]).value.reduce(
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
      category: 'Analytics Costs',
      id: 1,
      title: 'Total Analytics Cost and Breakdown',
      subtitle: 'Shows the total analytics cost and its breakdown over time.',
      type: 'bar',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[0]
        ).value,
        datasets: [
          {
            label: 'Total Cost',
            data: filteredData(analytics.value.totalCost.values, chartRanges.value[1]).value,
            backgroundColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Events Cost',
            data: filteredData(analytics.value.eventsCost.values, chartRanges.value[1]).value,
            backgroundColor: rgba('lightBlue', 0.5)
          },
          {
            label: 'Recordings Cost',
            data: filteredData(analytics.value.recordingsCost.values, chartRanges.value[1]).value,
            backgroundColor: rgba('darkRed', 0.5)
          },
          {
            label: 'Feature Requests Cost',
            data: filteredData(analytics.value.featureRequestsCost.values, chartRanges.value[1])
              .value,
            backgroundColor: rgba('lightGreen', 0.5)
          },
          {
            label: 'Survey Responses Cost',
            data: filteredData(analytics.value.surveyResponsesCost.values, chartRanges.value[1])
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
              text: 'Cost (INR)'
            }
          }
        }
      }
    },
    {
      category: 'Usage Metrics',
      id: 1,
      title: 'Usage Metrics Over Time',
      subtitle:
        'Tracks the usage metrics for events, recordings, feature requests, and survey responses over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[1]
        ).value,
        datasets: [
          {
            label: 'Events Usage',
            data: filteredData(analytics.value.eventsUsage.values, chartRanges.value[1]).value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2)
          },
          {
            label: 'Recordings Usage',
            data: filteredData(analytics.value.recordingsUsage.values, chartRanges.value[1]).value,
            borderColor: rgba('darkRed', 0.5),
            backgroundColor: rgba('darkRed', 0.2)
          },
          {
            label: 'Feature Requests Usage',
            data: filteredData(analytics.value.featureRequestsUsage.values, chartRanges.value[1])
              .value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2)
          },
          {
            label: 'Survey Responses Usage',
            data: filteredData(analytics.value.surveyResponsesUsage.values, chartRanges.value[1])
              .value,
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Usage'
            }
          }
        }
      }
    },
    {
      category: 'Cost Efficiency',
      id: 2,
      title: 'Cost Efficiency Over Time',
      subtitle: 'Shows the cost efficiency by comparing costs to usage over time.',
      type: 'line',
      data: {
        labels: filteredData(
          months.value.map((month) => `M${month}`),
          chartRanges.value[2]
        ).value,
        datasets: [
          {
            label: 'Events Cost Efficiency',
            data: filteredData(
              analytics.value.eventsCost.values.map(
                (cost, index) => cost / analytics.value.eventsUsage.values[index]
              ),
              chartRanges.value[2]
            ).value,
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2)
          },
          {
            label: 'Recordings Cost Efficiency',
            data: filteredData(
              analytics.value.recordingsCost.values.map(
                (cost, index) => cost / analytics.value.recordingsUsage.values[index]
              ),
              chartRanges.value[2]
            ).value,
            borderColor: rgba('darkRed', 0.5),
            backgroundColor: rgba('darkRed', 0.2)
          },
          {
            label: 'Feature Requests Cost Efficiency',
            data: filteredData(
              analytics.value.featureRequestsCost.values.map(
                (cost, index) => cost / analytics.value.featureRequestsUsage.values[index]
              ),
              chartRanges.value[2]
            ).value,
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2)
          },
          {
            label: 'Survey Responses Cost Efficiency',
            data: filteredData(
              analytics.value.surveyResponsesCost.values.map(
                (cost, index) => cost / analytics.value.surveyResponsesUsage.values[index]
              ),
              chartRanges.value[2]
            ).value,
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2)
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cost Efficiency (Cost per Usage)'
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
