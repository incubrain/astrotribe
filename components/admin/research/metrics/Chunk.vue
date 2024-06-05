<script setup lang="ts">
const props = defineProps({
  metrics: {
    type: Object as PropType<any>,
    required: true
  }
})

const insights = computed(() => {
  const { chunks, performance, count, error_count } = props.metrics;
  const memoryUsageChange =
    ((performance.memory_usage_end - performance.memory_usage_start) /
      performance.memory_usage_start) *
    100;

  return [
    { label: 'Avg. Length', value: chunks.avg_length },
    { label: 'Smallest Chunk', value: chunks.smallest ?? 'N/A' },
    { label: 'Largest Chunk', value: chunks.largest },
    { label: '# Small Chunks', value: chunks.undersized.length },
    { label: '# Large Chunks', value: chunks.oversized.length },
    { label: 'Total Chunks', value: count.chunks },
    { label: 'Memory Usage Change (%)', value: memoryUsageChange.toFixed(2) },
    { label: 'Duration (s)', value: (performance.total_duration / 1000).toFixed(2) },
    { label: 'Error Count', value: error_count }
  ];
});
</script>

<template>
  <div class="border-color background rounded-lg border p-4 shadow-md">
    <h2 class="pb-4 text-xl font-bold">Chunk Metrics</h2>
    <div class="grid grid-cols-[repeat(auto-fill,_minmax(120px,_1fr))] border border-color">
      <div v-for="(insight, index) in insights" :key="index" class="metric">
        <p><strong>{{ insight.label }}:</strong> {{ insight.value }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
