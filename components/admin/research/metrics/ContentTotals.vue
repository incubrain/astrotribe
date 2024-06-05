<script setup lang="ts">
const calculateTotals = (metrics: any[]) => {
  return metrics.reduce(
    (acc, curr) => {
      // Chunks
      acc.chunks.total += curr.chunks.total
      acc.chunks.avg_length += curr.chunks.avg_length
      acc.chunks.smallest =
        acc.chunks.smallest === null
          ? curr.chunks.smallest
          : Math.min(acc.chunks.smallest, curr.chunks.smallest)
      acc.chunks.largest = Math.max(acc.chunks.largest, curr.chunks.largest)
      acc.chunks.lengths = acc.chunks.lengths.concat(curr.chunks.lengths)
      acc.chunks.undersized = acc.chunks.undersized.concat(curr.chunks.undersized)
      acc.chunks.oversized = acc.chunks.oversized.concat(curr.chunks.oversized)

      // Count
      acc.count.citations += curr.count.citations
      acc.count.figures += curr.count.figures
      acc.count.math += curr.count.math

      // Length
      acc.length.chunks += curr.length.chunks
      acc.length.math += curr.length.math
      acc.length.abstract += curr.length.abstract
      acc.length.citations += curr.length.citations
      acc.length.figures += curr.length.figures

      return acc
    },
    {
      chunks: {
        total: 0,
        avg_length: 0,
        smallest: null,
        largest: 0,
        lengths: [],
        undersized: [],
        oversized: []
      },
      count: {
        citations: 0,
        figures: 0,
        math_parsed: 0,
        math_raw: 0
      },
      length: {
        chunks: 0,
        math: 0,
        abstract: 0,
        citations: 0,
        figures: 0
      }
    }
  )
}

const researchStore = useResearchStore()
const { researchMetrics } = storeToRefs(researchStore)

const totals = computed(() => calculateTotals(researchMetrics.value))

const labeledTotals = computed(() =>
  totals.value
    ? [
        { label: 'Total Chunks', metric: totals.value.chunks.total },
        { label: 'Average Chunk Length', metric: totals.value.chunks.avg_length },
        { label: 'Smallest Chunk', metric: totals.value.chunks.smallest },
        { label: 'Largest Chunk', metric: totals.value.chunks.largest },
        { label: 'Total Citations', metric: totals.value.count.citations },
        { label: 'Total Figures', metric: totals.value.count.figures },
        { label: 'Total Math Parsed', metric: totals.value.count.math_parsed },
        { label: 'Total Math Raw', metric: totals.value.count.math_raw },
        { label: 'Chunks Length', metric: totals.value.length.chunks },
        { label: 'Math Length', metric: totals.value.length.math },
        { label: 'Abstract Length', metric: totals.value.length.abstract },
        { label: 'Citations Length', metric: totals.value.length.citations },
        { label: 'Figures Length', metric: totals.value.length.figures }
      ]
    : null
)
</script>

<template>
  <div>
    <h2 class="mb-4 text-xl font-bold">Content Totals</h2>
    <div
      class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:gap-8"
      v-if="!!labeledTotals"
    >
      <div
        v-for="item in labeledTotals"
        :key="item.label"
        class="background border-color flex flex-col gap-3 rounded-lg border p-4"
      >
        <h3 class="text-center font-semibold">{{ item.label }}</h3>
        <p class="text-center text-xl font-bold text-primary-600">{{ item.metric?.toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
