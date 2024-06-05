<script setup lang="ts">
const { chunk } = useResearchMetrics()
const { calculate } = useBaseMetrics()

const researchStore = useResearchStore()
const { researchMetrics } = storeToRefs(researchStore)

const currentMetrics = ref(false)
const metricItems = computed(() =>
  !!currentMetrics.value
    ? [
        {
          label: 'Average Length Before Cleaning',
          value: currentMetrics.value.averageLengthBefore
        },
        { label: 'Average Length After Cleaning', value: currentMetrics.value.averageLengthAfter },
        { label: 'Average Difference in Length', value: currentMetrics.value.averageDifference },
        { label: 'Average Items Cleaned', value: currentMetrics.value.averageItemsCleaned },
        {
          label: 'Longest Length Before Cleaning',
          value: currentMetrics.value.longestLengthBefore
        },
        { label: 'Longest Length After Cleaning', value: currentMetrics.value.longestLengthAfter },
        {
          label: 'Shortest Length Before Cleaning',
          value: currentMetrics.value.shortestLengthBefore
        },
        {
          label: 'Shortest Length After Cleaning',
          value: currentMetrics.value.shortestLengthAfter
        },
        { label: 'Median Length Before Cleaning', value: currentMetrics.value.medianLengthBefore },
        { label: 'Median Length After Cleaning', value: currentMetrics.value.medianLengthAfter },
        {
          label: 'Standard Deviation Before Cleaning',
          value: currentMetrics.value.standardDeviationBefore
        },
        {
          label: 'Standard Deviation After Cleaning',
          value: currentMetrics.value.standardDeviationAfter
        }
      ]
    : undefined
)

// const newMetrics = ref({
//   chunkSizeVariability:  chunk.calculateChunkSizeVariability(researchMetrics.value.length.chunks),
//   avgCitationDensity: chunk.calculateAverageCitationDensity(totalCitations, totalChunks),
//   figureInclusionRate:  chunk.calculateFigureInclusionRate(metrics.value.chunks.chunking, totalChunks),
//   mathExpressionDensity: chunk.calculateMathExpressionDensity(totalMathExpressions, totalChunks);
// });
</script>

<template>
  <div>
    <h2 class="mb-4 text-xl font-bold">Costs</h2>
    <div
      class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:gap-8"
      v-if="metricItems?.length"
    >
      <div
        v-for="item in metricItems"
        :key="item.label"
        class="background border-color flex flex-col gap-3 rounded-lg border p-4"
      >
        <h3 class="text-center font-semibold">{{ item.label }}</h3>
        <p class="text-center text-xl font-bold text-primary-600">{{ item.value.toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
