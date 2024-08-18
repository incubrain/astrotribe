<script setup lang="ts">
import { useServerAnalytics } from '@/composables/useServerAnalytics'

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
      } else {
        flattened.push({
          key: key,
          value: value,
          path: newPrefix
        })
      }
    }
  }

  return flattened
}

const {
  metrics,
  availableMetrics,
  isConnected,
  connectWebSocket,
  disconnectWebSocket,
  subscribeToMetrics,
  unsubscribeFromMetrics
} = useServerAnalytics()

onMounted(() => {
  console.log('Component mounted, connecting WebSocket...')
  connectWebSocket()
  // Subscribe to initial metrics if needed
  subscribeToMetrics(['jobMetrics', 'spiderMetrics'])
})

onUnmounted(() => {
  console.log('Component unmounted, disconnecting WebSocket...')
  disconnectWebSocket()
})

const flatMetrics = computed<FlatMetric[]>(() => {
  console.log('Computing flatMetrics with:', metrics)
  return flattenMetrics(metrics)
})

// Add a watcher for metrics
watch(
  metrics,
  (newMetrics) => {
    console.log('Metrics updated:', newMetrics)
  },
  { deep: true }
)

const formatPath = (path: string[]): string => {
  return path
    .map((segment) => segment.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()))
    .join(' > ')
}

const formatValue = (value: any): string => {
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  if (value instanceof Date) {
    return value.toLocaleString()
  }
  return String(value)
}

const getValueClass = (value: any): string => {
  if (typeof value === 'number') {
    return 'text-blue-600 font-semibold'
  }
  if (value instanceof Date) {
    return 'text-green-600 italic'
  }
  return 'text-gray-800'
}
</script>

<template>
  <div class="metrics-display">
    {{ isConnected ? 'Connected' : 'Disconnected' }}

    {{ metrics }}
    <PrimeDataTable
      :value="flatMetrics"
      :paginator="true"
      :rows="100"
      responsive-layout="scroll"
    >
      <PrimeColumn
        field="path"
        header="Metric"
        :sortable="true"
      >
        <template #body="slotProps">
          {{ formatPath(slotProps.data.path) }}
        </template>
      </PrimeColumn>
      <PrimeColumn
        field="value"
        header="Value"
        :sortable="true"
      >
        <template #body="slotProps">
          <span :class="getValueClass(slotProps.data.value)">
            {{ formatValue(slotProps.data.value) }}
          </span>
        </template>
      </PrimeColumn>
    </PrimeDataTable>
  </div>
</template>
