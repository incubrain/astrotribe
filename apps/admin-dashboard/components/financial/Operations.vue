<script setup lang="ts">
const { months, metrics, capital, customers, rgba } = useFinancials()

console.log('dataMetrics', metrics.value)

const charts = computed(() => {
  if (!months.value || !metrics.value) {
    return []
  }

  console.log('should not fire', metrics.value)

  return [
    {
      title: 'Balance Over Time',
      subtitle:
        "Shows the company's financial health and sustainability, indicating the ability to cover expenses.",
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'PL Margin',
            type: 'line',
            valueType: 'percentage',
            data: metrics.value.map((m) => m.profitLossMargin),
            borderColor: rgba('lightOrange', 0.5),
            backgroundColor: rgba('lightOrange', 0.5),
          },
          {
            label: 'Burn Rate',
            valueType: 'currency',
            data: capital.value.map((m) => m.burnRate),
            borderColor: rgba('darkRed', 0.5),
            backgroundColor: rgba('darkRed', 0.5),
          },
          {
            label: 'Balance End',
            valueType: 'currency',
            data: capital.value.map((m) => m.balance.end),
            borderColor: rgba('darkGreen', 0.5),
            backgroundColor: rgba('darkGreen', 0.5),
          },
        ],
      },
    },
    {
      title: 'Subscription Revenue by Plan',
      subtitle:
        'Breaks down subscription revenue by different plans, highlighting the most profitable segments.',
      type: 'bar',
      data: {
        labels: months.value,
        datasets: [
          {
            label: 'Total Conversion Rate',
            type: 'line',
            valueType: 'percentage',
            data: metrics.value.flatMap((m) => m.conversionRate.total),
            borderColor: rgba('lightPurple', 0.5),
          },
          {
            label: 'Free Users Revenue',
            valueType: 'currency',
            data: customers.value.flatMap((m) => m.free.revenue),
            backgroundColor: rgba('lightGreen', 0.5),
          },
          {
            label: 'Pro Users Revenue',
            valueType: 'currency',
            data: customers.value.flatMap((m) => m.pro.revenue),
            backgroundColor: rgba('lightGreen', 0.5),
          },
          {
            label: 'Expert Users Revenue',
            valueType: 'currency',
            data: customers.value.flatMap((m) => m.expert.revenue),
            backgroundColor: rgba('lightBlue', 0.5),
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
