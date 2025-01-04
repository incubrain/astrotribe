<template>
  <PrimeDataTable
    :value="jobs"
    :paginator="true"
    :rows="10"
    :loading="loading"
    stripedRows
    class="p-datatable-sm"
    :filters="filters"
    @filter="onFilter"
  >
    <template #header>
      <div class="flex justify-between">
        <h3 class="text-xl font-semibold">Job Metrics</h3>
        <PrimeInputText
          v-model="filters.global.value"
          placeholder="Search jobs..."
        />
      </div>
    </template>

    <template #empty> No jobs found </template>
    <template #loading> Loading jobs data... </template>

    <PrimeColumn
      field="name"
      header="Job Name"
      sortable
    >
      <template #body="{ data }">
        <div class="flex items-center">
          <div class="font-semibold">{{ data.name }}</div>
          <PrimeTag
            v-if="data.circuitBreaker"
            :severity="getCircuitBreakerSeverity(data.circuitBreaker)"
            class="ml-2"
          >
            {{ data.circuitBreaker.state }}
          </PrimeTag>
        </div>
      </template>
    </PrimeColumn>

    <PrimeColumn
      field="totalRuns"
      header="Executions"
      sortable
    >
      <template #body="{ data }">
        <div class="flex flex-col">
          <span>{{ data.totalRuns }}</span>
          <small class="text-gray-500"> {{ data.successCount }} successful </small>
        </div>
      </template>
    </PrimeColumn>

    <PrimeColumn
      field="successRate"
      header="Success Rate"
      sortable
    >
      <template #body="{ data }">
        <PrimeProgressBar
          :value="data.successRate"
          :showValue="true"
          :class="getSuccessRateClass(data.successRate)"
        />
      </template>
    </PrimeColumn>

    <PrimeColumn
      field="avgDuration"
      header="Avg. Duration"
      sortable
    >
      <template #body="{ data }">
        <div class="flex flex-col">
          <span>{{ formatDuration(data.avgDuration) }}</span>
          <small
            v-if="data.performance"
            class="text-gray-500"
          >
            {{ data.performance.itemsPerSecond.toFixed(1) }} items/sec
          </small>
        </div>
      </template>
    </PrimeColumn>

    <PrimeColumn
      field="lastRun"
      header="Last Run"
      sortable
    >
      <template #body="{ data }">
        <div class="flex flex-col">
          <span>{{ formatDate(data.lastRun) }}</span>
          <small class="text-gray-500">
            {{ getTimeAgo(data.lastRun) }}
          </small>
        </div>
      </template>
    </PrimeColumn>

    <PrimeColumn
      field="status"
      header="Status"
    >
      <template #body="{ data }">
        <PrimeTag
          :value="getJobStatus(data)"
          :severity="getStatusSeverity(data)"
        />
      </template>
    </PrimeColumn>

    <PrimeColumn header="Actions">
      <template #body="{ data }">
        <div class="flex gap-2">
          <PrimeButton
            v-tooltip.top="'Run Now'"
            severity="success"
            rounded
            size="small"
            :loading="triggeringJob === data.name"
            @click="$emit('trigger-job', data.name)"
          >
            <Icon name="mdi:play" />
          </PrimeButton>
          <PrimeButton
            v-tooltip.top="'View Details'"
            severity="info"
            rounded
            size="small"
            @click="$emit('view-details', data)"
          >
            <Icon name="mdi:eye" />
          </PrimeButton>
        </div>
      </template>
    </PrimeColumn>
  </PrimeDataTable>
</template>

<script setup lang="ts">
const props = defineProps<{
  jobs: any[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'view-details', job: any): void
  (e: 'trigger-job', name: string): void
}>()

const filters = ref({
  global: { value: null, matchMode: 'contains' },
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const onFilter = (e: any) => {
  filters.value = e.filters
}

const getTimeAgo = (date: string) => {
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return `${seconds} seconds ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  return `${days} days ago`
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

const triggeringJob = ref<string | null>(null)

const getCircuitBreakerSeverity = (cb: any) => {
  if (cb.state === 'open') return 'danger'
  if (cb.state === 'half-open') return 'warning'
  return 'success'
}

const getSuccessRateClass = (rate: number) => ({
  'bg-green-500': rate > 90,
  'bg-yellow-500': rate <= 90 && rate > 70,
  'bg-red-500': rate <= 70,
})

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ${seconds % 60}s`
}
</script>
