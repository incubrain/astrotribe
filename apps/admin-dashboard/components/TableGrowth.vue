<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'

const supabase = useSupabaseClient()
const toast = useNotification()
const logger = useLogger('table-growth-dashboard')

const tables = [
  'news',
  'companies',
  'company_urls',
  'user_profiles',
  'content_sources',
  'contents',
  'blacklisted_domains',
  'blacklisted_urls',
  'searches',
  'research',
]

const growthData = ref<Record<string, any>>({})
const isLoading = ref(true)
const useFakeData = ref(false)

const fetchGrowthData = async (table: string) => {
  if (useFakeData.value) {
    return generateFakeGrowthData(table)
  }

  try {
    const [daily, weekly, monthly] = await Promise.all([
      supabase.rpc('calculate_table_growth', {
        p_table_name: table,
        p_time_period: '1 day',
        p_num_periods: 30,
      }),
      supabase.rpc('calculate_table_growth', {
        p_table_name: table,
        p_time_period: '1 week',
        p_num_periods: 12,
      }),
      supabase.rpc('calculate_table_growth', {
        p_table_name: table,
        p_time_period: '1 month',
        p_num_periods: 12,
      }),
    ])

    return {
      daily: daily.data,
      weekly: weekly.data,
      monthly: monthly.data,
    }
  } catch (error: any) {
    logger.error(error, `Error fetching growth data for ${table}`)
    return null
  }
}

const generateFakeGrowthData = (table: string) => {
  const generatePeriodData = (periodCount: number, baseRowCount: number) => {
    let rowCount = baseRowCount
    return Array.from({ length: periodCount }, (_, i) => {
      const growth = Math.random() * 0.1 - 0.05 // Random growth between -5% and 5%
      rowCount = Math.max(0, Math.round(rowCount * (1 + growth)))
      return {
        period_end_time: new Date(Date.now() - (periodCount - i - 1) * 86400000).toISOString(),
        row_count: rowCount,
        growth_count: i === 0 ? 0 : rowCount - baseRowCount,
        growth_percentage: i === 0 ? 0 : ((rowCount - baseRowCount) / baseRowCount) * 100,
      }
    })
  }

  const baseRowCount = Math.floor(Math.random() * 10000) + 1000 // Random base count between 1000 and 11000
  return {
    daily: generatePeriodData(30, baseRowCount),
    weekly: generatePeriodData(12, baseRowCount),
    monthly: generatePeriodData(12, baseRowCount),
  }
}

const processGrowthData = (data: any) => {
  if (!data) return null

  const getLatestGrowth = (periodData: any[]) => {
    return periodData.sort(
      (a, b) => new Date(b.period_end_time).getTime() - new Date(a.period_end_time).getTime(),
    )[0]
  }

  return {
    daily: {
      latest: getLatestGrowth(data.daily),
      data: data.daily,
    },
    weekly: {
      latest: getLatestGrowth(data.weekly),
      data: data.weekly,
    },
    monthly: {
      latest: getLatestGrowth(data.monthly),
      data: data.monthly,
    },
  }
}

const fetchAllGrowthData = async () => {
  for (const table of tables) {
    const data = await fetchGrowthData(table)
    growthData.value[table] = processGrowthData(data)
  }
  isLoading.value = false
}

const formatNumber = (num: number) => {
  if (isNaN(num) || num < 0) return 'N/A'
  return new Intl.NumberFormat().format(Math.round(num))
}

const formatPercentage = (num: number) => {
  if (isNaN(num)) return 'N/A'
  return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`
}

const getGrowthClass = (growth: number) => {
  if (isNaN(growth)) return 'text-gray-500'
  return growth > 0 ? 'text-green-500' : growth < 0 ? 'text-red-500' : 'text-gray-500'
}

const getGrowthIcon = (growth: number) => {
  if (isNaN(growth)) return 'mdi:minus-circle-outline'
  return growth > 0
    ? 'material-symbols:trending-up-rounded'
    : growth < 0
      ? 'material-symbols:trending-down-rounded'
      : 'mdi:minus-circle-outline'
}

const totalRowCount = computed(() => {
  return Object.values(growthData.value).reduce((sum, table: any) => {
    const count = table?.daily?.latest.row_count || 0
    return sum + (count > 0 ? count : 0)
  }, 0)
})

const getSparklineData = (table: string, period: string) => {
  const data = growthData.value[table]?.[period]?.data || []

  const borderColor =
    growthData.value[table]?.[period]?.latest.growth_percentage > 0 ? '#4CAF50' : '#F44336'

  return {
    labels: data.map((d: any) => d.period_end_time),
    datasets: [
      {
        data: data.map((d: any) => d.row_count),
        borderColor,
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
    ],
  }
}

const sparklineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: { display: false },
    y: {
      display: false,
      beginAtZero: false,
    },
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 2,
    },
    point: {
      radius: 0,
      hoverRadius: 0,
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  animation: false,
}

onMounted(async () => {
  try {
    await fetchAllGrowthData()
  } catch (error: any) {
    logger.error(error, 'Error loading dashboard data')
    toast.error({
      summary: 'Data Load Error',
      message: 'Failed to load dashboard data. Please try again later.',
    })
  }
})
</script>

<template>
  <div
    class="table-growth-dashboard min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 text-white"
  >
    <!-- Header Section -->
    <div class="mb-12 text-center">
      <h1 class="text-6xl font-bold tracking-tight">
        <span class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Table Growth Dashboard
        </span>
      </h1>
      <p class="mt-4 text-gray-400">Real-time database growth analytics</p>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex h-96 items-center justify-center"
    >
      <PrimeProgressSpinner
        class="h-16 w-16"
        strokeWidth="4"
      />
    </div>

    <div
      v-else
      class="mx-auto max-w-7xl"
    >
      <!-- Total Row Count Card -->
      <div class="mb-12">
        <IBGlass class="mx-auto max-w-md transform transition-all duration-300 hover:scale-105">
          <template #header>
            <div class="text-center">
              <h2 class="text-xl font-medium text-gray-400">Total Row Count</h2>
              <div class="mt-2 text-5xl font-bold tracking-tight">
                {{ formatNumber(totalRowCount) }}
              </div>
            </div>
          </template>
        </IBGlass>
      </div>

      <!-- Table Cards Grid -->
      <div class="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <IBGlass
          v-for="table in tables"
          :key="table"
          class="transform transition-all duration-300 hover:scale-105"
        >
          <template #header>
            <div class="flex items-center justify-between border-b border-gray-700 pb-4">
              <h2 class="text-xl font-semibold">
                {{ useChangeCase(table, 'capitalCase') }}
              </h2>
              <div class="rounded-full bg-gray-800 px-3 py-1 text-sm">
                {{ formatNumber(growthData[table]?.daily?.latest?.row_count || 0) }} rows
              </div>
            </div>
          </template>

          <div
            v-if="growthData[table]"
            class="space-y-6"
          >
            <div
              v-for="period in ['daily', 'weekly', 'monthly']"
              :key="period"
              class="group relative"
            >
              <div class="mb-2 flex items-center justify-between">
                <span class="text-sm font-medium text-gray-400 capitalize">
                  {{ period }}
                </span>
                <div class="flex items-center space-x-2">
                  <Icon
                    :name="getGrowthIcon(growthData[table][period].latest.growth_percentage)"
                    :class="[
                      getGrowthClass(growthData[table][period].latest.growth_percentage),
                      'transition-transform group-hover:scale-110',
                    ]"
                    size="20"
                  />
                  <span
                    :class="[
                      getGrowthClass(growthData[table][period].latest.growth_percentage),
                      'font-mono text-sm',
                    ]"
                  >
                    {{ formatPercentage(growthData[table][period].latest.growth_percentage) }}
                  </span>
                </div>
              </div>

              <div class="relative h-12 overflow-hidden rounded-lg bg-gray-800/50">
                <PrimeChart
                  type="line"
                  :data="getSparklineData(table, period)"
                  :options="sparklineOptions"
                  class="absolute inset-0"
                />
              </div>
            </div>
          </div>

          <div
            v-else
            class="flex h-full items-center justify-center py-8 text-gray-500"
          >
            <Icon
              name="mdi:database-off"
              size="48"
              class="mr-2"
            />
            <span>No data available</span>
          </div>
        </IBGlass>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-growth-dashboard {
  background-image: radial-gradient(circle at 10% 20%, rgba(91, 37, 195, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(37, 99, 195, 0.1) 0%, transparent 50%);
}

/* Smooth transitions */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
