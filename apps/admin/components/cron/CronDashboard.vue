<!-- components/JobsMonitor.vue -->
<template>
  <div class="space-y-8">
    <!-- Stats Overview -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <CronMetricCard
        v-for="(stat, key) in statsCards"
        :key="key"
        v-bind="stat"
      />
    </div>

    <!-- Main Content -->
    <div class="space-y-8">
      <CronJobsTable
        :jobs="jobStats"
        :loading="loading"
        @view-details="showJobDetails"
      />

      <CronSchedulesTable
        :schedules="schedules"
        :loading="loading"
        @edit-schedule="editSchedule"
        @toggle-schedule="toggleSchedule"
        @trigger-job="triggerJob"
      />
    </div>

    <!-- Modals -->
    <CronDetails
      v-model:visible="showDetails"
      :job="selectedJob"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const store = useCronMetricsStore()
const { loading, jobStats, schedules, overallStats } = storeToRefs(store)

const showDetails = ref(false)
const selectedJob = ref(null)

const notify = useNotification()

const statsCards = computed(() => ({
  totalJobs: {
    title: 'Total Jobs',
    value: overallStats.value.totalJobs,
    format: 'number',
    colorClass: 'text-blue-600',
  },
  totalRuns: {
    title: 'Total Executions',
    value: overallStats.value.totalRuns,
    format: 'number',
    colorClass: 'text-green-600',
  },
  successRate: {
    title: 'Success Rate',
    value: overallStats.value.successRate,
    format: 'percentage',
    colorClass: overallStats.value.successRate > 90 ? 'text-green-600' : 'text-yellow-600',
  },
  failedJobs: {
    title: 'Failed Jobs',
    value: overallStats.value.failedJobs,
    format: 'number',
    colorClass: 'text-red-600',
  },
}))

const showJobDetails = (job: any) => {
  selectedJob.value = job
  showDetails.value = true
}

const editSchedule = (schedule: any) => {
  // Implement schedule editing
}

const toggleSchedule = async (schedule: any) => {
  // Implement schedule toggling
}

const triggerJob = async (name: string, data?: any) => {
  await store.triggerSchedule(name, data)
}

onMounted(async () => {
  await store.fetchMetrics()
})
</script>
