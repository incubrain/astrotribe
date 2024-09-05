<script setup lang="ts">
import { ref, computed } from 'vue'

interface TimePeriod {
  name: string
  value: string
}

interface TableOption {
  name: string
  value: string
}

interface GrowthData {
  period_end_time: string
  row_count: number
  growth_count: number
  growth_percentage: number
}

const supabase = useSupabaseClient()

const tables: TableOption[] = [
  { name: 'Companies', value: 'companies' },
  { name: 'Company URLs', value: 'company_urls' },
  { name: 'News', value: 'news' },
  { name: 'Users', value: 'user_profiles' },
]

const timePeriods: TimePeriod[] = [
  { name: 'Day', value: '1 day' },
  { name: 'Week', value: '1 week' },
  { name: 'Month', value: '1 month' },
  { name: 'Quarter', value: '3 months' },
  { name: 'Year', value: '1 year' },
]

const selectedTable = ref<string>('companies')
const selectedTimePeriod = ref<string>('1 day')
const numPeriods = ref<number>(6)
const growthData = ref<GrowthData[]>([])
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

const dummyCalculateTableGrowth = (
  tableName: string,
  timePeriod: string,
  numPeriods: number,
): Promise<{ data: GrowthData[], error: any }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseCount
        = {
          companies: 1000,
          users: 10000,
          products: 5000,
        }[tableName] || 1000

      const growthRates = {
        '1 day': 0.01,
        '1 week': 0.05,
        '1 month': 0.1,
        '3 months': 0.2,
        '1 year': 0.5,
      }

      const baseGrowthRate = growthRates[timePeriod] || 0.01
      const variability = 0.5 // 50% variability in growth rate

      const data: GrowthData[] = []
      let currentCount = baseCount

      for (let i = 0; i < numPeriods; i++) {
        const growthRate = baseGrowthRate * (1 + (Math.random() - 0.5) * variability)
        const growthCount = Math.round(currentCount * growthRate)
        const newCount = currentCount + growthCount

        data.push({
          period_end_time: new Date(Date.now() - i * getMilliseconds(timePeriod)).toISOString(),
          row_count: newCount,
          growth_count: growthCount,
          growth_percentage: growthRate * 100,
        })

        currentCount = newCount
      }

      resolve({ data: data.reverse(), error: null })
    }, 500) // Simulate network delay
  })
}

const getMilliseconds = (period: string): number => {
  const ms = {
    '1 day': 24 * 60 * 60 * 1000,
    '1 week': 7 * 24 * 60 * 60 * 1000,
    '1 month': 30 * 24 * 60 * 60 * 1000,
    '3 months': 90 * 24 * 60 * 60 * 1000,
    '1 year': 365 * 24 * 60 * 60 * 1000,
  }
  return ms[period] || ms['1 day']
}

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    const { data, error: rpcError } = await dummyCalculateTableGrowth(
      selectedTable.value,
      selectedTimePeriod.value,
      numPeriods.value,
    )

    // await supabase.rpc('calculate_table_growth', {
    //   p_table_name: selectedTable.value,
    //   p_time_period: selectedTimePeriod.value,
    //   p_num_periods: numPeriods.value
    // })
    if (rpcError) throw rpcError
    growthData.value = data
  }
  catch (err) {
    error.value = 'Failed to fetch growth data'
    console.error(err)
  }
  loading.value = false
}

const calculateTotalGrowth = () => {
  return growthData.value.reduce((total, period) => total + period.growth_count, 0)
}

const calculateAverageGrowthRate = () => {
  const totalGrowthRate = growthData.value.reduce(
    (total, period) => total + period.growth_percentage,
    0,
  )
  return totalGrowthRate / (growthData.value.length - 1) // Exclude the first period as it's always 0
}

const chartData = computed(() => ({
  labels: growthData.value.map(d => new Date(d.period_end_time).toLocaleDateString()).reverse(),
  datasets: [
    {
      label: 'Row Count',
      data: growthData.value.map(d => d.row_count).reverse(),
      borderColor: '#42A5F5',
      tension: 0.4,
    },
    {
      label: 'Growth Percentage',
      data: growthData.value.map(d => d.growth_percentage).reverse(),
      borderColor: '#66BB6A',
      tension: 0.4,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const exportToCSV = () => {
  const headers = ['Period End Time', 'Row Count', 'Growth Count', 'Growth Percentage']
  const csvContent = [
    headers.join(','),
    ...growthData.value.map(row =>
      [row.period_end_time, row.row_count, row.growth_count, row.growth_percentage].join(','),
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${selectedTable.value}_growth_data.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">
      Table Growth
    </h1>

    <div class="mb-4 flex flex-wrap gap-4">
      <PrimeSelect
        v-model="selectedTable"
        :options="tables"
        option-label="name"
        option-value="value"
        placeholder="Select Table"
      />
      <PrimeSelect
        v-model="selectedTimePeriod"
        :options="timePeriods"
        option-label="name"
        option-value="value"
        placeholder="Select Time Period"
      />
      <PrimeInputNumber
        v-model="numPeriods"
        :min="1"
        :max="10"
        placeholder="Number of Periods"
      />
      <PrimeButton
        label="Fetch Data"
        @click="fetchData"
      />
      <PrimeButton
        label="Export to CSV"
        @click="exportToCSV"
      />
    </div>

    <PrimeMessage
      v-if="loading"
      severity="info"
      :life="3000"
    >
      Loading data...
    </PrimeMessage>
    <PrimeMessage
      v-if="error"
      severity="error"
      :closable="true"
    >
      {{ error }}
    </PrimeMessage>

    <div
      v-if="growthData.length"
      class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3"
    >
      <PrimeCard>
        <template #title>
          Current Count
        </template>
        <template #content>
          <p class="text-2xl font-bold">
            {{ growthData[0].row_count }}
          </p>
        </template>
      </PrimeCard>
      <PrimeCard>
        <template #title>
          Total Growth
        </template>
        <template #content>
          <p class="text-2xl font-bold">
            {{ calculateTotalGrowth() }}
          </p>
        </template>
      </PrimeCard>
      <PrimeCard>
        <template #title>
          Average Growth Rate
        </template>
        <template #content>
          <p class="text-2xl font-bold">
            {{ calculateAverageGrowthRate().toFixed(2) }}%
          </p>
        </template>
      </PrimeCard>
    </div>

    <PrimeCard v-if="growthData.length">
      <template #title>
        Growth Trend
      </template>
      <template #content>
        <PrimeChart
          class="min-h-64"
          type="line"
          :data="chartData"
          :options="chartOptions"
        />
      </template>
    </PrimeCard>
  </div>
</template>
