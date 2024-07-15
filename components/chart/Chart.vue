<template>
  <div
    class="relative flex w-full flex-col gap-4"
    v-if="chart"
  >
    <PrimeDrawer
      v-model:visible="isFullScreen"
      position="full"
      :pt="{ content: 'bg-black w-full flex justify-center items-center' }"
    >
      <template #header>
        <div class="flex flex-col gap-3">
          <h2 class="text-xl font-bold">{{ chart.title }}</h2>
          <p class="text-sm">{{ chart.subtitle }}</p>
        </div>
      </template>
      <div
        class="border-color w-full max-w-xs rounded-lg border p-4"
        v-if="chart.info"
      >
        <PrimeButton
          class="self-end"
          @click="toggleRange(chart.id)"
        >
          Toggle Range
        </PrimeButton>
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
        class="mx-auto h-full max-h-[80vh] w-full max-w-[78vw] flex-grow pt-4"
        :id="`chart-${componentId}-fullscreen`"
        :type="chart.type"
        :data="chart.data"
        :plugins="[customPaddingPlugin, customDounutPlugin]"
        :options="mergedChartOptions"
      />
    </PrimeDrawer>
    <PrimeChart
      class="flex max-h-[600px] min-h-96 min-w-full items-center justify-center"
      :id="`chart-${componentId}`"
      :type="chart.type"
      :data="chart.data"
      :plugins="[customPaddingPlugin]"
      :options="mergedChartOptions"
    />
    <div class="border-color flex w-full gap-2 rounded-lg border px-3 py-2">
      <button
        @click="isFullScreen = true"
        class="border-color flex gap-2 border-r pr-2"
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

<script setup lang="ts">
const componentId = useId()

const isFullScreen = ref(false)

const emit = defineEmits(['update:chartRange'])

function toggleRange(chartId: number) {
  emit('update:chartRange', chartId)
}

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

interface Chart {
  id: number
  title: string
  subtitle: string
  info: string
  type: ChartType
  data: any
  options: any
}

const props = defineProps({
  chart: {
    type: Object as PropType<Chart>,
    default: () => null
  }
})

function formatINR(amount: number): string {
  const absAmount = Math.abs(amount)
  let formattedAmount

  if (absAmount >= 1_00_00_00_000) {
    formattedAmount = (absAmount / 1_00_00_00_000).toFixed(2) + 'CR'
  } else if (absAmount >= 1_00_00_000) {
    formattedAmount = (absAmount / 1_00_00_000).toFixed(2) + 'CR'
  } else if (absAmount >= 1_00_000) {
    formattedAmount = (absAmount / 1_00_000).toFixed(2) + 'L'
  } else if (absAmount >= 1_000) {
    formattedAmount = (absAmount / 1_000).toFixed(2) + 'K'
  } else {
    formattedAmount = absAmount.toString()
  }

  return amount < 0 ? '-' + formattedAmount : formattedAmount
}

const gridColor = 'rgba(255, 255, 255, 0.1)'

const customPaddingPlugin = {
  id: 'customPaddingPlugin',
  beforeInit: (chart: any) => {
    console.log('Fitting legend')
    const originalFit = chart.legend.fit
    chart.legend.fit = function fit() {
      // Call the original function and bind scope in order to use `this` correctly inside it
      originalFit.bind(chart.legend)()
      // Change the height as suggested in other answers
      this.height += 20
    }
  }
}

function getFirstNumber(...values: any[]): number {
  for (const value of values) {
    if (typeof value === 'number' && !isNaN(value)) {
      return value
    }
  }
  return 0 // Default value if no number is found
}

const defaultChartOptions = computed(() => ({
  interaction: {
    mode: 'index'
  },
  plugins: {
    legend: {
      labels: {
        color: '#fff'
      },
      position: 'top',
      align: 'center'
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      padding: 10,
      callbacks: {
        label: function (tooltipItem: any) {
          const label = tooltipItem.dataset.label ?? tooltipItem.label ?? ''
          const value = getFirstNumber(tooltipItem.raw, tooltipItem.parsed)
          return `${label}: ${formatINR(value)}`
        },
        labelColor: function (context: any) {
          return {
            borderColor: 'black',
            backgroundColor: context.dataset.backgroundColor,
            borderWidth: 2,
            borderRadius: 2
          }
        }
      }
    }
  },

  scales: {
    x: {
      ticks: {
        color: '#fff'
      },
      grid: {
        color: gridColor
      }
    },
    y: {
      display: true,
      ticks: {
        callback: function (value) {
          return formatINR(value)
        }
      },
      grid: {
        color: gridColor
      }
    }
  },

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
      }
    }
  }
}))

function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

// Simple merge function to deeply merge objects
function mergeDeep(target: any, source: any) {
  const output = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = mergeDeep(target[key], source[key])
        }
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}

const mergedChartOptions = computed(() => {
  return mergeDeep(defaultChartOptions.value, props.chart.options || {})
})
</script>

<style></style>
