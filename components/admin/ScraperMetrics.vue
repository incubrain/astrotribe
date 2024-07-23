<template>
  <div class="p-4">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="metric in metrics"
        :key="metric.title"
        class="rounded-md bg-white p-4 shadow-md"
      >
        <h2 class="mb-2 text-xl font-bold">{{ metric.title }}</h2>
        <p class="text-2xl">{{ metric.value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'

interface Metric {
  title: string
  value: number | string
}

const metrics = ref<Metric[]>([])

const fetchMetrics = async () => {
  try {
    const { data: metrics } = await useFetch('/scraper-metrics')

    if (!metrics) {
      console.log('no metrics returned')
      return
    }

    const systemMetrics = [
      { title: 'Uptime', value: `${Math.round(metrics.system.uptime / 60 / 60)} hours` },
      {
        title: 'Total Memory',
        value: `${(metrics.system.memory.total / 1024 / 1024 / 1024).toFixed(2)} GB`
      },
      {
        title: 'Free Memory',
        value: `${(metrics.system.memory.free / 1024 / 1024 / 1024).toFixed(2)} GB`
      },
      {
        title: 'Memory Usage (RSS)',
        value: `${(metrics.system.memory.usage.rss / 1024 / 1024).toFixed(2)} MB`
      },
      {
        title: 'Memory Usage (Heap Used)',
        value: `${(metrics.system.memory.usage.heapUsed / 1024 / 1024).toFixed(2)} MB`
      },
      {
        title: 'Memory Usage (Heap Total)',
        value: `${(metrics.system.memory.usage.heapTotal / 1024 / 1024).toFixed(2)} MB`
      },
      {
        title: 'CPU Usage (User)',
        value: `${(metrics.system.cpu.usage.user / 1000).toFixed(2)} ms`
      },
      {
        title: 'CPU Usage (System)',
        value: `${(metrics.system.cpu.usage.system / 1000).toFixed(2)} ms`
      },
      { title: 'Load Average (1m)', value: metrics.system.cpu.load[0].toFixed(2) },
      { title: 'Load Average (5m)', value: metrics.system.cpu.load[1].toFixed(2) },
      { title: 'Load Average (15m)', value: metrics.system.cpu.load[2].toFixed(2) }
    ]

    const queueMetrics = [
      { title: 'Completed Jobs', value: metrics.queue.completed_count },
      { title: 'Failed Jobs', value: metrics.queue.failed_count },
      { title: 'Active Jobs', value: metrics.queue.active_count },
      { title: 'Delayed Jobs', value: metrics.queue.delayed_count },
      { title: 'Waiting Jobs', value: metrics.queue.waiting_count }
    ]

    metrics.value = [...systemMetrics, ...queueMetrics]
  } catch (error) {
    console.error('Error fetching metrics:', error)
  }
}

onMounted(() => {
  fetchMetrics()
  useIntervalFn(fetchMetrics, 3600000)
})
</script>

<style scoped>
/* Tailwind CSS should handle most of the styling */
</style>
