<script setup lang="ts">
const researchStore = useResearchStore()
const { researchData } = storeToRefs(researchStore)

onMounted(() => {
  researchStore.fetchFromResearchTables({
    tableName: 'research_authors',
    isFlagged: false,
    limit: 50
  })
})

const isFlagged = ref(false)
const authors = computed(() =>
  isFlagged.value
    ? researchData.value.research_authors.flagged
    : researchData.value.research_authors.data
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
      v-if="authors && authors.length"
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8"
    >
      <AdminResearchCard
        v-for="author in authors"
        :key="author.id"
        :doc="author"
        :body="author.name"
      >
        <template #header>
          <PrimeButton
            @click="
              researchStore.flagItem({
                itemId: author.id,
                isFlagged: author.is_flagged,
                tableName: 'research_authors'
              })
            "
            :severity="author.is_flagged ? 'danger' : 'primary'"
          >
            {{ author.is_flagged ? 'unflag' : 'Flag' }}
          </PrimeButton>
        </template>
      </AdminResearchCard>
    </div>
  </div>
</template>

<style scoped></style>
