<script setup lang="ts">
const store = useServerAnalyticsStore()
const {
  jobMetrics,
  spiderMetrics,
  paginationMetrics,
  blogPostScraperMetrics,
  resourceAnalytics,
  pageToMarkdownAnalytics,
  availableMetrics,
  isConnected,
  haveMetrics,
} = storeToRefs(store)

interface FlatMetric {
  key: string
  value: any
  path: string[]
}

function flattenMetrics(obj: any, prefix: string[] = []): FlatMetric[] {
  let flattened: FlatMetric[] = []

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      const newPrefix = [...prefix, key]

      if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        flattened = flattened.concat(flattenMetrics(value, newPrefix))
      }
      else {
        flattened.push({
          key: key,
          value: value,
          path: newPrefix,
        })
      }
    }
  }

  return flattened
}

const allMetrics = computed(() => ({
  jobMetrics: jobMetrics.value,
  spiderMetrics: spiderMetrics.value,
  paginationMetrics: paginationMetrics.value,
  blogPostScraperMetrics: blogPostScraperMetrics.value,
  resourceAnalytics: resourceAnalytics.value,
  pageToMarkdownAnalytics: pageToMarkdownAnalytics.value,
}))

const flatMetrics = computed<FlatMetric[]>(() => {
  return flattenMetrics(allMetrics.value)
})

const metricCategories = computed(() => {
  return [...new Set(flatMetrics.value.map(metric => metric.path[0]))]
})

function getCategoryMetrics(category: string): FlatMetric[] {
  return flatMetrics.value.filter(metric => metric.path[0] === category)
}

function formatCategoryName(name: string): string {
  return name.replace(/([A-Z])/g, ' $1').trim()
}

function formatMetricName(name: string): string {
  return name.replace(/([A-Z])/g, ' $1').trim()
}

function formatMetricValue(value: any): string {
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  else if (value instanceof Date) {
    return value.toLocaleString()
  }
  else {
    return String(value)
  }
}
</script>

<template>
  <div class="metrics-display">
    <div
      v-if="isConnected"
      class="text-green-500"
    >
      Connected
    </div>
    <div
      v-else
      class="text-red-500"
    >
      Disconnected
    </div>
    {{ allMetrics }}
    <div
      v-if="haveMetrics"
      class="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-8"
    >
      <div
        v-for="category in metricCategories"
        :key="category"
        class="mb-8"
      >
        <h2 class="mb-4 text-2xl font-semibold capitalize">
          {{ formatCategoryName(category) }}
        </h2>
        <PrimeCard class="shadow-md">
          <template #title>
            {{ formatCategoryName(category) }}
          </template>
          <template #content>
            <div
              v-for="metric in getCategoryMetrics(category)"
              :key="metric.path.join('.')"
              class="mb-2"
            >
              <strong>{{ formatMetricName(metric.key) }}:</strong>
              {{ formatMetricValue(metric.value) }}
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>
