<script setup lang="ts">
import { defineStore } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

const useErrorDashboard = defineStore('errorDashboard', () => {
  const errorReport = ref(null)
  const errorTrends = ref([])
  const errorLogs = ref([])
  const totalLogs = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const pageSize = ref(50)
  const selectedDate = ref(new Date())
  const loading = ref(false)
  const error = ref(null)

  const errorsByDomain = computed(() => errorReport.value?.domainDistribution || {})
  const errorsBySeverity = computed(() => errorReport.value?.severityDistribution || {})
  const errorReduction = computed(() => errorReport.value?.errorReduction || 0)
  const mostFrequentErrors = computed(
    () => errorReport.value?.mostFrequentErrors?.slice(0, 5) || []
  )
  const errorsByHour = computed(() => {
    return (
      errorLogs.value?.reduce((acc, log) => {
        const hour = new Date(log.timestamp).getHours()
        acc[hour] = (acc[hour] || 0) + 1
        return acc
      }, {}) || {}
    )
  })
  const averageErrorsPerDay = computed(() => {
    const trends = errorReport.value?.historicalTrends?.errorTrends || []
    if (trends.length === 0) return 0
    const total = trends.reduce((sum, day) => sum + day.totalErrors, 0)
    return total / trends.length
  })

  async function fetchErrorReport() {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch('/api/admin/error/report', {
        query: { date: selectedDate.value.toISOString() }
      })
      if (!response || !response.data) {
        throw new Error('No data returned from the server')
      }
      errorReport.value = response.data
    } catch (err) {
      console.error('Failed to fetch error report', err)
      error.value = 'Failed to load error report. Please try again later.'
      errorReport.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchErrorTrends() {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch('/api/admin/error/trends', {
        query: { date: selectedDate.value.toISOString() }
      })
      if (!response || !response.data) {
        throw new Error('No data returned from the server')
      }
      errorTrends.value = response.data.trends || []
    } catch (error: any) {
      console.error('Failed to fetch error trends', err)
      error.value = 'Failed to load error trends. Please try again later.'
      errorTrends.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchErrorLogs() {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch('/api/admin/error/logs', {
        query: {
          date: selectedDate.value.toISOString(),
          page: currentPage.value,
          pageSize: pageSize.value
        }
      })
      if (!response || !response.data) {
        throw new Error('No data returned from the server')
      }
      errorLogs.value = response.data.logs || []
      totalLogs.value = response.data.total || 0
      totalPages.value = response.data.totalPages || 1
    } catch (err) {
      console.error('Failed to fetch error logs', err)
      error.value = 'Failed to load error logs. Please try again later.'
      errorLogs.value = []
      totalLogs.value = 0
      totalPages.value = 1
    } finally {
      loading.value = false
    }
  }

  async function refreshData() {
    await Promise.all([fetchErrorReport(), fetchErrorLogs()])
  }

  function setDate(date: Date) {
    selectedDate.value = date
    currentPage.value = 1
    refreshData()
  }

  function setPage(page: number) {
    currentPage.value = page
    fetchErrorLogs()
  }

  watch(pageSize, () => {
    currentPage.value = 1
    fetchErrorLogs()
  })

  return {
    errorReport,
    errorLogs,
    totalLogs,
    currentPage,
    totalPages,
    pageSize,
    selectedDate,
    loading,
    error,
    errorsByDomain,
    errorsBySeverity,
    errorTrends,
    errorReduction,
    mostFrequentErrors,
    errorsByHour,
    averageErrorsPerDay,
    fetchErrorReport,
    fetchErrorLogs,
    refreshData,
    setDate,
    setPage
  }
})

const errorDashboard = useErrorDashboard()

const {
  errorsByDomain,
  errorsBySeverity,
  error,
  errorLogs,
  errorReport,
  mostFrequentErrors,
  errorReduction,
  averageErrorsPerDay,
  pageSize,
  totalLogs,
  errorsByHour,
  loading,
  currentPage,
  totalPages
} = storeToRefs(errorDashboard)

const slotItems = ref({
  '1': 'logStream',
  '2': 'errorMetrics'
})

const domainChartData = computed(() => ({
  labels: Object.keys(errorsByDomain.value),
  datasets: [
    {
      data: Object.values(errorsByDomain.value),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }
  ]
}))

const severityChartData = computed(() => ({
  labels: Object.keys(errorsBySeverity.value),
  datasets: [
    {
      label: 'Errors',
      data: Object.values(errorsBySeverity.value),
      backgroundColor: '#36A2EB'
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

// Computed properties for chart data
const hourlyErrorChartData = computed(() => ({
  labels:
    errorReport.value?.errorTrends?.map((trend) => trend.interval.split(' ')[1].slice(0, 5)) || [],
  datasets: [
    {
      label: 'Hourly Errors',
      data: errorReport.value?.errorTrends?.map((trend) => trend.count) || [],
      backgroundColor: '#FF6384',
      borderColor: '#FF6384',
      valueType: 'number',
      type: 'bar'
    }
  ]
}))

const dailyErrorChartData = computed(() => ({
  labels: errorReport.value?.historicalTrends?.map((trend) => trend.date) || [],
  datasets: [
    {
      label: 'Daily Errors',
      data: errorReport.value?.historicalTrends?.map((trend) => trend.totalErrors) || [],
      backgroundColor: '#36A2EB',
      borderColor: '#36A2EB',
      valueType: 'number',
      type: 'line'
    }
  ]
}))

// Chart configurations
const hourlyErrorChart = computed(() => ({
  id: 1,
  scaleType: 'linear',
  title: 'Hourly Error Trends',
  subtitle: 'Number of errors per hour in the last 24 hours',
  type: 'bar',
  data: hourlyErrorChartData.value
}))

const dailyErrorChart = computed(() => ({
  id: 2,
  scaleType: 'linear',
  title: 'Daily Error Trends',
  subtitle: 'Total errors per day over time',
  type: 'line',
  data: dailyErrorChartData.value
}))

onMounted(errorDashboard.refreshData)
</script>

<template>
  <div class="flex h-screen flex-col p-4">
    <BaseResizable
      :slots="slotItems"
      class="flex flex-1"
    >
      <template #logStream>
        <div class="flex h-full flex-col">
          <div class="flex items-center justify-between gap-4 p-4">
            <h2 class="text-xl font-bold">{{ totalLogs }} Error Logs</h2>
            <div class="flex items-center gap-2">
              <PrimeDatePicker
                v-model="errorDashboard.selectedDate"
                @date-select="errorDashboard.setDate"
              />
              <PrimeSelect
                v-model="pageSize"
                :options="[{ value: 10 }, { value: 20 }, { value: 50 }]"
                optionLabel="value"
                placeholder="To load"
              />
              <PrimeButton
                @click="errorDashboard.refreshData"
                :loading="loading"
                class="h-full"
              >
                <Icon name="mdi:refresh" />
              </PrimeButton>
            </div>
          </div>
          <AdminErrorLogViewer
            v-if="errorLogs.length > 0"
            :logs="errorLogs"
            class="no-scrollbar flex-grow overflow-auto"
          />
          <p
            v-else-if="error"
            class="text-red-500"
            >{{ error }}</p
          >
          <p
            v-else-if="loading"
            class="text-gray-500"
            >Loading error logs...</p
          >
          <p
            v-else
            class="text-gray-500"
            >No logs available for the selected date.</p
          >
        </div>
      </template>
      <template #errorMetrics>
        <div
          class="h-full overflow-auto"
          v-if="!loading && !error && errorReport"
        >
          <h2 class="mb-4 text-2xl font-bold">Error Metrics</h2>
          <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <PrimeCard>
              <template #title>Total Errors</template>
              <template #content>
                <div class="text-4xl font-bold">{{ errorReport.totalErrors }}</div>
                <div class="text-sm text-gray-500">
                  {{ errorReduction.toFixed(2) }}% change from yesterday
                </div>
              </template>
            </PrimeCard>
            <PrimeCard>
              <template #title>Average Errors per Day</template>
              <template #content>
                <div class="text-4xl font-bold">{{ averageErrorsPerDay.toFixed(2) }}</div>
              </template>
            </PrimeCard>
          </div>
          <PrimeCard
            v-if="Object.keys(errorsByDomain).length > 0"
            class="mb-4"
          >
            <template #title>Domain Distribution</template>
            <template #content>
              <PrimeChart
                type="pie"
                :data="domainChartData"
                :options="chartOptions"
              />
            </template>
          </PrimeCard>
          <PrimeCard
            v-if="Object.keys(errorsBySeverity).length > 0"
            class="mb-4"
          >
            <template #title>Severity Distribution</template>
            <template #content>
              <PrimeChart
                type="bar"
                :data="severityChartData"
                :options="chartOptions"
              />
            </template>
          </PrimeCard>
          <PrimeCard
            v-if="mostFrequentErrors.length > 0"
            class="mb-4"
          >
            <template #title>Most Frequent Errors</template>
            <template #content>
              <ul class="list-disc pl-5">
                <li
                  v-for="error in mostFrequentErrors"
                  :key="error.message"
                  class="mb-2"
                >
                  {{ error.message }} ({{ error.count }} occurrences)
                </li>
              </ul>
            </template>
          </PrimeCard>
          <div class="mb-4 grid grid-cols-1 gap-4">
            <PrimeCard>
              <template #title>Hourly Error Trends</template>
              <template #content>
                <Chart :chart="hourlyErrorChart" />
              </template>
            </PrimeCard>
            <PrimeCard>
              <template #title>Daily Error Trends</template>
              <template #content>
                <Chart :chart="dailyErrorChart" />
              </template>
            </PrimeCard>
          </div>
        </div>
        <p
          v-else-if="error"
          class="text-red-500"
          >{{ error }}</p
        >
        <p
          v-else-if="loading"
          class="text-gray-500"
          >Loading error metrics...</p
        >
        <p
          v-else
          class="text-gray-500"
          >No error report available for the selected date.</p
        >
      </template>
    </BaseResizable>
  </div>
</template>
