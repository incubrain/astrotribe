<script setup lang="ts">
const researchStore = useResearchStore()
const { researchData } = storeToRefs(researchStore)

onMounted(() => {
  researchStore.fetchFromResearchTables({
    tableName: 'research_notes',
    isFlagged: false,
    limit: 50
  })
})

const isFlagged = ref(false)
const notes = computed(() =>
  isFlagged.value
    ? researchData.value.research_notes.flagged
    : researchData.value.research_notes.data
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
      v-if="notes && notes.length"
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8"
    >
      <AdminResearchCard
        v-for="note in notes"
        :key="note.id"
        :doc="note"
        :body="note.body"
      >
        <template #header>
          <PrimeButton
            @click="
              researchStore.flagItem({
                itemId: note.id,
                isFlagged: note.is_flagged,
                tableName: 'research_notes'
              })
            "
            :severity="note.is_flagged ? 'danger' : 'primary'"
          >
            {{ note.is_flagged ? 'unflag' : 'Flag' }}
          </PrimeButton>
        </template>
      </AdminResearchCard>
    </div>
  </div>
</template>

<style scoped></style>
