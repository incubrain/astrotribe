<script setup lang="ts">
const chunksStore = useChunksStore()
const { similarChunks } = storeToRefs(chunksStore)

const config = reactive({
  search: '',
  matchThreshold: 0.8,
  matchCount: 5
})
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
        <div class="flex gap-4 items-center justify-center">
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
        <div class="flex gap-4 items-center justify-center">
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
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8"
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
      </AdminResearchCard>
    </div>
  </div>
</template>

<style scoped></style>
