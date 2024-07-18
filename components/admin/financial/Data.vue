<script setup lang="ts">
const {
  advertising,
  analytics,
  capital,
  employees,
  logging,
  metrics,
  openAI,
  payments,
  storage,
  totals,
  formatINR,
  filteredData,
  toggleChartRange,
  rgba
} = useFinancials()

const allDatasets = [
  advertising.value,
  analytics.value,
  capital.value,
  employees.value,
  logging.value,
  metrics.value,
  openAI.value,
  payments.value,
  storage.value,
  totals.value
]
</script>

<template>
  <div class="grid grid-cols-1 p-4 md:grid-cols-2 xl:grid-cols-3 xl:p-8">
    <div
      v-for="(datasets, index) in allDatasets"
      :key="`metrics-datasets-${index}`"
      class="border-color space-y-2 rounded-lg border p-4"
    >
      <div
        v-for="dataset in datasets"
        class="border-color border-b pb-2"
      >
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
