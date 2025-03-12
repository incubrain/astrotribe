<script setup lang="ts">
const researchStore = useResearchStore()
const domainKey = 'research'

const { research } = storeToRefs(researchStore)
const haveResearch = computed(() => research.value !== null && research.value.length > 0)

// Updated to use the new contents table structure
const fetchInput = ref({
  domainKey,
  endpoint: '/api/research/select/cards',
  criteria: {
    // This should be updated in your API endpoint to use the contents table with content_type = 'research'
    dto: 'select:research:card',
  },
})

// Initialize the store with research data if not already loaded
const initializeResearch = async () => {
  if (!haveResearch.value) {
    // Option 1: Use the loadResearch method if you're updating the API endpoint
    await researchStore.loadResearch(fetchInput.value)

    // Option 2: Alternative approach - use the selectData composable directly with the new table
    /*
    const { store, refresh } = useSelectData('contents', {
      filters: {
        content_type: { eq: 'research' },
        is_active: { eq: true },
        deleted_at: { is: null }
      },
      columns: `
        id,
        content_type,
        title,
        url,
        created_at,
        hot_score,
        published_at,
        description,
        author,
        featured_image,
        source_id,
        company_id,
        details
      `,
      pagination: { page: 1, limit: 20 },
      initialFetch: true
    })

    // Use store data or update your research store
    research.value = store.items
    */
  }
}

watchEffect(() => {
  initializeResearch()
})

definePageMeta({ name: 'Research' })
</script>

<template>
  <div class="relative flex h-full w-full flex-col">
    <!-- <SummaryLevel /> -->
    <IBInfiniteScroll
      :domain-key="domainKey"
      :pagination="{ page: 1, limit: 20 }"
      @update:scroll-end="researchStore.loadResearch(fetchInput)"
    >
      <div class="mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-4 xl:grid-cols-3 xl:gap-8">
        <ResearchCard
          v-for="(item, index) in research"
          :key="`research-post-${index}`"
          :research="item"
        />
      </div>
    </IBInfiniteScroll>
  </div>
</template>
