// components/JobMetrics/JobDetails.vue
<template>
  <PrimeDialog
    v-model:visible="isVisible"
    :modal="true"
    :closable="true"
    :style="{ width: '80vw' }"
  >
    <template #header>
      <div class="flex items-center">
        <h3 class="text-xl font-bold">{{ job.name }}</h3>
        <PrimeTag
          v-if="job.circuitBreaker"
          :severity="getCircuitBreakerSeverity(job.circuitBreaker)"
          class="ml-2"
        >
          {{ job.circuitBreaker.state }}
        </PrimeTag>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Performance Metrics -->
      <section>
        <h4 class="text-lg font-semibold mb-4">Performance Metrics</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PrimeCard>
            <template #title>Processing Rate</template>
            <template #content>
              <div class="text-2xl font-bold">
                {{ formatNumber(job.performance?.itemsPerSecond || 0) }}/sec
              </div>
            </template>
          </PrimeCard>

          <PrimeCard>
            <template #title>Avg Processing Time</template>
            <template #content>
              <div class="text-2xl font-bold">
                {{ formatDuration(job.performance?.avgProcessingTime || 0) }}
              </div>
            </template>
          </PrimeCard>

          <PrimeCard>
            <template #title>Memory Usage</template>
            <template #content>
              <div class="text-2xl font-bold">
                {{ formatBytes(job.performance?.peakMemoryUsage || 0) }}
              </div>
            </template>
          </PrimeCard>
        </div>
      </section>

      <!-- Execution History -->
      <section>
        <h4 class="text-lg font-semibold mb-4">Recent Executions</h4>
        <PrimeDataTable
          :value="recentExecutions"
          :rows="5"
          :paginator="true"
          class="p-datatable-sm"
        >
          <PrimeColumn
            field="started_at"
            header="Start Time"
          >
            <template #body="{ data }">
              {{ formatDate(data.started_at) }}
            </template>
          </PrimeColumn>

          <PrimeColumn
            field="duration_ms"
            header="Duration"
          >
            <template #body="{ data }">
              {{ formatDuration(data.duration_ms) }}
            </template>
          </PrimeColumn>

          <PrimeColumn
            field="items_processed"
            header="Items"
          >
            <template #body="{ data }">
              {{ data.items_processed || 0 }}
            </template>
          </PrimeColumn>

          <PrimeColumn
            field="status"
            header="Status"
          >
            <template #body="{ data }">
              <PrimeTag
                :value="data.status"
                :severity="getStatusSeverity(data)"
              />
            </template>
          </PrimeColumn>

          <PrimeColumn
            field="error"
            header="Error"
          >
            <template #body="{ data }">
              <span
                v-if="data.error_message"
                class="text-red-500"
              >
                {{ data.error_message }}
              </span>
              <span v-else>-</span>
            </template>
          </PrimeColumn>
        </PrimeDataTable>
      </section>

      <!-- Circuit Breaker Status -->
      <section v-if="job.circuitBreaker">
        <h4 class="text-lg font-semibold mb-4">Circuit Breaker Status</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-gray-100 p-4 rounded">
            <div class="text-sm text-gray-600">State</div>
            <div class="text-lg font-semibold">{{ job.circuitBreaker.state }}</div>
          </div>
          <div class="bg-gray-100 p-4 rounded">
            <div class="text-sm text-gray-600">Failures</div>
            <div class="text-lg font-semibold">{{ job.circuitBreaker.failures }}</div>
          </div>
          <div class="bg-gray-100 p-4 rounded">
            <div class="text-sm text-gray-600">Last Failure</div>
            <div class="text-lg font-semibold">{{
              formatDate(job.circuitBreaker.lastFailure)
            }}</div>
          </div>
          <div class="bg-gray-100 p-4 rounded">
            <div class="text-sm text-gray-600">Recovery Attempts</div>
            <div class="text-lg font-semibold">{{ job.circuitBreaker.recoveryAttempts }}</div>
          </div>
        </div>
      </section>
    </div>
  </PrimeDialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  job: any
}>()

const isVisible = ref(props.visible)

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const recentExecutions = computed(() => {
  // You'll need to implement this based on your data structure
  return []
})

async function viewJobDetails(schedule: any) {
  // Implementation for viewing job details
  // Could open a dialog or navigate to details page
}

const formatValue = (value: number) => {
  if (typeof value === 'number') {
    if (value % 1 === 0) return value
    return value.toFixed(1) + '%'
  }
  return value
}

const roundToN = (value: number, n: number) => {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n)
}

const formatBytes = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${roundToN(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`
}

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ${seconds % 60}s`
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const getJobStatus = (job: any) => {
  if (job.activeRuns > 0) return 'Running'
  if (job.totalRuns === 0) return 'Never Run'
  if (job.successRate > 90) return 'Healthy'
  if (job.successRate > 70) return 'Warning'
  return 'Critical'
}

const getStatusSeverity = (job: any) => {
  if (job.activeRuns > 0) return 'info'
  if (job.totalRuns === 0) return 'secondary'
  if (job.successRate > 90) return 'success'
  if (job.successRate > 70) return 'warning'
  return 'danger'
}

const formatNumber = (value: number) => {
  return value.toLocaleString()
}

const getCircuitBreakerSeverity = (cb: any) => {
  if (cb.state === 'open') return 'danger'
  if (cb.state === 'half-open') return 'warning'
  return 'success'
}
</script>
