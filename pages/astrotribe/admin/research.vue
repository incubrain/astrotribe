<script setup lang="ts">
import {
  AdminResearchReview,
  AdminResearchQuestion,
  AdminResearchMetrics,
  AdminResearchNotes,
  AdminResearchCitations,
  AdminResearchTools,
  AdminResearchAuthors,
  AdminResearchFigures,
  AdminResearchTables,
  AdminResearchMath,
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
  },
  {
    tabTitle: 'Notes',
    tabName: 'notes',
    component: AdminResearchNotes
  },
  {
    tabTitle: 'Math',
    tabName: 'math',
    component: AdminResearchMath
  },
  {
    tabTitle: 'Citations',
    tabName: 'citations',
    component: AdminResearchCitations
  },
  {
    tabTitle: 'Tools',
    tabName: 'tools',
    component: AdminResearchTools
  },
  {
    tabTitle: 'Authors',
    tabName: 'authors',
    component: AdminResearchAuthors
  },
  {
    tabTitle: 'Figures',
    tabName: 'figures',
    component: AdminResearchFigures
  },
  {
    tabTitle: 'Tables',
    tabName: 'tables',
    component: AdminResearchTables
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
