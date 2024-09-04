<script setup lang="ts">
const { months, logging, rgba } = useFinancials()

const charts = computed(() => {
  if (!months.value || !logging.value) {
    return []
  }

  return [
    {
      title: 'Logging Costs Breakdown',
      subtitle: 'Shows the breakdown of logging costs for the selected time period.',
      type: 'bar',
      data: {
        labels: ['Ingested Cost', 'Retention Cost', 'Metrics Cost', 'Analytics Cost'],
        datasets: [
          {
            label: 'Total Logging Costs',
            valueType: 'currency',
            data: [
              logging.value.flatMap((month) => month.ingested).reduce((a, b) => a + b, 0),
              logging.value.flatMap((month) => month.retention).reduce((a, b) => a + b, 0),
              logging.value.flatMap((month) => month.metrics).reduce((a, b) => a + b, 0),
              logging.value.flatMap((month) => month.analytics).reduce((a, b) => a + b, 0)
            ],
            backgroundColor: [
              rgba('lightGreen', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5),
              rgba('darkBlue', 0.5)
            ]
          }
        ]
      }
    },
    {
      title: 'Ingested vs. Retention Costs',
      subtitle: 'Comparison of ingested and retention costs over time.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Total Cost',
            type: 'line',
            valueType: 'currency',
            data: logging.value.flatMap((cost) => cost.total),
            backgroundColor: rgba('black', 1),
            borderColor: rgba('lightYellow', 0.5)
          },
          {
            label: 'Ingested Cost',
            valueType: 'currency',
            stack: 'stack1',
            data: logging.value.flatMap((cost) => cost.ingested),
            backgroundColor: rgba('lightBlue', 0.5)
          },
          {
            label: 'Retention Cost',
            valueType: 'currency',
            stack: 'stack1',
            data: logging.value.flatMap((cost) => cost.retention),
            backgroundColor: rgba('darkBlue', 0.5)
          },
          {
            label: 'Metrics Cost',
            valueType: 'currency',
            stack: 'stack2',
            data: logging.value.flatMap((cost) => cost.metrics),
            backgroundColor: rgba('lightOrange', 0.5)
          },
          {
            label: 'Analytics Cost',
            stack: 'stack2',
            valueType: 'currency',
            data: logging.value.flatMap((cost) => cost.analytics),
            backgroundColor: rgba('darkOrange', 0.5)
          }
        ]
      }
    },

    {
      title: 'Detailed Breakdown of Logging Costs',
      subtitle: 'Shows detailed breakdown of logging costs over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Ingested Cost',
            valueType: 'currency',
            data: logging.value.flatMap((cost) => cost.ingested),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Retention Cost',
            valueType: 'currency',
            data: logging.value.flatMap((cost) => cost.retention),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Metrics Cost',
            valueType: 'currency',
            data: logging.value.flatMap((cost) => cost.metrics),
            borderColor: rgba('lightOrange', 0.5),
            backgroundColor: rgba('black', 1)
          },
          {
            label: 'Analytics Cost',
            valueType: 'currency',
            data: logging.value.flatMap((cost) => cost.analytics),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('black', 1)
          }
        ]
      }
    }
  ]
})
</script>

<template>
  <AdminFinancialCharts :charts="charts" />
</template>

<style scoped></style>
