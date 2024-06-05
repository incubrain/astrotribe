<script setup lang="ts">
const researchStore = useResearchStore()
const { researchData } = storeToRefs(researchStore)

onMounted(() => {
  researchStore.fetchFromResearchTables({
    tableName: 'research_figures',
    isFlagged: false,
    limit: 50
  })
})

const isFlagged = ref(false)
const figures = computed(() =>
  isFlagged.value
    ? researchData.value.research_figures.flagged
    : researchData.value.research_figures.data
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
      v-if="figures && figures.length"
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8"
    >
      <AdminResearchCard
        v-for="figure in figures"
        :key="figure.id"
        :doc="figure"
        :body="figure.caption"
      >
        <template #header>
          <PrimeButton
            @click="
              researchStore.flagItem({
                itemId: figure.id,
                isFlagged: figure.is_flagged,
                tableName: 'research_figures'
              })
            "
            :severity="figure.is_flagged ? 'danger' : 'primary'"
          >
            {{ figure.is_flagged ? 'unflag' : 'Flag' }}
          </PrimeButton>
        </template>
      </AdminResearchCard>
    </div>
  </div>
</template>

<style scoped></style>
