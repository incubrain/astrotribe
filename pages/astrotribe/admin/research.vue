<script setup lang="ts">
import {
  AdminResearchReview,
  AdminResearchQuestion,
  AdminResearchMetrics,
  AdminResearchMetricsDashboard
} from '#components'

definePageMeta({
  layoutTransition: false,
  name: 'A-Research',
  middleware: 'is-admin'
})

const analyticsTabs = [
  {
    tabTitle: 'Dashboard',
    tabName: 'dashboard',
    component: AdminResearchMetricsDashboard
  },
  {
    tabTitle: 'Test',
    tabName: 'test',
    component: AdminResearchQuestion
  },
  {
    tabTitle: 'Metrics',
    tabName: 'metrics',
    component: AdminResearchMetrics
  },
  {
    tabTitle: 'Chunks',
    tabName: 'chunks',
    component: AdminResearchReview
  }
]
</script>

<template>
  <div class="relative h-full max-h-full overflow-hidden pb-4 xl:pb-8">
    <BaseTabView
      ref="analyticsTabView"
      :tabs="analyticsTabs"
      class="relative h-full w-full pb-4"
    >
      <template
        v-for="tab in analyticsTabs"
        v-slot:[tab.tabName]
      >
        <component
          :is="tab.component"
          class="relative flex h-auto flex-col gap-4 p-4 xl:gap-8 xl:p-8"
        />
      </template>
    </BaseTabView>
  </div>
</template>

<style scoped></style>
