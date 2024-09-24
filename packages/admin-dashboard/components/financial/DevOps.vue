<script setup lang="ts">
const { months, devOps, rgba } = useFinancials()

const breakdown = computed(() => devOps?.value.flatMap((m) => m.vercel.cost.breakdown))

const charts = computed(() => {
  if (!months.value || !devOps.value) {
    return []
  }

  return [
    {
      title: 'Vercel Costs Breakdown',
      subtitle: 'Shows the breakdown of Vercel costs for the selected time period.',
      type: 'bar',
      data: {
        labels: [
          'Base Cost',
          'Data Transfer Cost',
          'Origin Transfer Cost',
          'Edge Requests Cost',
          'Middleware Invocations Cost',
          'Function Invocations Cost',
          'Function Duration Cost',
          'Edge Function Executions Cost',
          'Data Cache Reads Cost',
          'Data Cache Writes Cost',
          'Edge Config Reads Cost',
          'Edge Config Writes Cost',
        ],
        datasets: [
          {
            label: 'Total Vercel Costs',
            valueType: 'currency',
            data: [
              breakdown.value.flatMap((m) => m.base).reduce((a, b) => a + b, 0),
              breakdown.value.flatMap((m) => m.dataTransfer).reduce((a, b) => a + b, 0),
              breakdown.value.flatMap((m) => m.originTransfer).reduce((a, b) => a + b, 0),
              breakdown.value.flatMap((m) => m.edgeRequests).reduce((a, b) => a + b, 0),
              breakdown.value.flatMap((m) => m.middlewareInvocations).reduce((a, b) => a + b, 0),
              breakdown.value.flatMap((m) => m.functionInvocations).reduce((a, b) => a + b, 0),
              breakdown.value.flatMap((m) => m.functionDuration).reduce((a, b) => a + b, 0),
              breakdown.value.flatMap((m) => m.edgeFunctionExecutions).reduce((a, b) => a + b, 0),
              breakdown.value.flatMap((m) => m.dataCacheReads).reduce((a, b) => a + b, 0),
              breakdown.value.flatMap((m) => m.dataCacheWrites).reduce((a, b) => a + b, 0),
              breakdown.value.flatMap((m) => m.edgeConfigReads).reduce((a, b) => a + b, 0),
              breakdown.value.flatMap((m) => m.edgeConfigWrites).reduce((a, b) => a + b, 0),
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
              rgba('darkBlue', 0.5),
            ],
          },
        ],
      },
    },
    {
      title: 'Total DevOps Cost and Breakdown',
      subtitle: 'Shows the total DevOps cost and its breakdown over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Base Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.base),
            borderColor: rgba('lightCyan', 0.5),
          },
          {
            label: 'Data Transfer Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.dataTransfer),
            borderColor: rgba('darkRed', 0.5),
          },
          {
            label: 'Origin Transfer Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.originTransfer),
            borderColor: rgba('lightGreen', 0.5),
          },
          {
            label: 'Edge Requests Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.edgeRequests),
            borderColor: rgba('lightRed', 0.5),
          },
          {
            label: 'Middleware Invocations Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.middlewareInvocations),
            borderColor: rgba('darkGreen', 0.5),
          },
          {
            label: 'Function Invocations Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.functionInvocations),
            borderColor: rgba('darkOrange', 0.5),
          },
          {
            label: 'Function Duration Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.functionDuration),
            borderColor: rgba('darkPurple', 0.5),
          },
          {
            label: 'Edge Function Executions Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.edgeFunctionExecutions),
            borderColor: rgba('darkPink', 0.5),
          },
          {
            label: 'Data Cache Reads Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.dataCacheReads),
            borderColor: rgba('darkCyan', 0.5),
          },
          {
            label: 'Data Cache Writes Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.dataCacheWrites),
            borderColor: rgba('darkBlue', 0.5),
          },
          {
            label: 'Edge Config Reads Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.edgeConfigReads),
            borderColor: rgba('darkBrown', 0.5),
          },
          {
            label: 'Edge Config Writes Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.edgeConfigWrites),
            borderColor: rgba('darkBlue', 0.5),
          },
          {
            label: 'Total Cost',
            type: 'bar',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.total),
            backgroundColor: rgba('darkBlue', 0.3),
          },
        ],
      },
    },
    {
      title: 'Vercel Usage Metrics Over Time',
      subtitle: 'Tracks the usage metrics for various Vercel components over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Data Transfer GB',
            valueType: 'storage',
            data: devOps.value.flatMap((m) => m.vercel.usage.dataTransferGB),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2),
          },
          {
            label: 'Origin Transfer GB',
            valueType: 'storage',
            data: devOps.value.flatMap((m) => m.vercel.usage.originTransferGB),
            borderColor: rgba('darkRed', 0.5),
            backgroundColor: rgba('darkRed', 0.2),
          },
          {
            label: 'Edge Requests',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.edgeRequests),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2),
          },
          {
            label: 'Middleware Invocations',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.middlewareInvocations),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2),
          },
          {
            label: 'Function Invocations',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.functionInvocations),
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2),
          },
          {
            label: 'Function Duration GB Hours',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.functionDurationGBHours),
            borderColor: rgba('darkPurple', 0.5),
            backgroundColor: rgba('darkPurple', 0.2),
          },
          {
            label: 'Edge Function Executions',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.edgeFunctionExecutions),
            borderColor: rgba('darkPink', 0.5),
            backgroundColor: rgba('darkPink', 0.2),
          },
          {
            label: 'Data Cache Reads',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.dataCacheReads),
            borderColor: rgba('darkCyan', 0.5),
            backgroundColor: rgba('darkCyan', 0.2),
          },
          {
            label: 'Data Cache Writes',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.dataCacheWrites),
            borderColor: rgba('darkBlue', 0.5),
            backgroundColor: rgba('darkBlue', 0.2),
          },
          {
            label: 'Edge Config Reads',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.edgeConfigReads),
            borderColor: rgba('darkBrown', 0.5),
            backgroundColor: rgba('darkBrown', 0.2),
          },
          {
            label: 'Edge Config Writes',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.edgeConfigWrites),
            borderColor: rgba('darkBlue', 0.5),
            backgroundColor: rgba('darkBlue', 0.2),
          },
        ],
      },
    },
    {
      title: 'Function Invocations and Duration',
      subtitle: 'Tracks the number of function invocations, their duration, and costs over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Function Invocations',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.functionInvocations),
            borderColor: rgba('darkBlue', 0.5),
          },
          {
            label: 'Function Duration (GB Hours)',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.functionDurationGBHours),
            borderColor: rgba('lightGreen', 0.5),
          },
          {
            label: 'Function Invocations Cost',
            type: 'bar',
            valueType: 'currency',
            data: devOps.value.flatMap((m) => m.vercel.cost.functionInvocations),
            backgroundColor: rgba('lightRed', 0.5),
          },
          {
            label: 'Function Duration Cost',
            type: 'bar',
            valueType: 'currency',
            data: devOps.value.flatMap((m) => m.vercel.cost.functionDuration),
            backgroundColor: rgba('darkOrange', 0.5),
          },
        ],
      },
    },
    {
      title: 'Edge Function Executions and Data Cache Operations',
      subtitle:
        'Tracks the number of edge function executions, data cache reads/writes, and costs over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Edge Function Executions',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.edgeFunctionExecutions),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2),
          },
          {
            label: 'Data Cache Reads',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.dataCacheReads),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2),
          },
          {
            label: 'Data Cache Writes',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.dataCacheWrites),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2),
          },
          {
            label: 'Edge Function Executions Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((m) => m.vercel.cost.edgeFunctionExecutions),
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2),
          },
          {
            label: 'Data Cache Reads Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((m) => m.vercel.cost.dataCacheReads),
            borderColor: rgba('darkPurple', 0.5),
            backgroundColor: rgba('darkPurple', 0.2),
          },
          {
            label: 'Data Cache Writes Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((m) => m.vercel.cost.dataCacheWrites),
            borderColor: rgba('darkPink', 0.5),
            backgroundColor: rgba('darkPink', 0.2),
          },
        ],
      },
    },
    {
      title: 'Total Usage Metrics',
      subtitle: 'Provides an overview of all significant usage metrics over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Data Transfer GB',
            type: 'bar',
            valueType: 'storage',
            data: devOps.value.flatMap((m) => m.vercel.usage.dataTransferGB),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2),
          },
          {
            label: 'Origin Transfer GB',
            type: 'bar',
            valueType: 'storage',
            data: devOps.value.flatMap((m) => m.vercel.usage.originTransferGB),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2),
          },
          {
            label: 'Edge Requests',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.edgeRequests),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2),
          },
          {
            label: 'Middleware Invocations',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.middlewareInvocations),
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2),
          },
          {
            label: 'Function Invocations',
            valueType: 'number',
            data: devOps.value.flatMap((m) => m.vercel.usage.functionInvocations),
            borderColor: rgba('darkPurple', 0.5),
            backgroundColor: rgba('darkPurple', 0.2),
          },
        ],
      },
    },

    {
      title: 'Cost Breakdown by Function Type',
      subtitle: 'Shows the cost breakdown for different Vercel functions over time.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Edge Requests Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.edgeRequests),
            backgroundColor: rgba('lightBlue', 0.5),
          },
          {
            label: 'Middleware Invocations Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.middlewareInvocations),
            backgroundColor: rgba('lightGreen', 0.5),
          },
          {
            label: 'Function Invocations Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.functionInvocations),
            backgroundColor: rgba('lightRed', 0.5),
          },
          {
            label: 'Function Duration Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.functionDuration),
            backgroundColor: rgba('darkOrange', 0.5),
          },
          {
            label: 'Data Cache Reads Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.dataCacheReads),
            backgroundColor: rgba('darkPurple', 0.5),
          },
        ],
      },
    },
    {
      title: 'Data Transfer and Processing Costs',
      subtitle: 'Shows the costs associated with data transfer and processing over time.',
      type: 'line',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Data Transfer Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.dataTransfer),
            borderColor: rgba('lightBlue', 0.5),
            backgroundColor: rgba('lightBlue', 0.2),
          },
          {
            label: 'Origin Transfer Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.originTransfer),
            borderColor: rgba('lightGreen', 0.5),
            backgroundColor: rgba('lightGreen', 0.2),
          },
          {
            label: 'Function Duration Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.functionDuration),
            borderColor: rgba('lightRed', 0.5),
            backgroundColor: rgba('lightRed', 0.2),
          },
          {
            label: 'Data Cache Writes Cost',
            valueType: 'currency',
            data: devOps.value.flatMap((month) => month.vercel.cost.dataCacheWrites),
            borderColor: rgba('darkOrange', 0.5),
            backgroundColor: rgba('darkOrange', 0.2),
          },
        ],
      },
    },
  ]
})
</script>

<template>
  <FinancialCharts :charts="charts" />
</template>

<style scoped></style>
