<script setup lang="ts">
const chunksStore = useChunksStore()
const { similarChunks } = storeToRefs(chunksStore)

const researchStore = useResearchStore()

const config = reactive({
  search: '',
  matchThreshold: 0.8,
  matchCount: 5
})

const chunkIds = computed(() => similarChunks.value.map((doc) => doc.id) ?? null)
const chunkMetrics = ref(null as null | ResearchMetric[])

onMounted(async () => {
  await chunksStore.fetchSimilarDocuments(config)
  chunkMetrics.value = await researchStore.getResearchMetricsById(chunkIds.value)
})

const currentChunkMetrics = (id: string) =>
  chunkMetrics.value?.find((metric) => metric.research_id === id)
</script>

<template>
  <div>
    <AdminResearchHeader>
      <PrimeInputText
        v-model="config.search"
        placeholder="Search for similar documents"
        class="min-w-72"
      />
      <div class="flex flex-col items-start">
        <div class="flex items-center justify-center gap-4">
          <p class="text-sm">Min Threshold:</p>
          <PrimeSlider
            v-model="config.matchThreshold"
            class="w-36"
            :min="0"
            :max="1"
            :step="0.01"
          />
          <p>{{ config.matchThreshold.toFixed(2) }}</p>
        </div>
        <div class="flex items-center justify-center gap-4">
          <p class="text-sm">Max Documents:</p>
          <PrimeSlider
            v-model="config.matchCount"
            class="w-36"
            :min="5"
            :max="40"
          />
          <p>{{ config.matchCount }}</p>
        </div>
      </div>

      <PrimeButton @click="chunksStore.fetchSimilarDocuments(config)">
        Embedding Search
      </PrimeButton>
    </AdminResearchHeader>
    <div
      v-if="similarChunks.length"
      class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8"
    >
      <AdminResearchCard
        v-for="doc in similarChunks"
        :key="doc.id"
        :doc="doc"
        :body="doc.chunk"
      >
        <template #header>
          <PrimeButton
            @click="chunksStore.flagChunk(doc.id, doc.is_flagged)"
            :severity="doc.is_flagged ? 'danger' : 'primary'"
          >
            {{ doc.is_flagged ? 'unflag' : 'Flag' }}
          </PrimeButton>
        </template>
        <template #footer>
          <PrimeAccordion>
            <PrimeAccordionTab header="Metrics">
              <AdminResearchMetricsChunk
                v-if="chunkMetrics?.length"
                :metrics="currentChunkMetrics(doc.id)"
              />
            </PrimeAccordionTab>
          </PrimeAccordion>
        </template>
      </AdminResearchCard>
    </div>
  </div>
</template>

<style scoped></style>
