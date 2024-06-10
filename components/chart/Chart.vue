<template>
  <div class="w-full">
    <PrimeChart
      :id="`chart-${componentId}`"
      :type="chartType"
      :data="chartData"
      :options="mergedChartOptions"
      class="h-30rem w-full"
      :pt="{
        canvas: 'w-full h-[500px] text-white'
      }"
    />
  </div>
</template>

<script setup lang="ts">
const componentId = useId()

const props = defineProps({
  chartType: {
    type: String,
    default: 'doughnut'
  },
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    required: false
  }
})

const gridColor = '#3b3b3b'

const defaultChartOptions = {
  plugins: {
    legend: {
      labels: {
        color: '#fff'
      }
    },
    tooltips: {
      mode: 'index',
      intersect: false
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
      ticks: {
        color: '#fff'
      },
      grid: {
        color: gridColor
      }
    }
  }
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

function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

const mergedChartOptions = computed(() => {
  return mergeDeep(defaultChartOptions, props.chartOptions || {})
})
</script>

<style></style>
