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

const allDatasets = [
  expenses.devOps.value,
  expenses.employees.value,
  expenses.totals.value,
  expenses.office.value,
  expenses.openAI.value,
  expenses.devOps.value,
  expenses.storage.value,
  expenses.logging.value,
  expenses.digitalOcean.value,
  growth.mau.value,
  growth.revenue.value,
  growth.capital.value,
  growth.customers.value,
  growth.affiliate.value,
  growth.advertising.value,
  growth.promotion.value,
  growth.churn.value,
]
</script>

<template>
  <div class="grid grid-cols-1 p-4 md:grid-cols-2 xl:grid-cols-3 xl:p-8">
    <div
      v-for="(datasets, index) in allDatasets"
      :key="`metrics-datasets-${index}`"
      class="border-color space-y-2 rounded-lg border p-4"
    >
      <div v-for="dataset in datasets" class="pb-2 border-b border-color">
        <p class="text-xl font-semibold text-primary-950">{{ dataset.name }}</p>
        <span
          v-for="(value, index) in dataset.values"
          :key="value"
          class="text-lg text-primary-700"
        >
          M{{ index }}: {{ formatINR(value) }} -
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
