<script setup lang="ts">
import {
  AdminChunksReview,
  AdminChunksFlagged,
  AdminChunksQuestion,
  AdminChunksMetrics
} from '#components'

definePageMeta({
  layoutTransition: false,
  name: 'A-Chunks',
  middleware: 'is-admin'
})

const analyticsTabs = [
  {
    tabTitle: 'Review Chunks',
    tabName: 'review',
    component: AdminChunksReview
  },
  {
    tabTitle: 'Flagged Chunks',
    tabName: 'flagged',
    component: AdminChunksFlagged
  },
  {
    tabTitle: 'Question',
    tabName: 'question',
    component: AdminChunksQuestion
  },
  {
    tabTitle: 'Metrics',
    tabName: 'metrics',
    component: AdminChunksMetrics
  }
]
</script>

<template>
  <BaseTabView
    ref="analyticsTabView"
    :tabs="analyticsTabs"
    class="w-full h-full pb-4"
  >
    <template
      v-for="tab in analyticsTabs"
      v-slot:[tab.tabName]
    >
      <component
        :is="tab.component"
        class="gap-4 xl:gap-8 relative h-auto flex flex-col p-4 xl:p-8"
      />
    </template>
  </BaseTabView>
</template>

<style scoped></style>
