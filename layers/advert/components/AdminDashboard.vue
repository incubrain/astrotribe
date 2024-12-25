<!-- pages/admin/ads/analytics.vue -->
<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'

const adsAdminStore = useAdsAdminStore()
const { overview } = storeToRefs(adsAdminStore)

const selectedPeriod = ref('30')
const selectedAdId = ref<string | null>(null)
const dialogVisible = computed(() => !!selectedAdId.value)

const periods = [
  { label: 'Last 7 Days', value: '7' },
  { label: 'Last 30 Days', value: '30' },
  { label: 'Last 90 Days', value: '90' },
]

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxTicksLimit: 10, // Limit number of x-axis labels
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        borderDash: [2, 4],
      },
    },
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false,
  },
}

// Load initial data
onMounted(async () => {
  await adsAdminStore.fetchAnalyticsOverview(selectedPeriod.value)
})

// Watch for period changes
watch(selectedPeriod, async (newPeriod) => {
  await adsAdminStore.fetchAnalyticsOverview(newPeriod)
})

const formatPercent = (value: number | null | undefined) => {
  if (value == null) return '0%'
  return `${value}%`
}

const formatNumber = (value: number | null | undefined) => {
  if (value == null) return '0'
  return value.toLocaleString()
}

// Computed metrics for the summary cards
const chartData = computed(() => {
  if (!selectedAdId.value || !adsAdminStore.trends[selectedAdId.value]) return null

  const trendData = adsAdminStore.trends[selectedAdId.value] as DailyMetrics[]

  return {
    labels: trendData.map((day) => day.date),
    datasets: [
      {
        label: 'Views',
        data: trendData.map((day) => day.views ?? 0),
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        borderColor: '#2196F3',
        type: 'line',
        tension: 0.4,
        yAxisID: 'y',
        valueType: 'number',
      },
      {
        label: 'Clicks',
        data: trendData.map((day) => day.clicks ?? 0),
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        type: 'bar',
        yAxisID: 'y-2',
        valueType: 'number',
      },
    ],
  }
})

// Add these computed properties for the chart info
const totalViews = computed(() => {
  if (!selectedAdId.value || !adsAdminStore.trends[selectedAdId.value]) return 0
  return adsAdminStore.trends[selectedAdId.value].reduce((sum, day) => sum + (day.views ?? 0), 0)
})

const totalClicks = computed(() => {
  if (!selectedAdId.value || !adsAdminStore.trends[selectedAdId.value]) return 0
  return adsAdminStore.trends[selectedAdId.value].reduce((sum, day) => sum + (day.clicks ?? 0), 0)
})

const avgCTR = computed(() => {
  if (totalViews.value === 0) return 0
  return ((totalClicks.value / totalViews.value) * 100).toFixed(2)
})

// Update summary metrics computation
const summaryMetrics = computed(() => {
  if (!overview.value?.length) return []

  const totalViews = overview.value.reduce((sum, ad) => sum + (ad.total_views ?? 0), 0)
  const totalClicks = overview.value.reduce((sum, ad) => sum + (ad.total_clicks ?? 0), 0)

  return [
    {
      label: 'Total Views',
      value: formatNumber(totalViews),
      icon: 'i-lucide-eye',
    },
    {
      label: 'Total Clicks',
      value: formatNumber(totalClicks),
      icon: 'i-lucide-mouse-pointer',
    },
    {
      label: 'Average CTR',
      value: formatPercent(totalViews > 0 ? (totalClicks / totalViews) * 100 : 0),
      icon: 'i-lucide-percent',
    },
    {
      label: 'Active Ads',
      value: overview.value.length,
      icon: 'i-lucide-layout-template',
    },
  ]
})

const handleAdSelect = async (ad: AdMetrics) => {
  selectedAdId.value = ad.id

  await Promise.all([
    adsAdminStore.fetchDailyTrends(ad.id, selectedPeriod.value),
    adsAdminStore.fetchVariantMetrics(ad.id),
  ])
}
</script>

<template>
  <div class="p-6 max-w-[1400px] mx-auto space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Advertising Analytics</h1>
      <PrimeSelect
        v-model="selectedPeriod"
        :options="periods"
        option-label="label"
        option-value="value"
        placeholder="Select Period"
        class="w-48"
      />
    </div>

    <!-- Loading State -->
    <div
      v-if="adsAdminStore.isLoading"
      class="flex justify-center items-center h-64"
    >
      <PrimeProgressSpinner />
    </div>

    <template v-else>
      <!-- Error State -->
      <PrimeMessage
        v-if="adsAdminStore.error"
        severity="error"
        :closable="false"
        class="mb-4"
      >
        {{ adsAdminStore.error }}
      </PrimeMessage>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="metric in summaryMetrics"
          :key="metric.label"
          class="bg-primary-950 rounded-lg shadow p-4"
        >
          <div class="flex items-center gap-3">
            <div :class="[metric.icon, 'text-blue-600 text-xl']" />
            <div>
              <div class="text-sm text-gray-500">{{ metric.label }}</div>
              <div class="text-2xl font-bold">{{ metric.value }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ads Performance Table -->
      <PrimeDataTable
        :value="adsAdminStore.overview"
        :paginator="true"
        :rows="10"
        :row-hover="true"
        class="p-datatable-sm"
        striped-rows
        responsive-layout="scroll"
        @row-click="(e) => handleAdSelect(e.data)"
      >
        <PrimeColumn
          field="company_name"
          header="Company"
        />
        <PrimeColumn
          field="title"
          header="Ad Title"
        />
        <PrimeColumn
          field="total_views"
          header="Views"
          data-type="numeric"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ formatNumber(data.total_views) }}
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="total_clicks"
          header="Clicks"
          data-type="numeric"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ formatNumber(data.total_clicks) }}
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="ctr"
          header="CTR"
          data-type="numeric"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ formatPercent(data.ctr) }}
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="ad_position"
          header="Position"
          :filter-match-mode="FilterMatchMode.EQUALS"
        >
          <template #body="{ data }">
            <PrimeTag
              :value="data.ad_position"
              :severity="data.ad_position === 'top' ? 'success' : 'info'"
            />
          </template>
        </PrimeColumn>
      </PrimeDataTable>

      <!-- Selected Ad Details Dialog -->
      <PrimeDialog
        v-model:visible="dialogVisible"
        :modal="true"
        :style="{ width: '80vw' }"
        header="Ad Performance Details"
      >
        <template v-if="selectedAdId && adsAdminStore.trends[selectedAdId]">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Performance Chart -->
            <div class="rounded-lg shadow p-4">
              <h3 class="text-lg font-medium mb-4">Performance Trends</h3>
              <Chart
                :options-visible="false"
                :chart="{
                  id: selectedAdId,
                  type: 'line', // Base type
                  title: 'Performance Trends',
                  subtitle: 'Views and Clicks Over Time',
                  scaleType: 'linear',
                  data: chartData,
                  info: [
                    { name: 'Total Views', value: totalViews },
                    { name: 'Total Clicks', value: totalClicks },
                    { name: 'Average CTR', value: `${avgCTR}%` },
                  ],
                }"
              />
            </div>

            <!-- Variants Comparison -->
            <div class="rounded-lg shadow p-4">
              <h3 class="text-lg font-medium mb-4">A/B Test Results</h3>
              <PrimeDataTable
                :value="adsAdminStore.variants[selectedAdId]"
                class="p-datatable-sm"
                responsive-layout="scroll"
              >
                <PrimeColumn
                  field="is_control"
                  header="Variant"
                >
                  <template #body="{ data }">
                    {{ data.is_control ? 'Control' : 'Variant B' }}
                  </template>
                </PrimeColumn>
                <PrimeColumn
                  field="total_views"
                  header="Views"
                >
                  <template #body="{ data }">
                    {{ formatNumber(data.total_views) }}
                  </template>
                </PrimeColumn>
                <PrimeColumn
                  field="total_clicks"
                  header="Clicks"
                >
                  <template #body="{ data }">
                    {{ formatNumber(data.total_clicks) }}
                  </template>
                </PrimeColumn>
                <PrimeColumn
                  field="ctr"
                  header="CTR"
                >
                  <template #body="{ data }">
                    {{ formatPercent(data.ctr) }}
                  </template>
                </PrimeColumn>
              </PrimeDataTable>
            </div>
          </div>
        </template>
      </PrimeDialog>
    </template>
  </div>
</template>
