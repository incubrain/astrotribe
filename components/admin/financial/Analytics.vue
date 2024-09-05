<script setup lang="ts">
const { months, analytics, rgba } = useFinancials()

console.log('dataAnalytics', analytics.value, months.value)

const charts = computed(() => {
  if (!months.value || !analytics.value) {
    return []
  }

  return [
    {
      title: 'Analytics Costs Breakdown',
      subtitle: 'Shows the breakdown of analytics costs for the selected timeperiod.',
      type: 'bar',
      data: {
        labels: [
          'Events Cost',
          'Recordings Cost',
          'Feature Requests Cost',
          'Survey Responses Cost',
        ],
        datasets: [
          {
            label: 'Total Analytics Costs',
            valueType: 'currency',
            data: [
              analytics.value.flatMap(month => month.events.cost).reduce((a, b) => a + b, 0),
              analytics.value.flatMap(month => month.recordings.cost).reduce((a, b) => a + b, 0),
              analytics.value
                .flatMap(month => month.featureRequests.cost)
                .reduce((a, b) => a + b, 0),
              analytics.value
                .flatMap(month => month.surveyResponses.cost)
                .reduce((a, b) => a + b, 0),
            ],
            backgroundColor: [
              rgba('lightGreen', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
            ],
          },
        ],
      },
    },
    {
      title: 'Total Analytics Cost and Breakdown',
      subtitle: 'Shows the total analytics cost and its breakdown over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Events Cost',
            valueType: 'currency',
            data: analytics.value.flatMap(month => month.events.cost),
            backgroundColor: rgba('black', 1),
            borderColor: rgba('lightBlue', 0.5),
          },
          {
            label: 'Recordings Cost',
            valueType: 'currency',
            data: analytics.value.flatMap(month => month.recordings.cost),
            backgroundColor: rgba('black', 1),
            borderColor: rgba('darkRed', 0.5),
          },
          {
            label: 'Feature Requests Cost',
            valueType: 'currency',
            data: analytics.value.flatMap(month => month.featureRequests.cost),
            backgroundColor: rgba('black', 1),
            borderColor: rgba('lightGreen', 0.5),
          },
          {
            label: 'Survey Responses Cost',
            valueType: 'currency',
            data: analytics.value.flatMap(month => month.surveyResponses.cost),
            backgroundColor: rgba('black', 1),
            borderColor: rgba('lightRed', 0.5),
          },
          {
            label: 'Total Cost',
            valueType: 'currency',
            type: 'bar',
            data: analytics.value.flatMap(month => month.total),
            backgroundColor: rgba('darkBlue', 0.5),
          },
        ],
      },
    },
    {
      title: 'Usage Metrics Over Time',
      subtitle:
        'Tracks the usage metrics for events, recordings, feature requests, and survey responses over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Events Usage',
            valueType: 'number',
            data: analytics.value.flatMap(month => month.events.usage),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2),
          },
          {
            label: 'Recordings Usage',
            valueType: 'number',
            data: analytics.value.flatMap(month => month.recordings.usage),
            borderColor: rgba('darkRed', 0.5),
            backgroundColor: rgba('darkRed', 0.2),
          },
          {
            label: 'Feature Requests Usage',
            valueType: 'number',
            data: analytics.value.flatMap(month => month.featureRequests.usage),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2),
          },
          {
            label: 'Survey Responses Usage',
            valueType: 'number',
            data: analytics.value.flatMap(month => month.surveyResponses.usage),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2),
          },
        ],
      },
    },
    {
      title: 'Cost Efficiency Over Time',
      subtitle: 'Shows the cost efficiency by comparing costs to usage over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Events Cost Efficiency',
            valueType: 'currency',
            data: analytics.value.flatMap(month => month.events.cost / month.events.usage),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2),
          },
          {
            label: 'Recordings Cost Efficiency',
            valueType: 'currency',
            data: analytics.value.flatMap(
              month => month.recordings.cost / month.recordings.usage,
            ),
            borderColor: rgba('darkRed', 0.5),
            backgroundColor: rgba('darkRed', 0.2),
          },
          {
            label: 'Feature Requests Cost Efficiency',
            valueType: 'currency',
            data: analytics.value.flatMap(
              month => month.featureRequests.cost / month.featureRequests.usage,
            ),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2),
          },
          {
            label: 'Survey Responses Cost Efficiency',
            valueType: 'currency',
            data: analytics.value.flatMap(
              month => month.surveyResponses.cost / month.surveyResponses.usage,
            ),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2),
          },
        ],
      },
    },
  ]
})
</script>

<template>
  <AdminFinancialCharts :charts="charts" />
</template>

<style scoped></style>
