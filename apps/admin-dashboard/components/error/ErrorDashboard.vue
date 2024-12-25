<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { format } from 'date-fns'

interface ErrorMetrics {
  overview: {
    totalErrors: number
    newPatterns: number
    activeServices: number
    criticalErrors: number
  }
  distributions: {
    severity: Record<string, number>
    service: Record<string, number>
    errorType: Record<string, number>
  }
  trends: {
    hourly: number[]
    topPatterns: {
      pattern: string
      service: string
      count: number
      dailyFrequency: number
      isNew: boolean
    }[]
    correlations: {
      source: string
      target: string
      count: number
      avgTimeDiff: number
    }[]
  }
}

// Computed service health from error metrics
interface ServiceHealth {
  name: string
  metrics: {
    errorRate: number
    responseTime: number
    availability: number
    errorCount: number
  }
  status: 'healthy' | 'degraded' | 'critical'
  trend: {
    direction: 'up' | 'down' | 'stable'
    percentage: number
  }
  lastIncident?: {
    time: string
    message: string
    severity: string
  }
}

const metrics = ref<ErrorMetrics | null>(null)
const selectedTimeframe = ref({ label: '7d', value: '7d' })
const selectedDate = ref(new Date())
const loading = ref(false)

const { fetch } = useBaseFetch()

// Transform API metrics into service health data
const serviceHealthData = computed<ServiceHealth[]>(() => {
  if (!metrics.value) return []

  return Object.entries(metrics.value.distributions.service).map(([serviceName, errorCount]) => {
    // Calculate error rate based on total errors
    const totalErrors = metrics.value!.overview.totalErrors
    const errorRate = totalErrors > 0 ? (errorCount / totalErrors) * 100 : 0

    // Determine status based on error rate
    let status: ServiceHealth['status'] = 'healthy'
    if (errorRate > 5) status = 'degraded'
    if (errorRate > 10) status = 'critical'

    // Find matching pattern for this service
    const servicePattern = metrics.value!.trends.topPatterns.find((p) => p.service === serviceName)

    return {
      name: serviceName,
      metrics: {
        errorRate,
        responseTime: 0, // This would come from a different metric
        availability: 100 - errorRate, // Simplified calculation
        errorCount,
      },
      status,
      trend: {
        direction: errorRate > 5 ? 'up' : 'down',
        percentage: servicePattern?.dailyFrequency || 0,
      },
      lastIncident: servicePattern
        ? {
            time: new Date().toISOString(), // This would come from actual incident data
            message: servicePattern.pattern,
            severity: status,
          }
        : undefined,
    }
  })
})

// Compute overall health metrics
const overallHealth = computed(() => {
  if (!metrics.value || !serviceHealthData.value.length) return null

  const services = serviceHealthData.value
  return {
    errorRate: services.reduce((acc, s) => acc + s.metrics.errorRate, 0) / services.length,
    responseTime: services.reduce((acc, s) => acc + s.metrics.responseTime, 0) / services.length,
    availability: services.reduce((acc, s) => acc + s.metrics.availability, 0) / services.length,
    totalErrors: metrics.value.overview.totalErrors,
    overallScore: calculateHealthScore(services),
  }
})

function calculateHealthScore(services: ServiceHealth[]) {
  const weights = {
    errorRate: 0.35,
    responseTime: 0.25,
    availability: 0.4,
  }

  return (
    (services.reduce((acc, service) => {
      const serviceScore =
        (1 - service.metrics.errorRate / 100) * weights.errorRate +
        (1 - service.metrics.responseTime / 1000) * weights.responseTime +
        (service.metrics.availability / 100) * weights.availability
      return acc + serviceScore
    }, 0) /
      services.length) *
    100
  )
}

function getStatusColor(status: string) {
  return (
    {
      healthy: 'rgb(22 163 74)', // green-600
      degraded: 'rgb(202 138 4)', // yellow-600
      critical: 'rgb(220 38 38)', // red-600
    }[status] || 'rgb(161 161 170)'
  ) // zinc-400
}

async function fetchMetrics() {
  loading.value = true
  try {
    const query = {
      timeframe: selectedTimeframe.value,
      date: selectedDate.value.toISOString(),
    }

    const response = await fetch('/api/error/report', { query })

    if (response?.data) {
      metrics.value = response.data
    } else {
      console.warn('No data in response:', response)
    }
  } catch (error: any) {
    console.error('Failed to fetch metrics:', error)
  } finally {
    loading.value = false
  }
}

// Chart data preparations
const trendChartData = computed(() => {
  if (!metrics.value?.trends.hourly) return null

  return {
    labels: Array.from({ length: 24 }, (_, i) => format(new Date().setHours(i), 'HH:mm')),
    datasets: [
      {
        type: 'line',
        label: 'Errors',
        data: metrics.value.trends.hourly,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        fill: true,
        tension: 0.4,
        valueType: 'number',
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#fff' },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
      ticks: { color: '#fff' },
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
      ticks: { color: '#fff' },
    },
  },
}

// Watch for changes
watch([selectedTimeframe, selectedDate], () => {
  fetchMetrics()
})

onMounted(() => {
  fetchMetrics()
})
</script>

<template>
  <div class="min-h-screen text-white p-6 space-y-6">
    <!-- Header with Controls -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-xl font-medium">System Health</h1>
      <div class="flex items-center gap-4">
        <PrimeSelect
          v-model="selectedTimeframe"
          :options="[
            { label: '24h', value: '24h' },
            { label: '7d', value: '7d' },
            { label: '30d', value: '30d' },
          ]"
          option-label="label"
          >{{ selectedTimeframe }}</PrimeSelect
        >
        <PrimeDatePicker
          v-model="selectedDate"
          :showIcon="true"
        />
        <PrimeButton
          severity="secondary"
          @click="fetchMetrics"
        >
          <Icon
            name="mdi:refresh"
            class="h-4 w-4"
          />
        </PrimeButton>
      </div>
    </div>

    <!-- Overall System Health -->
    <div class="grid grid-cols-5 gap-4">
      <div class="bg-zinc-800 rounded-lg p-6 col-span-2">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm text-zinc-400">Overall Health Score</span>
          <PrimeTag
            :value="`Previous ${selectedTimeframe.value}`"
            severity="info"
            class="text-xs"
          />
        </div>
        <div class="flex items-baseline gap-2">
          <span
            class="text-4xl font-bold"
            :style="{ color: `hsl(${(overallHealth?.overallScore || 0) * 1.2}, 100%, 50%)` }"
          >
            {{ Math.round(overallHealth?.overallScore || 0) }}%
          </span>
          <span class="text-sm text-zinc-400">system health</span>
        </div>
      </div>

      <div
        v-for="metric in [
          {
            label: 'Error Rate',
            value: overallHealth?.errorRate || 0,
            unit: '%',
            icon: 'mdi:alert-circle',
          },
          {
            label: 'Response Time',
            value: overallHealth?.responseTime || 0,
            unit: 'ms',
            icon: 'mdi:clock-outline',
          },
          {
            label: 'Availability',
            value: overallHealth?.availability || 0,
            unit: '%',
            icon: 'mdi:check-circle',
          },
        ]"
        :key="metric.label"
        class="bg-zinc-800 rounded-lg p-6"
      >
        <div class="flex items-start justify-between mb-2">
          <span class="text-sm text-zinc-400">{{ metric.label }}</span>
          <Icon
            :name="metric.icon"
            class="h-5 w-5 text-zinc-400"
          />
        </div>
        <div class="text-2xl font-bold">
          {{ typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value
          }}{{ metric.unit }}
        </div>
      </div>
    </div>

    <!-- Service Health Grid -->
    <div class="grid grid-cols-3 gap-6">
      <div
        v-for="service in serviceHealthData"
        :key="service.name"
        class="bg-zinc-800 rounded-lg overflow-hidden"
      >
        <!-- Service Header -->
        <div class="p-4 border-b border-zinc-700 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: getStatusColor(service.status) }"
            />
            <h3 class="font-medium">{{ service.name }}</h3>
          </div>
          <div class="flex items-center gap-2">
            <Icon
              :name="
                service.trend.direction === 'up'
                  ? 'mdi:trending-up'
                  : service.trend.direction === 'down'
                    ? 'mdi:trending-down'
                    : 'mdi:trending-neutral'
              "
              :class="
                service.trend.direction === 'up'
                  ? 'text-red-600'
                  : service.trend.direction === 'down'
                    ? 'text-green-600'
                    : 'text-zinc-400'
              "
              class="h-5 w-5"
            />
            <span
              class="text-sm"
              :class="
                service.trend.direction === 'up'
                  ? 'text-red-600'
                  : service.trend.direction === 'down'
                    ? 'text-green-600'
                    : 'text-zinc-400'
              "
            >
              {{ service.trend.percentage.toFixed(1) }}%
            </span>
          </div>
        </div>

        <!-- Service Metrics -->
        <div class="p-4 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <div class="text-sm text-zinc-400">Error Rate</div>
              <div class="text-xl font-semibold"> {{ service.metrics.errorRate.toFixed(1) }}% </div>
            </div>
            <div class="space-y-1">
              <div class="text-sm text-zinc-400">Errors</div>
              <div class="text-xl font-semibold">
                {{ service.metrics.errorCount }}
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-zinc-400">Availability</span>
              <span>{{ service.metrics.availability.toFixed(1) }}%</span>
            </div>
            <div class="h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full"
                :style="{
                  width: `${service.metrics.availability}%`,
                  backgroundColor: getStatusColor(service.status),
                }"
              />
            </div>
          </div>

          <!-- Last Incident -->
          <div
            v-if="service.lastIncident"
            class="pt-2 border-t border-zinc-700"
          >
            <div class="flex items-start gap-2">
              <Icon
                name="mdi:clock-alert-outline"
                class="h-4 w-4 text-zinc-400 mt-0.5"
              />
              <div class="flex-1">
                <div class="text-sm text-zinc-300">
                  {{ service.lastIncident.message }}
                </div>
                <div class="text-xs text-zinc-500 mt-1">
                  {{ format(new Date(service.lastIncident.time), 'MMM d, HH:mm') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Trends Chart -->
    <div class="bg-zinc-800 rounded-lg p-6">
      <h3 class="text-lg font-medium mb-4">Error Trends</h3>
      <div class="h-auto">
        <PrimeChart
          v-if="trendChartData"
          type="line"
          :data="trendChartData"
          :options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-calendar) {
  background: rgb(39 39 42);
  border: 1px solid rgb(63 63 70);
  color: white;
}

:deep(.p-calendar:hover) {
  border-color: rgb(82 82 91);
}

:deep(.p-calendar input) {
  color: white;
}

:deep(.p-calendar-panel) {
  background: rgb(39 39 42);
  border: 1px solid rgb(63 63 70);
}

:deep(.p-calendar .p-datepicker-header) {
  background: transparent;
  color: white;
  border-bottom: 1px solid rgb(63 63 70);
}

:deep(.p-calendar .p-datepicker-calendar td) {
  padding: 0.2rem;
}

:deep(.p-calendar .p-datepicker-calendar td > span) {
  color: white;
}

:deep(.p-calendar .p-datepicker-calendar td.p-datepicker-today > span) {
  background: rgb(59 130 246);
  color: white;
}
</style>
