<script setup lang="ts">
export interface ChunkMetrics {
  averageLengthBefore: number
  averageLengthAfter: number
  averageDifference: number
  averageItemsCleaned: number
  longestLengthBefore: number
  longestLengthAfter: number
  shortestLengthBefore: number
  shortestLengthAfter: number
  medianLengthBefore: number
  medianLengthAfter: number
  standardDeviationBefore: number
  standardDeviationAfter: number
}

const chunksStore = useChunksStore()
const { chunks, flaggedChunks } = storeToRefs(chunksStore)

const isFlagged = ref(false)

const sortedChunks = computed(() => (isFlagged.value ? flaggedChunks.value : chunks.value))
const FETCH_AMOUNT = 100
const metrics = reactive({
  flagged: null as null | ChunkMetrics,
  unflagged: null as null | ChunkMetrics
})
const currentMetrics = computed(() => (isFlagged.value ? metrics.flagged : metrics.unflagged))
watch(
  isFlagged,
  async () => {
    if (sortedChunks.value.length !== 0 && sortedChunks.value.length < FETCH_AMOUNT) {
      return
    }
    await chunksStore.fetchChunks(isFlagged.value, 100)

    if (isFlagged.value) {
      metrics.flagged = chunksStore.calculateMetrics(sortedChunks.value)
    } else {
      metrics.unflagged = chunksStore.calculateMetrics(sortedChunks.value)
    }
  },
  { immediate: true }
)

function roundToTwoDecimalPlaces(value: number): number {
  return Math.round(value * 100) / 100;
}

function roundToNDecimalPlaces(value: number, n: number) {
  return Number(value.toFixed(n));
}

interface CostAndStorageParams {
  researchLength: number;
  chunkLength: number;
  embeddingCount: number;
}

function calculateCostAndStorage({
  researchLength,
  chunkLength,
  embeddingCount,
}: CostAndStorageParams): {
  tokens: number;
  cost_usd: number;
  embedding_row_size: number;
  research_row_size: number;
} {
  const costPerToken = 0.02 / 1000000; // $0.02 per million tokens
  const tokens = Math.ceil(chunkLength / 4);
  const cost_usd = roundToNDecimalPlaces(tokens * costPerToken, 6);
  const embedding_row_size = chunkLength + embeddingCount * 1536 * 4; // Approximate size in bytes (1536 dimensions (text-embedding-3-small) * 4 bytes per float for embeddings)
  const research_row_size = researchLength;

  return { tokens, cost_usd, embedding_row_size, research_row_size };
}

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
</script>

<template>
  <div class="p-4 rounded-lg shadow-md">
    <AdminChunksHeader>
      <PrimeButton @click="chunksStore.fetchChunks(true, 100)"> Get Chunks </PrimeButton>
      <div class="flex gap-2 h-full justify-center items-center">
        <p>Flagged?</p>
        <PrimeInputSwitch v-model="isFlagged" />
      </div>
    </AdminChunksHeader>
    <h2 class="text-xl font-bold mb-4">Chunks Metrics</h2>
    <div>
      <p>Total Chunks: {{ sortedChunks.length }}</p>
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-8"
      v-if="metricItems?.length"
    >
      <div
        v-for="item in metricItems"
        :key="item.label"
        class="p-4 rounded-lg background border border-color flex flex-col gap-3"
      >
        <h3 class="font-semibold text-center">{{ item.label }}</h3>
        <p class="text-xl font-bold text-center text-primary-600">{{ item.value.toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
