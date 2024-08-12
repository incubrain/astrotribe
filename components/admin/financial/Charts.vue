<script setup lang="ts">
defineProps<{
  charts: Chart
}>()
</script>

<template>
  <div class="grid h-full w-full grid-cols-1 gap-4 xl:gap-12">
    <div
      v-for="(chart, index) in charts"
      :key="`financial-chart-${index}`"
      class="flex flex-col gap-4 lg:flex-row xl:gap-12"
    >
      <div
        class="border-color w-full min-w-[260px] space-y-4 rounded-lg border p-4 lg:max-w-[360px]"
      >
        <h3 class="text-2xl font-semibold text-primary-600">{{ chart.title }}</h3>
        <p class="text-lg">{{ chart.subtitle }}</p>
      </div>
      <Chart
        class="flex h-full w-full items-center justify-center py-8"
        :chart="chart"
      />
    </div>
  </div>
</template>

<style scoped></style>
