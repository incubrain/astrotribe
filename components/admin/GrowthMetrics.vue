<script setup lang="ts">
const { store, loadMore, refresh, isSelecting } = useSelectData('table_statistics', {
  columns: 'table_name, table_size, row_count, capture_time',
  orderBy: { column: 'capture_time', ascending: false },
  limit: 100,
  initialFetch: true,
})

const { handleError } = useErrorHandler()
const toast = useNotification()
const { format, calculate } = useBaseMetrics()

const isLoading = ref(true)
const metrics = ref([] as any)
const chartData = ref(null)

const chartOptions = reactive({
  plugins: {
    legend: {
      labels: { color: '#ffffff' },
    },
  },
  scales: {
    x: {
      ticks: { color: '#ffffff' },
      grid: { color: 'rgba(255, 255, 255, 0.2)' },
    },
    y: {
      ticks: { color: '#ffffff' },
      grid: { color: 'rgba(255, 255, 255, 0.2)' },
    },
  },
})

const formatBytes = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${format.roundToN(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`
}

const processData = () => {
  const data = store.items
  if (data.length === 0) return

  const latestData = data[0]
  const previousWeekData = data.find(
    (d) => new Date(d.capture_time) <= new Date(latestData.capture_time - 7 * 24 * 60 * 60 * 1000),
  )

  const uniqueTables = new Set(data.map((d) => d.table_name))

  metrics.value = [
    {
      name: 'Total Tables',
      value: uniqueTables.size,
      growth: 0,
    },
    {
      name: 'Total Size',
      value: formatBytes(latestData.table_size),
      growth: calculate.percentile([latestData.table_size, previousWeekData?.table_size || 0], 50),
    },
    {
      name: 'Total Rows',
      value: latestData.row_count.toLocaleString(),
      growth: calculate.percentile([latestData.row_count, previousWeekData?.row_count || 0], 50),
    },
    {
      name: 'Avg Size per Table',
      value: formatBytes(latestData.table_size / uniqueTables.size),
      growth: calculate.percentile(
        [
          latestData.table_size / uniqueTables.size,
          previousWeekData
            ? previousWeekData.table_size
            / new Set(
              data
                .filter((d) => d.capture_time <= previousWeekData.capture_time)
                .map((d) => d.table_name),
            ).size
            : 0,
        ],
        50,
      ),
    },
  ]

  const chartDataMap = data.reverse().reduce((acc, curr) => {
    const date = new Date(curr.capture_time).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = curr.table_size / (1024 * 1024) // Convert to MB
    }
    return acc
  }, {})

  chartData.value = {
    labels: Object.keys(chartDataMap),
    datasets: [
      {
        label: 'Total Table Size (MB)',
        data: Object.values(chartDataMap),
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.4,
      },
    ],
  }
}

onMounted(async () => {
  try {
    await loadMore()
    processData()
  }
  catch (error) {
    handleError(error, 'Error loading dashboard data')
    toast.error({
      summary: 'Data Load Error',
      message: 'Failed to load dashboard data. Please try again later.',
    })
  }
  finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <h1 class="mb-6 text-3xl font-bold">
      Growth Dashboard
    </h1>
    <div
      v-if="isLoading"
      class="flex h-64 items-center justify-center"
    >
      <PrimeProgressSpinner />
    </div>
    <div v-else>
      <div class="grid gap-4">
        <div
          v-for="metric in metrics"
          :key="metric.name"
          class="col-12 md:col-6 lg:col-3"
        >
          <PrimeCard class="h-full">
            <template #title>
              <h2 class="mb-2 text-xl font-semibold">
                {{ metric.name }}
              </h2>
            </template>
            <template #content>
              <div class="mb-2 text-3xl font-bold">
                {{ metric.value }}
              </div>
              <div class="text-sm">
                <span
                  :class="{
                    'text-green-500': metric.growth > 0,
                    'text-red-500': metric.growth < 0,
                  }"
                >
                  {{ metric.growth > 0 ? '▲' : '▼' }}
                  {{ Math.abs(metric.growth).toFixed(2) }}%
                </span>
                <span class="ml-1">since last week</span>
              </div>
            </template>
          </PrimeCard>
        </div>
      </div>
      <div class="mt-8">
        <h2 class="mb-4 text-2xl font-semibold">
          Table Size Growth
        </h2>
        <PrimeChart
          type="line"
          :data="chartData"
          :options="chartOptions"
          class="h-96"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
