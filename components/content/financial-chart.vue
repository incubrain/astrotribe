<template>
  <div class="w-full">
    <PrimeChart
      :id="`chart-${componentId}`"
      :type="chartType"
      :data="chartData"
      :options="chartOptions"
      class="w-full h-30rem"
      :pt="{
        canvas: 'w-full h-[500px]'
      }"
    />
  </div>
</template>

<script setup lang="ts">
const componentId = useId()

defineProps({
  chartType: {
    type: String,
    required: true
  },
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    default: () => ({
      plugins: {
        legend: {
          labels: {
            color: '#fff'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#fff'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        y: {
          ticks: {
            color: '#fff'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    })
  }
})
console.log('ChartInstance: ', componentId)
</script>

<style></style>
