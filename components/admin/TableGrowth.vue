<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'

const supabase = useSupabaseClient()
const { handleError } = useErrorHandler()
const toast = useNotification()

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
  'research'
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
        p_num_periods: 30
      }),
      supabase.rpc('calculate_table_growth', {
        p_table_name: table,
        p_time_period: '1 week',
        p_num_periods: 12
      }),
      supabase.rpc('calculate_table_growth', {
        p_table_name: table,
        p_time_period: '1 month',
        p_num_periods: 12
      })
    ])

    return {
      daily: daily.data,
      weekly: weekly.data,
      monthly: monthly.data
    }
  } catch (error) {
    handleError(error, `Error fetching growth data for ${table}`)
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
        growth_percentage: i === 0 ? 0 : ((rowCount - baseRowCount) / baseRowCount) * 100
      }
    })
  }

  const baseRowCount = Math.floor(Math.random() * 10000) + 1000 // Random base count between 1000 and 11000
  return {
    daily: generatePeriodData(30, baseRowCount),
    weekly: generatePeriodData(12, baseRowCount),
    monthly: generatePeriodData(12, baseRowCount)
  }
}

const processGrowthData = (data: any) => {
  if (!data) return null

  const getLatestGrowth = (periodData: any[]) => {
    return periodData.sort(
      (a, b) => new Date(b.period_end_time).getTime() - new Date(a.period_end_time).getTime()
    )[0]
  }

  return {
    daily: {
      latest: getLatestGrowth(data.daily),
      data: data.daily
    },
    weekly: {
      latest: getLatestGrowth(data.weekly),
      data: data.weekly
    },
    monthly: {
      latest: getLatestGrowth(data.monthly),
      data: data.monthly
    }
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
        pointRadius: 0
      }
    ]
  }
}

const sparklineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  scales: { x: { display: false }, y: { display: false } },
  elements: {
    line: {
      tension: 0.4 // Smooth line
    },
    point: {
      radius: 0 // Hide points
    }
  },
  interaction: {
    intersect: false,
    mode: 'index',
    hover: {
      mode: null // Disable hover mode
    }
  },
  animation: {
    duration: 0 // Disable all animations
  }
}

onMounted(async () => {
  try {
    await fetchAllGrowthData()
  } catch (error) {
    handleError(error, 'Error loading dashboard data')
    toast.error({
      summary: 'Data Load Error',
      message: 'Failed to load dashboard data. Please try again later.'
    })
  }
})
</script>

<template>
  <div class="table-growth-dashboard min-h-screen bg-gray-900 p-6 text-white">
    <h1 class="mb-8 py-12 text-center text-5xl font-bold">Table Growth Dashboard</h1>
    <div
      v-if="isLoading"
      class="flex h-64 items-center justify-center"
    >
      <PrimeProgressSpinner />
    </div>
    <div v-else>
      <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BaseGlass class="lg:col-start-2">
          <template #header>
            <h2 class="mb-2 text-2xl font-semibold">Total Row Count</h2>
          </template>
          <template #default>
            <div class="text-5xl font-bold">{{ formatNumber(totalRowCount) }}</div>
          </template>
        </BaseGlass>
      </div>
      <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BaseGlass
          v-for="table in tables"
          :key="table"
        >
          <template #header>
            <h2 class="pb-4 text-2xl font-bold">{{ useChangeCase(table, 'capitalCase') }}</h2>
          </template>
          <template #default>
            <div v-if="growthData[table]">
              <div
                v-for="period in ['daily', 'weekly', 'monthly']"
                :key="period"
                class="mb-2"
              >
                <div class="flex items-center justify-between">
                  <strong class="capitalize">{{ period }} Growth:</strong>
                  <div class="flex items-center">
                    <Icon
                      :name="getGrowthIcon(growthData[table][period].latest.growth_percentage)"
                      :class="getGrowthClass(growthData[table][period].latest.growth_percentage)"
                      class="mr-2 h-6 w-6"
                    />
                    <span
                      :class="getGrowthClass(growthData[table][period].latest.growth_percentage)"
                    >
                      {{ formatPercentage(growthData[table][period].latest.growth_percentage) }}
                    </span>
                  </div>
                </div>
                <PrimeChart
                  type="line"
                  :data="getSparklineData(table, period)"
                  :options="sparklineOptions"
                  class="mt-1 h-8"
                />
              </div>
              <div class="mt-4">
                <strong>Total Rows:</strong> {{ formatNumber(growthData[table].daily.latest.row_count) }}
              </div>
            </div>
            <div
              v-else
              class="italic text-gray-400"
              >No data available</div
            >
          </template>
        </BaseGlass>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-growth-dashboard {
  font-family: 'Arial', sans-serif;
}
.p-card {
  transition: all 0.3s ease;
}
.p-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
