<script setup lang="ts">
const chunksStore = useChunksStore()
const { chunks } = storeToRefs(chunksStore)
const showClean = ref(false)

const toggleClean = () => {
  showClean.value = !showClean.value
}
</script>

<template>
  <div class="relative">
    <AdminResearchHeader>
      <PrimeButton @click="chunksStore.fetchChunks()"> Get Chunks </PrimeButton>
      <PrimeButton @click="toggleClean"> {{ showClean ? 'Show Raw' : 'Show Clean' }} </PrimeButton>
      <p>Total Chunks: {{ chunks.length }}</p>
    </AdminResearchHeader>
    <div
      v-if="chunks.length"
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8"
    >
      <AdminResearchCard
        v-for="doc in chunks"
        :key="doc.id"
        :doc="doc"
        :body="doc.chunk"
        :show-clean="showClean"
      >
        <template #header>
          <PrimeButton
            @click="chunksStore.flagChunk(doc.id, doc.is_flagged)"
            :severity="doc.is_flagged ? 'danger' : 'primary'"
          >
            {{ doc.is_flagged ? 'Unflag' : 'Flag' }}
          </PrimeButton>
        </template>
        <template #footer>
          <AdminResearchMetricsChunk :chunk="doc" />
        </template>
      </AdminResearchCard>
    </div>
  </div>
</template>

<style scoped></style>
