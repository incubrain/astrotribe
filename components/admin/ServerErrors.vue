<template>
  <div class="flex h-screen flex-col p-4">
    <BaseResizable
      :slots="slotItems"
      class="flex flex-1"
    >
      <template #logStream>
        <div class="flex h-full flex-col">
          <div class="flex gap-4 p-4 items-center">
            <h2 class="mb-4 text-2xl font-bold">{{ logStream.length }} Error Logs</h2>
            <PrimeButton
              @click="refreshData"
              label="Refresh"
            />
          </div>
          <AdminErrorLogViewer
            v-if="logStream.length"
            :logs="logStream"
            class="no-scrollbar flex-grow overflow-auto"
          />
          <p
            v-else-if="logStreamError"
            class="text-red-500"
            >{{ logStreamError }}</p
          >
          <p v-else>No logs available</p>
        </div>
      </template>
      <template #errorMetrics>
        <div
          class="h-full overflow-auto"
          v-if="errorReport"
        >
          <h2 class="mb-4 text-2xl font-bold">Error Metrics</h2>
          <PrimeCard class="mb-4">
            <template #title>Total Errors</template>
            <template #content>
              <div class="text-4xl font-bold">{{ errorReport.totalErrors }}</div>
            </template>
          </PrimeCard>
          <PrimeCard class="mb-4">
            <template #title>Domain Distribution</template>
            <template #content>
              <PrimeChart
                type="pie"
                :data="domainChartData"
                :options="chartOptions"
              />
            </template>
          </PrimeCard>
          <PrimeCard class="mb-4">
            <template #title>Severity Distribution</template>
            <template #content>
              <PrimeChart
                type="bar"
                :data="severityChartData"
                :options="chartOptions"
              />
            </template>
          </PrimeCard>
        </div>
        <p
          v-else-if="errorReportError"
          class="text-red-500"
          >{{ errorReportError }}</p
        >
        <p v-else>No error report available</p>
      </template>
    </BaseResizable>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'

const slotItems = ref({
  '1': 'logStream',
  '2': 'errorMetrics'
})
const errorReport = ref(null)
const logStream = ref('')
const errorReportError = ref('')
const logStreamError = ref('')

const domainChartData = computed(() => ({
  labels: Object.keys(errorReport.value.domainDistribution || {}),
  datasets: [
    {
      data: Object.values(errorReport.value.domainDistribution || {}),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }
  ]
}))

const severityChartData = computed(() => ({
  labels: Object.keys(errorReport.value.severityDistribution || {}),
  datasets: [
    {
      label: 'Errors',
      data: Object.values(errorReport.value.severityDistribution || {}),
      backgroundColor: '#36A2EB'
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const fetchErrorReport = async () => {
  try {
    const response = await $fetch('/api/admin/error/report')
    errorReport.value = response.data
    errorReportError.value = ''
  } catch (error) {
    console.error('Failed to fetch error report', error)
    errorReportError.value = 'Failed to load error report. Please try again later.'
    errorReport.value = null
  }
}

const fetchErrorLogs = async () => {
  try {
    const response = await $fetch('/api/admin/error/logs')
    logStream.value = response.data
    logStreamError.value = ''
  } catch (error) {
    console.error('Failed to fetch error logs', error)
    logStreamError.value = 'Failed to load error logs. Please try again later.'
    logStream.value = ''
  }
}

const refreshData = async () => {
  await Promise.allSettled([fetchErrorLogs(), fetchErrorReport()])
}

onMounted(refreshData)
</script>

<style scoped>
/* Add any additional styles here */
</style>
