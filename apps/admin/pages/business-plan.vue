<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'BusinessPlan',
})

const businessPlanSections = [
  'executive-summary',
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
  'ideas',
]

const businessPlanTabs = businessPlanSections.map((section, index) => ({
  value: `${index}`,
  title: section.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
  slotName: section,
}))
</script>

<template>
  <div class="relative h-full max-h-full pb-4 xl:pb-8">
    <IBTabView
      ref="businessPlanTabView"
      :tabs="businessPlanTabs"
      class="relative h-full w-full pb-4"
    >
      <template #start>
        <h1 class="text-xl font-semibold text-white">Business Plan</h1>
      </template>
      <template
        v-for="tab in businessPlanTabs"
        :key="tab.slotName"
        #[tab.slotName]
      >
        <BusinessPlan
          :bp-section="tab.slotName"
          class="relative flex h-auto flex-col gap-4 p-4 xl:gap-8 xl:p-8"
        />
      </template>
    </IBTabView>
  </div>
</template>

<style scoped></style>
