<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'

const supabase = useSupabaseClient()
const toast = useNotification()
const logger = useLogger('growth')

const tables = [
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
const useFakeData = ref(true)
const selectedPeriod = ref('daily')

const periodOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
]

// Keep existing data fetching functions
const fetchGrowthData = async (table: string) => {
  if (useFakeData.value) return generateFakeGrowthData(table)

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
  // Keep existing fake data generation
  // ... (previous implementation)
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

// Computed properties for analytics
const totalRowCount = computed(() => {
  return Object.values(growthData.value).reduce((sum, table: any) => {
    const count = table?.daily?.latest.row_count || 0
    return sum + (count > 0 ? count : 0)
  }, 0)
})

const totalGrowthPercentage = computed(() => {
  const tables = Object.values(growthData.value)
  const totalGrowth = tables.reduce((sum, table: any) => {
    return sum + (table?.[selectedPeriod.value]?.latest.growth_percentage || 0)
  }, 0)
  return totalGrowth / tables.length
})

// Formatting helpers
const formatNumber = (num: number) => {
  if (isNaN(num) || num < 0) return 'N/A'
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return new Intl.NumberFormat().format(Math.round(num))
}

const formatPercentage = (num: number) => {
  if (isNaN(num)) return 'N/A'
  return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`
}

const getGrowthClass = (growth: number) => {
  if (isNaN(growth)) return 'text-gray-500'
  return growth > 0 ? 'text-green-500' : growth < 0 ? 'text-red-500' : 'text-gray-500'
}

const getGrowthIcon = (growth: number) => {
  if (isNaN(growth)) return 'i-lucide-minus'
  return growth > 0
    ? 'i-lucide-trending-up'
    : growth < 0
      ? 'i-lucide-trending-down'
      : 'i-lucide-minus'
}

// Chart configuration
const getSparklineData = (table: string, period: string) => {
  const data = growthData.value[table]?.[period]?.data || []
  const latestGrowth = growthData.value[table]?.[period]?.latest.growth_percentage || 0

  return {
    labels: data.map((d: any) => new Date(d.period_end_time).toLocaleDateString()),
    datasets: [
      {
        data: data.map((d: any) => d.row_count),
        borderColor: latestGrowth > 0 ? '#10B981' : '#EF4444',
        borderWidth: 1.5,
        fill: false,
        tension: 0.4,
      },
    ],
  }
}

const sparklineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { display: false },
    y: { display: false, beginAtZero: false },
  },
  elements: {
    point: { radius: 0 },
  },
  interaction: { intersect: false },
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
  <div class="min-h-screen p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white">Database Growth Analytics</h1>
      <p class="mt-1 text-gray-400">Real-time table statistics and growth metrics</p>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex h-96 items-center justify-center"
    >
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>

    <div
      v-else
      class="space-y-8"
    >
      <!-- Summary Cards -->
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-lg bg-gray-900 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-400">Total Rows</p>
              <p class="mt-2 text-3xl font-bold text-white">{{ formatNumber(totalRowCount) }}</p>
            </div>
            <div class="rounded-full bg-blue-500/10 p-3">
              <div class="i-lucide-database text-blue-500 h-6 w-6" />
            </div>
          </div>
        </div>

        <div class="rounded-lg bg-gray-900 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-400">Average Growth</p>
              <p
                class="mt-2 text-3xl font-bold"
                :class="getGrowthClass(totalGrowthPercentage)"
              >
                {{ formatPercentage(totalGrowthPercentage) }}
              </p>
            </div>
            <div class="rounded-full bg-blue-500/10 p-3">
              <div :class="[getGrowthIcon(totalGrowthPercentage), 'h-6 w-6 text-blue-500']" />
            </div>
          </div>
        </div>
      </div>

      <!-- Period Selector -->
      <div class="flex items-center justify-between border-b border-gray-800 pb-4">
        <h2 class="text-lg font-semibold text-white">Table Growth Metrics</h2>
        <div class="flex gap-2">
          <button
            v-for="option in periodOptions"
            :key="option.value"
            :class="[
              'px-3 py-1 text-sm rounded-md transition-colors',
              selectedPeriod === option.value
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white',
            ]"
            @click="selectedPeriod = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- Table Grid -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="table in tables"
          :key="table"
          class="rounded-lg bg-gray-900 p-4 transition-all hover:bg-gray-800"
        >
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-medium text-white">{{ useChangeCase(table, 'capitalCase') }}</h3>
            <span
              :class="[
                getGrowthClass(growthData[table]?.[selectedPeriod]?.latest.growth_percentage),
                'flex items-center text-sm font-medium',
              ]"
            >
              <div
                :class="[
                  getGrowthIcon(growthData[table]?.[selectedPeriod]?.latest.growth_percentage),
                  'mr-1 h-4 w-4',
                ]"
              />
              {{
                formatPercentage(growthData[table]?.[selectedPeriod]?.latest.growth_percentage || 0)
              }}
            </span>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Current Count</span>
              <span class="font-medium text-white">
                {{ formatNumber(growthData[table]?.[selectedPeriod]?.latest.row_count || 0) }}
              </span>
            </div>

            <div class="h-16">
              <PrimeChart
                v-if="growthData[table]"
                type="line"
                :data="getSparklineData(table, selectedPeriod)"
                :options="sparklineOptions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
