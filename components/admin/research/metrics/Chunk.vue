<script setup lang="ts">
const props = defineProps({
  chunk: {
    type: Object as PropType<any>,
    required: true
  }
})

const metrics = computed(async () =>
  props.chunk.id ? await researchStore.fetchResearchMetricsById(props.chunk.id) : []
)
</script>

<template>
  <div class="p-4 rounded-lg shadow-md border border-color background">
    <h2 class="text-xl font-bold pb-4">Chunk Metrics</h2>
    <p> {{ metrics }}</p>
  </div>
</template>

<style scoped></style>
