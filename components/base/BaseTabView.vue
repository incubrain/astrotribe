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
      nav: 'bg-transparent gap-4 sticky top-0 left-0 z-50 overflow-x-scroll',
      panelContainer: 'bg-transparent p-0 h-full overflow-scroll'
    }"
  >
    <PrimeTabPanel
      v-for="(tab, index) in tabs"
      :key="`tab-index-${index}`"
      :header="tab.tabTitle"
      :pt="{
        headeraction: 'bg-transparent',
        content: 'h-full'
      }"
    >
      <slot :name="tab.tabName" />
    </PrimeTabPanel>
  </LazyPrimeTabView>
</template>

<style></style>
