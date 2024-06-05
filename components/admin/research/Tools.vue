<script setup lang="ts">
const researchStore = useResearchStore()
const { researchData } = storeToRefs(researchStore)

onMounted(() => {
  researchStore.fetchFromResearchTables({
    tableName: 'research_tools',
    isFlagged: false,
    limit: 50
  })
})

const isFlagged = ref(false)
const tools = computed(() =>
  isFlagged.value
    ? researchData.value.research_tools.flagged
    : researchData.value.research_tools.data
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
      v-if="tools && tools.length"
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8"
    >
      <AdminResearchCard
        v-for="tool in tools"
        :key="tool.id"
        :doc="tool"
        :body="tool.name"
      >
        <template #header>
          <PrimeButton
            @click="
              researchStore.flagItem({
                itemId: tool.id,
                isFlagged: tool.is_flagged,
                tableName: 'research_tools'
              })
            "
            :severity="tool.is_flagged ? 'danger' : 'primary'"
          >
            {{ tool.is_flagged ? 'unflag' : 'Flag' }}
          </PrimeButton>
        </template>
      </AdminResearchCard>
    </div>
  </div>
</template>

<style scoped></style>
