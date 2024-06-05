<template>
  <div class="w-full">
    <PrimeChart
      :id="`chart-${componentId}`"
      :type="chartType"
      :data="chartData"
      class="h-30rem w-full"
      :pt="{
        canvas: 'w-full h-[500px]'
      }"
    />
  </div>
</template>

<script setup lang="ts">
import type { ResearchDataKey } from '@/composables/research.store'
const componentId = useId()

const props = defineProps({
  chartType: {
    type: String,
    default: 'doughnut'
  },
  chartData: {
    type: Object,
    required: true
  }
})

// const computedChartOptions = computed(() => ({
//   ...props.chartOptions,
//   plugins: {
//     legend: {
//       labels: {
//         color: '#fff',
//         ...props.chartOptions?.plugins?.legend?.labels
//       }
//     }
//   }
// }))
</script>

<style></style>
