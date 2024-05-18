<template>
  <div>
    <PrimeTabView
      :pt="{
        navContainer: 'pb-4',
        nav: 'bg-transparent gap-4',
        panelContainer: 'bg-transparent p-0'
      }"
    >
      <PrimeTabPanel
        v-for="(tab, index) in tabs"
        :key="`tab-index-${index}`"
        :header="tab.tabTitle"
      >
        <slot :name="tab.tabName" />
      </PrimeTabPanel>
    </PrimeTabView>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  tabTitle: string
  tabName: string
}

const props = defineProps<{
  tabs: Tab[]
}>()
</script>

<style></style>
