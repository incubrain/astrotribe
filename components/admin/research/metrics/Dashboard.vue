<template>
  <div class="p-4">
    <h2 class="mb-4 text-2xl font-bold">Metrics Dashboard</h2>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:gap-8">
      <Chart
        :chart-type="'pie'"
        :chart-data="chartData"
      />
      <Chart :chart-type="'doughnut'" />
      <!-- <Chart :chartType="'line'" />
      <Chart :chartType="'bar'" />
      <Chart :chartType="'bar'" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const researchStore = useResearchStore()
const rows = computed(() => researchStore.lastNRows.research_metrics_monthly_totals)

onMounted(async () => {
  await researchStore.fetchNRows({ tableName: 'research_metrics_monthly_totals', limit: 12 })
})

const chartData = computed(() => ({
  labels: [
    'Total Chunks',
    'Total Citations',
    'Total Figures',
    'Total Math',
    'Total Tables',
    'Total Notes',
    'Total Tools',
    'Total Authors'
  ],
  datasets: [
    {
      data: rows.value.length
        ? [
            rows.value.reduce((acc, item) => acc + item.total_chunks, 0),
            rows.value.reduce((acc, item) => acc + item.total_citations, 0),
            rows.value.reduce((acc, item) => acc + item.total_figures, 0),
            rows.value.reduce((acc, item) => acc + item.total_math, 0),
            rows.value.reduce((acc, item) => acc + item.total_tables, 0),
            rows.value.reduce((acc, item) => acc + item.total_notes, 0),
            rows.value.reduce((acc, item) => acc + item.total_tools, 0),
            rows.value.reduce((acc, item) => acc + item.total_authors, 0)
          ]
        : [0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#FF9F40',
        '#4BC0C0',
        '#9966FF',
        '#FF6384',
        '#36A2EB'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#FF9F40',
        '#4BC0C0',
        '#9966FF',
        '#FF6384',
        '#36A2EB'
      ]
    }
  ]
}))
</script>

<style scoped></style>
