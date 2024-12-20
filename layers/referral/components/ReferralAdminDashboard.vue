<!-- pages/admin/referrals.vue -->
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const store = useReferralStore()
const { metrics, isLoading, error, timeRange, conversionTrend } = storeToRefs(store)

// Table data computations
const deviceDistributionData = computed(() => {
  if (!metrics.value) return []
  return Object.entries(metrics.value.deviceBreakdown || {}).map(([device, percentage]) => ({
    device,
    percentage,
    count: Math.round((percentage / 100) * metrics.value!.totalReferrals),
  }))
})

const countryDistributionData = computed(() => {
  if (!metrics.value) return []
  return Object.entries(metrics.value.countryBreakdown || {}).map(([country, percentage]) => ({
    country,
    percentage,
    count: Math.round((percentage / 100) * metrics.value!.totalReferrals),
  }))
})

// Chart data computation
const conversionChartData = computed(() => {
  if (!conversionTrend.value || !metrics.value)
    return {
      labels: [],
      datasets: [
        {
          label: 'Conversion Rate',
          data: [],
          fill: false,
          borderColor: '#2563eb',
          tension: 0.4,
        },
      ],
    }

  return {
    labels: conversionTrend.value.map((item) => item.date),
    datasets: [
      {
        label: 'Conversion Rate',
        data: conversionTrend.value.map((item) => item.conversionRate),
        fill: false,
        borderColor: '#2563eb',
        tension: 0.4,
      },
    ],
  }
})

const chartOptions = {
  conversion: {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Conversion Rate (%)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  },
}

// Formatting functions
function getTrendSeverity(trend: number): string {
  if (trend > 10) return 'success'
  if (trend > 0) return 'info'
  if (trend > -10) return 'warning'
  return 'danger'
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

function refreshMetrics() {
  store.fetchMetrics()
}

onMounted(() => {
  refreshMetrics()
})
</script>

<template>
  <div class="p-4">
    <!-- Header with Date Range -->
    <div class="flex justify-between align-items-center mb-4">
      <h1 class="text-3xl font-bold">Referral Analytics</h1>
      <div class="flex gap-3">
        <PrimeDatePicker
          v-model="timeRange"
          selectionMode="range"
          :showIcon="true"
          placeholder="Select Date Range"
          @date-select="refreshMetrics"
        />
        <PrimeButton
          :loading="isLoading"
          @click="refreshMetrics"
        >
          <Icon name="mdi:refresh" />
        </PrimeButton>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex justify-content-center"
    >
      <PrimeProgressSpinner />
    </div>

    <template v-else-if="metrics">
      <!-- Key Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="col-12 md:col-3">
          <PrimeCard class="h-full">
            <template #title>
              <div class="flex align-items-center">
                <i class="pi pi-chart-line mr-2"></i>
                Total Referrals
              </div>
            </template>
            <template #content>
              <div class="text-4xl font-bold mb-3">{{ formatNumber(metrics.totalReferrals) }}</div>
              <PrimeTag :severity="getTrendSeverity(12.5)">+12.5%</PrimeTag>
            </template>
          </PrimeCard>
        </div>

        <div class="col-12 md:col-3">
          <PrimeCard class="h-full">
            <template #title>
              <div class="flex align-items-center">
                <i class="pi pi-percentage mr-2"></i>
                Conversion Rate
              </div>
            </template>
            <template #content>
              <div class="text-4xl font-bold mb-3">{{ formatPercent(metrics.conversionRate) }}</div>
              <PrimeTag severity="success">+2.3%</PrimeTag>
            </template>
          </PrimeCard>
        </div>

        <div class="col-12 md:col-3">
          <PrimeCard class="h-full">
            <template #title>
              <div class="flex align-items-center">
                <i class="pi pi-dollar mr-2"></i>
                Total Value
              </div>
            </template>
            <template #content>
              <div class="text-4xl font-bold mb-3">{{ formatCurrency(metrics.totalValue) }}</div>
              <PrimeTag severity="success">+15.7%</PrimeTag>
            </template>
          </PrimeCard>
        </div>

        <div class="col-12 md:col-3">
          <PrimeCard class="h-full">
            <template #title>
              <div class="flex align-items-center">
                <i class="pi pi-users mr-2"></i>
                Active Referrers
              </div>
            </template>
            <template #content>
              <div class="text-4xl font-bold mb-3">{{ metrics.activeReferrers }}</div>
              <PrimeTag severity="info">+1</PrimeTag>
            </template>
          </PrimeCard>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 mt-4 gap-4">
        <div class="col-12 lg:col-6">
          <PrimeCard>
            <template #title>Conversion Trend</template>
            <template #content>
              <div style="height: 400px">
                <PrimeChart
                  class="h-full"
                  type="line"
                  :data="conversionChartData"
                  :options="chartOptions.conversion"
                />
              </div>
            </template>
          </PrimeCard>
        </div>

        <div class="col-12 lg:col-4 h-full">
          <PrimeCard class="h-full">
            <template #title>Top Performers</template>
            <template #content>
              <div
                v-for="performer in metrics.topPerformers"
                :key="performer.referrerCode"
                class="mb-4"
              >
                <div class="flex justify-content-between align-items-center mb-2">
                  <span class="font-medium">{{ performer.referrerCode }}</span>
                  <span>{{ formatCurrency(performer.totalValue) }}</span>
                </div>
                <PrimeProgressBar
                  :value="performer.conversionRate"
                  :showValue="true"
                />
              </div>
            </template>
          </PrimeCard>
        </div>
      </div>

      <!-- Distribution Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div class="col-12 lg:col-6">
          <PrimeCard class="h-full">
            <template #title>Device Distribution</template>
            <template #content>
              <PrimeDataTable
                :value="deviceDistributionData"
                stripedRows
                class="p-datatable-sm"
              >
                <PrimeColumn
                  field="device"
                  header="Device Type"
                />
                <PrimeColumn
                  field="percentage"
                  header="Percentage"
                >
                  <template #body="slotProps">
                    <PrimeProgressBar
                      :value="slotProps.data.percentage"
                      :showValue="true"
                    />
                  </template>
                </PrimeColumn>
                <PrimeColumn
                  field="count"
                  header="Count"
                />
              </PrimeDataTable>
            </template>
          </PrimeCard>
        </div>

        <div class="col-12 lg:col-6">
          <PrimeCard class="h-full">
            <template #title>Country Distribution</template>
            <template #content>
              <PrimeDataTable
                :value="countryDistributionData"
                stripedRows
                class="p-datatable-sm"
              >
                <PrimeColumn
                  field="country"
                  header="Country"
                />
                <PrimeColumn
                  field="percentage"
                  header="Percentage"
                >
                  <template #body="slotProps">
                    <PrimeProgressBar
                      :value="slotProps.data.percentage"
                      :showValue="true"
                    />
                  </template>
                </PrimeColumn>
                <PrimeColumn
                  field="count"
                  header="Count"
                />
              </PrimeDataTable>
            </template>
          </PrimeCard>
        </div>
      </div>
    </template>

    <div
      v-else-if="error"
      class="p-message p-message-error"
    >
      {{ error }}
    </div>
  </div>
</template>
