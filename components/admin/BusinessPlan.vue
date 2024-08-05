<template>
  <div class="max-w-4xl mx-auto">
    <MDC
      :value="bpMarkdown"
      tag="article"
      class="wrapper prose prose-xl prose-invert w-full p-4 xl:p-8 decoration-primary-700 list-item-primary-700 marker:text-primary-700 marker:w-3 marker:h-3 prose-table:border prose-table:border-color"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  bpSection: {
    type: String,
    required: true
  }
})

// fetch the bp section from content
const { error, data: bpMarkdown } = await useAsyncData(`business-plan-${props.bpSection}`, () =>
  queryContent('/bp')
    .where({ section: { $eq: props.bpSection } })
    .findOne()
)

if (error.value) {
  console.error(error.value)
}

console.log('bpMarkdown', bpMarkdown)
</script>

<style scoped>

</style>
