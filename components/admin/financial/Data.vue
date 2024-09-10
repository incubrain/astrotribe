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
  formatNumber,
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
  { name: 'Totals', data: totals.value },
]

function getType(value: any): string {
  return Object.prototype.toString.call(value).slice(8, -1)
}

function traverseObject(
  obj: any,
): Record<string, Array<{ path: string, value: any, type: string }>> {
  const result: Record<string, Array<{ path: string, value: any, type: string }>> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      if (
        Array.isArray(value)
        && value.length > 0
        && typeof value[0] === 'object'
        && value[0] !== null
      ) {
        const childResults = traverseNestedObject(value[0], key)
        result[key] = childResults
      } else if (typeof value === 'object' && value !== null) {
        const childResults = traverseNestedObject(value, key)
        result[key] = childResults
      } else {
        if (!result['Root']) {
          result['Root'] = []
        }
        result['Root'].push({
          path: key,
          value: value,
          type: getType(value),
        })
      }
    }
  }
  return result
}

function traverseNestedObject(
  obj: any,
  parentKey: string,
): Array<{ path: string, value: any, type: string }> {
  let result: Array<{ path: string, value: any, type: string }> = []
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newPath = `${parentKey}.${key}`
      const value = obj[key]
      if (
        Array.isArray(value)
        && value.length > 0
        && typeof value[0] === 'object'
        && value[0] !== null
      ) {
        result = result.concat(traverseNestedObject(value[0], newPath))
      } else if (typeof value === 'object' && value !== null) {
        result = result.concat(traverseNestedObject(value, newPath))
      } else {
        result.push({
          path: newPath,
          value: value,
          type: getType(value),
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

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    () => {
      console.log(`Copied to clipboard: ${text}`)
    },
    (err) => {
      console.error('Could not copy text: ', err)
    },
  )
}
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
        class="border-color rounded-lg border p-4"
        :value="`${index}`"
      >
        <PrimeAccordionHeader>
          <h2 class="text-2xl font-bold text-primary-600">
            {{ dataset.name }}
          </h2>
        </PrimeAccordionHeader>
        <PrimeAccordionContent v-if="!!dataset.data">
          <div
            v-for="(group, parent) in traverseObject(dataset.data[0])"
            :key="`group-${dataset.name}-${parent}`"
            class="border-color border-b pb-4 pt-2 last:border-b-0 last:pb-0"
          >
            <p class="text-xl font-semibold text-primary-600">
              {{ parent || 'Total' }}
            </p>
            <div
              v-for="(entry, idx) in group"
              :key="`entry-${dataset.name}-${idx}`"
              class="flex items-center justify-between"
            >
              <span class="text-sm">
                <strong class="font-semibold">
                  {{ entry.path.replace(`${entry.path.split('.')[0]}.`, '') }} -
                </strong>
                {{ entry.type }} | {{ formatNumber(entry.value) }}
              </span>
              <button
                class=""
                @click="copyToClipboard(entry.path)"
              >
                <Icon
                  class="h-4 w-4"
                  name="mdi:content-copy"
                />
              </button>
            </div>
          </div>
        </PrimeAccordionContent>
      </PrimeAccordionPanel>
    </PrimeAccordion>
  </div>
</template>

<style scoped></style>
