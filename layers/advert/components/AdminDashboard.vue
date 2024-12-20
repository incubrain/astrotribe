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

const chartData = computed(() => {
  if (!selectedAdId.value || !adsAdminStore.trends[selectedAdId.value]) return null

  const trendData = adsAdminStore.trends[selectedAdId.value]

  return {
    labels: trendData.map((day) => day.date),
    datasets: [
      {
        label: 'Views',
        data: trendData.map((day) => day.views),
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        borderColor: '#2196F3',
        type: 'line', // Make this a line
        tension: 0.4,
        yAxisID: 'y',
        valueType: 'number',
      },
      {
        label: 'Clicks',
        data: trendData.map((day) => day.clicks),
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        type: 'bar', // Make this a bar
        yAxisID: 'y-2', // Use secondary axis
        valueType: 'number',
      },
    ],
  }
})

// Load initial data
onMounted(async () => {
  await adsAdminStore.fetchAnalyticsOverview(selectedPeriod.value)
})

// Watch for period changes
watch(selectedPeriod, async (newPeriod) => {
  await adsAdminStore.fetchAnalyticsOverview(newPeriod)
})

// Computed metrics for the summary cards
const summaryMetrics = computed(() => {
  if (!overview.value) return []

  return [
    {
      label: 'Total Views',
      value: overview.value.reduce((sum, ad) => sum + ad.total_views, 0).toLocaleString(),
      icon: 'i-lucide-eye',
    },
    {
      label: 'Total Clicks',
      value: overview.value.reduce((sum, ad) => sum + ad.total_clicks, 0).toLocaleString(),
      icon: 'i-lucide-mouse-pointer',
    },
    {
      label: 'Average CTR',
      value: `${(overview.value.reduce((sum, ad) => sum + ad.ctr, 0) / overview.value.length).toFixed(2)}%`,
      icon: 'i-lucide-percent',
    },
    {
      label: 'Active Ads',
      value: overview.value.length,
      icon: 'i-lucide-layout-template',
    },
  ]
})

// Loading more details when an ad is selected
const handleAdSelect = async (ad: any) => {
  selectedAdId.value = ad.id

  await Promise.all([
    adsAdminStore.fetchDailyTrends(ad.id, selectedPeriod.value), // now /api/ads/[adId]/trend
    adsAdminStore.fetchVariantMetrics(ad.id), // /api/ads/[adId]/metrics
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
          dataType="numeric"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ data.total_views.toLocaleString() }}
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="total_clicks"
          header="Clicks"
          dataType="numeric"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ data.total_clicks.toLocaleString() }}
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="ctr"
          header="CTR"
          dataType="numeric"
          :sortable="true"
        >
          <template #body="{ data }"> {{ data.ctr }}% </template>
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
                />
                <PrimeColumn
                  field="total_clicks"
                  header="Clicks"
                />
                <PrimeColumn
                  field="ctr"
                  header="CTR"
                >
                  <template #body="{ data }"> {{ data.ctr }}% </template>
                </PrimeColumn>
              </PrimeDataTable>
            </div>
          </div>
        </template>
      </PrimeDialog>
    </template>
  </div>
</template>
