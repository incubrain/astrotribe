<template>
  <div v-if="diagram">
    <ContentRenderer :value="diagram">
      <div class="prose prose-invert mx-auto pt-10">
        <ContentRendererMarkdown :value="diagram" />
      </div>
    </ContentRenderer>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  systemName: {
    type: String,
    required: true,
  },
})

const { data: diagram } = await useAsyncData(`diagram-${props.systemName}`, () =>
  queryContent(`/systems/${props.systemName}`).findOne(),
)
</script>
