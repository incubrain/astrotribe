<script setup lang="ts">
const researchStore = useResearchStore()
const { researchData } = storeToRefs(researchStore)

onMounted(() => {
  researchStore.fetchFromResearchTables({
    tableName: 'research_citations',
    isFlagged: false,
    limit: 50
  })
})

const isFlagged = ref(false)
const citations = computed(() =>
  isFlagged.value
    ? researchData.value.research_citations.flagged
    : researchData.value.research_citations.data
)
</script>

<template>
  <div>
    <AdminResearchHeader>
      <div class="flex flex-col items-start">
        <div class="flex gap-4 items-center justify-center">
          <p class="text-sm">Min Threshold:</p>
        </div>
        <div class="flex gap-4 items-center justify-center">
          <p class="text-sm">Max Documents:</p>
        </div>
      </div>

      <PrimeButton> NA </PrimeButton>
    </AdminResearchHeader>
    <div
      v-if="!!citations && citations.length"
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8"
    >
      <AdminResearchCard
        v-for="citation in citations"
        :key="citation.id"
        :doc="citation"
        :body="citation.author"
      >
        <template #header>
          <PrimeButton
            @click="
              researchStore.flagItem({
                itemId: citation.id,
                isFlagged: citation.is_flagged,
                tableName: 'research_citations'
              })
            "
            :severity="citation.is_flagged ? 'danger' : 'primary'"
          >
            {{ citation.is_flagged ? 'unflag' : 'Flag' }}
          </PrimeButton>
        </template>
      </AdminResearchCard>
    </div>
  </div>
</template>

<style scoped></style>
