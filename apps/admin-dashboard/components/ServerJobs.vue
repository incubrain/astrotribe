<script setup lang="ts">
const store = useServerAnalyticsStore()
const { company, news_links, performance, queue, isConnected, haveMetrics } = storeToRefs(store)

interface FlatMetric {
  key: string
  value: any
  path: string[]
}

function formatMetricValue(value: any, key: string): string {
  if (typeof value === 'number') {
    switch (key) {
      case 'cpu_usage':
      case 'memory_usage':
        return `${value.toFixed(2)}%`
      case 'free_memory':
      case 'total_memory':
      case 'heap_used':
      case 'heap_total':
      case 'external_memory':
      case 'heap_limit':
        return formatBytes(value)
      case 'load_average_1m':
      case 'load_average_5m':
      case 'load_average_15m':
        return value.toFixed(2)
      case 'uptime':
        return formatUptime(value)
      default:
        return value.toLocaleString()
    }
  } else if (value instanceof Date) {
    return value.toLocaleString()
  } else {
    return String(value)
  }
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024
    i++
  }
  return `${bytes.toFixed(2)} ${units[i]}`
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24))
  const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`)

  return parts.join(' ')
}

function flattenMetrics(obj: any, prefix: string[] = []): FlatMetric[] {
  let flattened: FlatMetric[] = []

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      const newPrefix = [...prefix, key]

      if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        flattened = flattened.concat(flattenMetrics(value, newPrefix))
      } else {
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
  company: company.value,
  news_links: news_links.value,
  performance: performance.value,
  queue: queue.value,
}))

const flatMetrics = computed<FlatMetric[]>(() => {
  return flattenMetrics(allMetrics.value)
})

const metricCategories = computed(() => {
  return [...new Set(flatMetrics.value.map((metric) => metric.path[0]))]
})

function getCategoryMetrics(category: string): FlatMetric[] {
  return flatMetrics.value.filter((metric) => metric.path[0] === category)
}

function formatCategoryName(name: string): string {
  return name.replace(/([A-Z])/g, ' $1').trim()
}

function formatMetricName(name: string): string {
  return name.replace(/([A-Z])/g, ' $1').trim()
}
</script>

<template>
  <div class="metrics-display flex flex-col justify-start items-start gap-4">
    <div
      v-if="isConnected"
      class="text-green-500 p-2 rounded-md border border-green-500"
    >
      Scraper Connected
    </div>
    <div
      v-else
      class="text-red-500 p-2 rounded-md border border-red-500"
    >
      Disconnected
    </div>
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
              {{ formatMetricValue(metric.value, metric.key) }}
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>
