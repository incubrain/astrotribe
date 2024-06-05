<script setup lang="ts">
const { format } = useBaseMetrics()

interface CostAndStorageParams {
  dataLength: number
  chunkLength: number
  abstractLength: number
  chunkCount: number
}



function calculateCostAndStorage({
  dataLength,
  abstractLength,
  chunkLength,
  chunkCount
}: CostAndStorageParams): any {
  // OPEN AI COSTS:
  // GPT4o INPUT: US$5.00 / 1M tokens
  // GPT4o OUTPUT: US$15.00 / 1M tokens
  // EMBEDDINGS SMALL: US$0.02 / 1M tokens

  const embedCostPerToken = 0.02 / 1000000 // $0.02 per million tokens
  const gptInputCostPerToken = 5 / 1000000 // $5 per million tokens
  const gptOutputCostPerToken = 15 / 1000000 // $15 per million tokens

  const chunkTokens = Math.ceil(chunkLength / 4)
  const dataTokens = Math.ceil(dataLength / 4)
  const abstractTokens = Math.ceil(abstractLength / 4)

  const chunkEmbedCost = format.roundToN(chunkTokens * embedCostPerToken, 6)
  const dataEmbedCost = format.roundToN(dataTokens * embedCostPerToken, 6)
  const abstractEmbedCost = format.roundToN(abstractTokens * embedCostPerToken, 6)

  const abstractSumInputCost = format.roundToN(abstractTokens * gptInputCostPerToken, 6)
  const abstractSumOutputCost = format.roundToN(abstractTokens * gptOutputCostPerToken, 6)

  const embeddingRowSize = chunkLength + chunkCount * 1536 * 4 // Approximate size in bytes (1536 dimensions (text-embedding-3-small) * 4 bytes per float for embeddings)
  const dataRowSize = dataLength * 4
  const abstractRowSize = abstractLength * 4

  return {
    chunkEmbedCost,
    dataEmbedCost,
    abstractEmbedCost,
    abstractSumInputCost,
    abstractSumOutputCost,
    embeddingRowSize,
    dataRowSize,
    abstractRowSize
  }
}

const researchStore = useResearchStore()
const { researchMetrics } = storeToRefs(researchStore)

const costMetrics = computed(() =>
  researchMetrics.value.map((metrics) =>
    calculateCostAndStorage({
      dataLength: metrics.length.math + metrics.length.citations + metrics.length.figures,
      chunkLength: metrics.length.text_parsed,
      abstractLength: metrics.length.abstract,
      chunkCount: metrics.chunks.total
    })
  )
)

const costTotals = computed(() => {
  return costMetrics.value.reduce(
    (acc, curr) => {
      acc.chunkEmbedCost += curr.chunkEmbedCost
      acc.dataEmbedCost += curr.dataEmbedCost
      acc.abstractEmbedCost += curr.abstractEmbedCost
      acc.abstractSumInputCost += curr.abstractSumInputCost
      acc.abstractSumOutputCost += curr.abstractSumOutputCost
      acc.embeddingRowSize += curr.embeddingRowSize
      acc.dataRowSize += curr.dataRowSize
      acc.abstractRowSize += curr.abstractRowSize
      return acc
    },
    {
      chunkEmbedCost: 0,
      dataEmbedCost: 0,
      abstractEmbedCost: 0,
      abstractSumInputCost: 0,
      abstractSumOutputCost: 0,
      embeddingRowSize: 0,
      dataRowSize: 0,
      abstractRowSize: 0
    }
  )
})

const labeledCosts = computed(() => [
  { label: 'Chunk Embed Cost', value: costTotals.value.chunkEmbedCost },
  { label: 'Data Embed Cost', value: costTotals.value.dataEmbedCost },
  { label: 'Abstract Embed Cost', value: costTotals.value.abstractEmbedCost },
  { label: 'Abstract Sum Input Cost', value: costTotals.value.abstractSumInputCost },
  { label: 'Abstract Sum Output Cost', value: costTotals.value.abstractSumOutputCost },
  { label: 'Embedding Row Size', value: costTotals.value.embeddingRowSize },
  { label: 'Data Row Size', value: costTotals.value.dataRowSize },
  { label: 'Abstract Row Size', value: costTotals.value.abstractRowSize }
])
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Costs</h2>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-8"
      v-if="labeledCosts?.length"
    >
      <div
        v-for="item in labeledCosts"
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
