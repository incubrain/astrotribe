<script setup lang="ts">
// need to have the totals calculated via sql


const { chunk } = useResearchMetrics()

const researchStore = useResearchStore()
const { researchMetrics } = storeToRefs(researchStore)

const performanceMetrics = ref({
  avgProcessingTimePerChunk: calculateAverageProcessingTime(metrics.value.performance, totalChunks);
  memoryUsagePerChunk: calculateMemoryUsagePerChunk(metrics.value.performance, totalChunks);
  peakMemoryUsage: calculatePeakMemoryUsage(memoryUsageOverTime);
  memoryEfficiency: calculateMemoryEfficiency(metrics.value.performance, totalChunks);
  timeEfficiency: calculateTimeEfficiency(metrics.value.performance, totalChunks);
  resourceUsageIndex: calculateResourceUsageIndex(memoryEfficiency, timeEfficiency);
});

</script>

<template>
  <div> </div>
</template>

<style scoped></style>
