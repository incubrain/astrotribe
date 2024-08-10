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

<template>
  <div class="mx-auto max-w-4xl">
    <MDC
      :value="bpMarkdown"
      tag="article"
      class="wrapper list-item-primary-700 prose-table:border-color prose prose-xl prose-invert w-full p-4 decoration-primary-700 marker:h-3 marker:w-3 marker:text-primary-700 prose-table:border xl:p-8"
    />
  </div>
</template>

<style scoped></style>
