<script setup lang="ts">
const researchStore = useResearchStore()
const domainKey = 'research'

const { research } = storeToRefs(researchStore)
const haveResearch = computed(() => research.value !== null && research.value.length > 0)

const fetchInput = ref({
  domainKey,
  endpoint: '/api/research/select/cards',
  criteria: {
    dto: 'select:research:card',
  }
})

watchEffect(() => {
  if (haveResearch.value === false) {
    console.log('Fetching research')
    researchStore.loadResearch(fetchInput.value)
  }
})

console.log('research', research)

definePageMeta({
  name: 'Research',
  layout: 'app'
})
</script>

<template>
  <div class="flex flex-col relative h-full w-full">
    <!-- <SummaryLevel /> -->
    <BaseInfiniteScroll
      :domain-key="domainKey"
      :pagination="{
        page: 1,
        limit: 20
      }"
      @update:scroll-end="researchStore.loadResearch('select:venue:card')"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto md:gap-4 xl:gap-8">
        <ResearchCard
          v-for="(item, index) in research"
          :key="`research-post-${index}`"
          :research="item"
        />
      </div>
    </BaseInfiniteScroll>
  </div>
</template>
