<script setup lang="ts">
import type { TooltipOptions, ChartOptions, TooltipItem, LegendOptions, LabelItem } from 'chart.js'

const componentId = useId()

const { formatCurrency, formatStorage, formatNumber } = useFinancials()

const isFullScreen = ref(false)

type DataType = 'currency' | 'storage' | 'number' | 'months' | 'percentage' | 'users' | 'employees'
type AxisType = 'y-2'
type AxisPosiion = 'top' | 'right' | 'bottom' | 'left'
type ScaleType = 'logarithmic' | 'linear'

type ChartType =
  | 'line'
  | 'bar'
  | 'doughnut'
  | 'pie'
  | 'polarArea'
  | 'bubble'
  | 'scatter'
  | 'area'
  | 'radar'

interface Dataset {
  label: string
  data: number[]
  backgroundColor: string
  borderColor?: string
  valueType: DataType
  type?: ChartType
}

interface Chart {
  id: number
  scaleType: ScaleType
  title: string
  subtitle: string
  type: string
  horizontal?: boolean
  hideAxes?: boolean
  data: ChartData
}

const props = defineProps({
  chart: {
    type: Object as PropType<Chart>,
    default: () => null,
  },
})

const preformattedCharts = computed(() => {
  if (!isChartDataReady.value) return null

  return {
    ...props.chart,
    data: {
      ...props.chart.data,
      datasets: props.chart.data.datasets?.map((dataset: Dataset) => {
        const yAxisID = dataset.type ? 'y-2' : 'y'
        return {
          yAxisID,
          ...dataset,
        }
      }),
    },
  }
})

const customPaddingPlugin = {
  id: 'customPaddingPlugin',
  beforeInit: (chart: any) => {
    const originalFit = chart.legend.fit
    chart.legend.fit = function fit() {
      // Call the original function and bind scope in order to use `this` correctly inside it
      originalFit.bind(chart.legend)()
      // Change the height as suggested in other answers
      this.height += 20
    }
  },
}

function getFirstNumber(...values: any[]): number {
  for (const value of values) {
    if (typeof value === 'number' && !isNaN(value)) {
      return value
    }
  }
  return 0
}

const chartOptions = computed(() => {
  if (!isChartDataReady.value) return {}

  const isPieChart = props.chart.type === 'pie' || props.chart.type === 'doughnut'

  return {
    indexAxis: props.chart.horizontal ? 'y' : 'x', // Apply horizontal layout if specified
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        padding: 10,
        callbacks: {
          label: formatTooltipLabel,
          labelColor: (context: any) => {
            return {
              borderColor: 'black',
              backgroundColor: context.dataset.backgroundColor,
              borderWidth: 2,
              borderRadius: 2,
            }
          },
        },
      },
      legend: generateLegend,
      datalabels: false,
    },
    scales: generateScales(
      preformattedCharts.value.data.datasets,
      props.chart.scaleType,
      isPieChart || props.chart.hideAxes,
    ),
    animations: {
      y: {
        easing: 'easeInOutElastic',
        from: (ctx: any) => {
          if (ctx.type === 'data') {
            if (ctx.mode === 'default' && !ctx.dropped) {
              ctx.dropped = true
              return 0
            }
          }
        },
      },
    },
  } as ChartOptions
})

function generateLegend(): Partial<LegendOptions<'line'>> {
  return {
    labels: {
      color: '#fff',
      usePointStyle: false,
      pointStyle: 'rectRounded',
      pointStyleWidth: 10,
      boxWidth: 10,
      boxHeight: 10,
      boxPadding: 20,
      borderRadius: 100,
      font: {
        size: 14,
        weight: 'bold',
      },
    },
    position: 'top',
    align: 'center',
  }
}

const gridColor = 'rgba(255, 255, 255, 0.1)'
function generateScales(
  datasets: Dataset[],
  scaleType: ScaleType = 'linear',
  hideAxes: boolean,
): Record<string, any> {
  if (hideAxes) {
    return {
      x: { display: false },
      y: { display: false },
    }
  }

  const scales: Record<string, any> = {
    x: {
      ticks: { color: '#fff' },
      grid: {
        color: gridColor,
      },
    },
  }

  if (!datasets) return scales

  datasets?.forEach((dataset: Dataset) => {
    const axisId = dataset.yAxisID

    switch (axisId) {
      case 'y-2':
        scales[axisId] = {
          display: true,
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: formatTitle(dataset.valueType),
          },
          ticks: {
            callback: dataFormatters[dataset.valueType],
            color: '#fff',
          },
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
            color: gridColor,
          },
        }
        break
      default:
        scales.y = {
          display: true,
          type: scaleType,
          title: {
            display: true,
            text: formatTitle(dataset.valueType),
          },
          ticks: {
            callback: dataFormatters[dataset.valueType],
            color: '#fff',
          },
          grid: {
            color: gridColor,
          },
        }
    }
  })

  return scales
}

function formatTitle(dataType: DataType) {
  switch (dataType) {
    case 'currency':
      return 'INR'
    case 'storage':
      return 'GB'
    case 'number':
      return 'Number'
    case 'months':
      return 'Months'
    case 'percentage':
      return 'Percent'
    case 'users':
      return 'Users'
    case 'employees':
      return 'Employees'
    default:
      return ''
  }
}

function formatTooltipLabel(tooltipItem: TooltipItem<'line'>) {
  const dataset = props.chart.data.datasets[tooltipItem.datasetIndex] as Dataset
  const value = tooltipItem.raw as number
  const formattedValue = dataFormatters[dataset.valueType](value)
  return `${dataset.label}: ${formattedValue}`
}

const isChartDataReady = computed(() => {
  return (
    props.chart
    && props.chart.data
    && props.chart.data.datasets
    && props.chart.data.datasets.length > 0
    && props.chart.data.labels
    && props.chart.data.labels.length > 0
  )
})

const dataFormatters = {
  currency: (value: number) => formatCurrency(value, 'INR'), // Example default, can be dynamic
  storage: (value: number) => formatStorage(value),
  number: (value: number) => formatNumber(value, 'INR'),
  users: (value: number) => formatNumber(value, 'USD'),
  employees: (value: number) => formatNumber(value, 'USD'),
  months: (value: number) => {
    return `M${Math.round(value)}`
  },
  percentage: (value: number) => {
    if (Math.abs(value) < 1 && value !== 0) {
      return `${value.toFixed(2)}%` // For small non-zero decimals, show two decimal places
    }
    return `${value.toFixed(2)}%` // Round to whole numbers for clarity
  },
}
</script>

<template>
  <div
    v-if="isChartDataReady"
    class="relative flex w-full flex-col gap-4"
  >
    <PrimeDrawer
      v-model:visible="isFullScreen"
      position="full"
      :pt="{ content: 'bg-black w-full flex justify-center items-center' }"
    >
      <template #header>
        <div class="flex flex-col gap-3">
          <h2 class="text-xl font-bold">
            {{ chart.title }}
          </h2>
          <p class="text-sm">
            {{ chart.subtitle }}
          </p>
        </div>
      </template>
      <div
        v-if="chart.info"
        class="border-color w-full max-w-xs rounded-lg border p-4"
      >
        <ul class="pt-4">
          <li
            v-for="info in chart.info"
            :key="info.name"
            class="w-full py-1 text-sm"
          >
            <strong class="text-primary-950">{{ info.name }}: </strong> {{ info.value }}
          </li>
        </ul>
      </div>
      <PrimeChart
        :id="`chart-${componentId}-fullscreen`"
        class="mx-auto h-full max-h-[80vh] w-full max-w-[78vw] flex-grow pt-4"
        :type="chart.type"
        :data="preformattedCharts.data"
        :options="chartOptions"
      />
    </PrimeDrawer>
    <PrimeChart
      :id="`chart-${componentId}`"
      class="flex max-h-[600px] min-h-96 min-w-full items-center justify-center"
      :type="chart.type"
      :data="preformattedCharts.data"
      :plugins="[customPaddingPlugin]"
      :options="chartOptions"
    />
    <div class="border-color flex w-full gap-2 rounded-lg border px-3 py-2">
      <button
        class="border-color flex gap-2 border-r pr-2"
        @click="isFullScreen = true"
      >
        fullscreen
        <Icon
          class="h-6 w-6"
          name="mdi:fullscreen"
        />
      </button>
    </div>
  </div>
</template>

<style></style>
