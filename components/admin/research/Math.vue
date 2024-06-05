<script setup lang="ts">
const researchStore = useResearchStore()
const { researchData } = storeToRefs(researchStore)

onMounted(() => {
  researchStore.fetchFromResearchTables({
    tableName: 'research_math',
    isFlagged: false,
    limit: 50
  })
})

const isFlagged = ref(false)
const maths = computed(() =>
  isFlagged.value ? researchData.value.research_math.flagged : researchData.value.research_math.data
)

// <PrimeButton
//             @click="confirmDelete(doc.id)"
//             severity="danger"
//             outlined
//           >
//             Delete
//           </PrimeButton>
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
      v-if="maths && maths.length"
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8"
    >
      <AdminResearchCard
        v-for="math in maths"
        :key="math.id"
        :doc="math"
        :body="math.latex"
      >
        <template #header>
          <PrimeButton
            @click="
              researchStore.flagItem({
                itemId: math.id,
                isFlagged: math.is_flagged,
                tableName: 'research_math'
              })
            "
            :severity="math.is_flagged ? 'danger' : 'primary'"
          >
            {{ math.is_flagged ? 'Unflag' : 'Flag' }}
          </PrimeButton>
        </template>
        <template #content>
          <div
            v-html="$mathjax.convertLatexToReadableMath(math.latex)"
            class="p-2 bg-red-50"
          ></div>
        </template>
      </AdminResearchCard>
    </div>
  </div>
</template>

<style scoped></style>
