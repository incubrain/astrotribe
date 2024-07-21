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
  customers,
  totals,
  rgba,
  formatNumber
} = useFinancials()

const allDatasets = [
  { name: 'Customers', data: customers.value },
  { name: 'Metrics', data: metrics.value },
  { name: 'Storage', data: storage.value },
  { name: 'OpenAI', data: openAI.value },
  { name: 'Analytics', data: analytics.value },
  { name: 'Employees', data: employees.value },
  { name: 'Capital', data: capital.value },
  { name: 'Advertising', data: advertising.value },
  { name: 'Logging', data: logging.value },
  { name: 'Payments', data: payments.value },
  { name: 'Totals', data: totals.value }
]

function getType(value: any): string {
  return Object.prototype.toString.call(value).slice(8, -1)
}

function traverseObject(
  obj: any,
  path: string[] = []
): Array<{ path: string; value: any; type: string }> {
  let result: Array<{ path: string; value: any; type: string }> = []
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newPath = path.concat(key)
      const value = obj[key]
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result = result.concat(traverseObject(value, newPath))
      } else {
        result.push({
          path: newPath.join('.'),
          value: value,
          type: getType(value)
        })
      }
    }
  }
  return result
}

const columnsCount = 3
const columns = computed(() => {
  const result = Array.from({ length: columnsCount }, () => [])
  allDatasets.forEach((dataset, index) => {
    result[index % columnsCount].push(dataset)
  })
  return result
})

const expandedIndex = ref(-1)
</script>

<template>
  <div class="grid grid-cols-1 gap-2 p-4 md:grid-cols-2 md:gap-4 xl:grid-cols-3 xl:p-8">
    <PrimeAccordion
      v-for="(column, columnIndex) in columns"
      :key="`masonry-column-${columnIndex}`"
      class="space-y-4"
      :value="['0']"
      multiple
    >
      <PrimeAccordionPanel
        v-for="(dataset, index) in column"
        :key="`metrics-dataset-${columnIndex}-${index}`"
        class="border-color rounded-lg border"
        :value="`${index}`"
      >
        <PrimeAccordionHeader>
          <h2 class="text-2xl font-bold text-primary-950">{{ dataset.name }}</h2>
        </PrimeAccordionHeader>
        <PrimeAccordionContent>
          <div
            v-for="(entry, idx) in traverseObject(dataset.data[0])"
            :key="`dataset-${dataset.name}-${idx}`"
            class="border-color border-b pb-2 last:border-b-0 last:pb-0"
          >
            <p class="text-xl font-semibold text-primary-950">{{ entry.path }}</p>
            <span class="text-lg text-primary-700">
              Type: {{ entry.type }} | Value {{ formatNumber(entry.value) }}
            </span>
          </div>
        </PrimeAccordionContent>
      </PrimeAccordionPanel>
    </PrimeAccordion>
  </div>
</template>

<style scoped></style>
