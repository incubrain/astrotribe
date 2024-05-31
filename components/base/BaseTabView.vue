<script setup lang="ts">
interface Tab {
  tabTitle: string
  tabName: string
}

defineProps<{
  tabs: Tab[]
}>()
</script>

<template>
  <LazyPrimeTabView
    :pt="{
      nav: 'bg-transparent gap-4',
      panelContainer: 'bg-transparent p-0 h-full'
    }"
  >
    <PrimeTabPanel
      v-for="(tab, index) in tabs"
      :key="`tab-index-${index}`"
      :header="tab.tabTitle"
      :pt="{
        headeraction: 'bg-transparent',
        content: 'h-full min-h-full'
      }"
    >
      <slot :name="tab.tabName" />
    </PrimeTabPanel>
  </LazyPrimeTabView>
</template>

<style></style>
