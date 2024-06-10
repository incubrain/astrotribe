<template>
  <div class="relative h-full max-h-full overflow-hidden pb-4 xl:pb-8">
    <BaseTabView
      ref="businessPlanTabView"
      :tabs="businessPlanTabs"
      class="relative h-full w-full pb-4"
    >
      <template
        v-for="tab in businessPlanTabs"
        v-slot:[tab.tabName]
      >
        <AdminBusinessPlan
          :bp-section="tab.tabName"
          class="relative flex h-auto flex-col gap-4 p-4 xl:gap-8 xl:p-8"
        />
      </template>
    </BaseTabView>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Business-Plan',
  middleware: 'is-admin'
})

const businessPlanSections = [
  'full-bp',
  'summary',
  'description',
  'market-analysis',
  'products',
  'marketing',
  'management-operations',
  'financials',
  'risk-analysis',
  'roadmap',
  'appendix',
  'ideas'
]

const businessPlanTabs = businessPlanSections.map((section) => ({
  tabTitle: section.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
  tabName: section
}))
</script>

<style scoped></style>
