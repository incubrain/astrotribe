<template>
  <div class="p-4">
    <div
      v-if="metrics"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <!-- Uptime -->
      <AdminMetricCard title="Uptime">
        <div class="text-3xl font-bold">{{ formatUptime(metrics.system.uptime) }}</div>
      </AdminMetricCard>

      {{ cpuLoad }}

      <!-- Heap Usage -->
      <AdminMetricCard title="Heap Usage">
        <div class="mb-2">Total: {{ formatBytes(metrics.system.memory.usage.heapTotal) }}</div>
        <PrimeProgressBar
          :value="heapUsagePercentage"
          :showValue="true"
        />
        <PrimeProgressBar
          :value="cpuUsage"
          :showValue="true"
        />
        <div class="mt-2">Used: {{ formatBytes(metrics.system.memory.usage.heapUsed) }}</div>
      </AdminMetricCard>

      <!-- Memory -->
      <AdminMetricCard title="Memory Usage">
        <div class="text-xl font-bold">
          External {{ formatBytes(metrics.system.memory.usage.external) }}
        </div>
        <div class="text-xl font-bold">
          Heap Used: {{ formatBytes(metrics.system.memory.usage.heapUsed) }}
        </div>
        <div class="text-xl font-bold">
          Heap Total: {{ formatBytes(metrics.system.memory.usage.heapTotal) }}
        </div>
      </AdminMetricCard>  
    </div>
  </div>
</template>

<script setup lang="ts">
const metrics = ref(null)
let eventSource: EventSource | null = null

const connectToMetrics = () => {
  const metricsUrl = 'http://localhost:8080/metrics?maxCount=10&maxAge=600000'

  eventSource = new EventSource(metricsUrl)

  eventSource.onmessage = (event) => {
    metrics.value = JSON.parse(event.data)
  }

  eventSource.onerror = (error) => {
    console.error('EventSource failed:', error)
    eventSource?.close()
  }
}

onMounted(() => {
  connectToMetrics()
})

onUnmounted(() => {
  if (eventSource) {
    eventSource.close()
  }
})

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${days}d ${hours}h ${minutes}m`
}

const formatBytes = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

const cpuUsage = computed(() => {
  return (
    metrics.value?.system.cpu.total.reduce((acc: number, core: any) => {
      console.log('metrics', core, acc)
      const total = core.times.user + core.times.nice + core.times.sys + core.times.idle
      const usage = core.times.user + core.times.nice + core.times.sys
      acc += Math.round((usage / total) * 100)
      return acc
    }, 0) / metrics.value.system.cpu.total.length
  )
})

const heapUsagePercentage = computed(() => {
  return (
    (metrics.value.system.memory.usage.heapUsed / metrics.value.system.memory.usage.heapTotal) * 100
  )
})
</script>

<style scoped>
/* Add any additional styles here */
</style>
