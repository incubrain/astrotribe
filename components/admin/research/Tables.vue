<script setup lang="ts">
const researchStore = useResearchStore()
const { researchData } = storeToRefs(researchStore)

onMounted(() => {
  researchStore.fetchFromResearchTables({
    tableName: 'research_tables',
    isFlagged: false,
    limit: 50
  })
})

const isFlagged = ref(false)
const tables = computed(() =>
  isFlagged.value
    ? researchData.value.research_tables.flagged
    : researchData.value.research_tables.data
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
      v-if="tables && tables.length"
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8"
    >
      <AdminResearchCard
        v-for="table in tables"
        :key="table.id"
        :doc="table"
        :body="table.caption"
      >
        <template #header>
          <PrimeButton
            @click="
              researchStore.flagItem({
                itemId: table.id,
                isFlagged: table.is_flagged,
                tableName: 'research_tables'
              })
            "
            :severity="table.is_flagged ? 'danger' : 'primary'"
          >
            {{ table.is_flagged ? 'unflag' : 'Flag' }}
          </PrimeButton>
        </template>
      </AdminResearchCard>
    </div>
  </div>
</template>

<style scoped></style>
