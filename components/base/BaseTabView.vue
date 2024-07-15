<script setup lang="ts">
interface Tab {
  title: string
  slotName: string
  value: number
}

defineProps<{
  tabs: Tab[]
}>()
</script>

<template>
  <PrimeTabs
    :value="0"
    class="relative"
  >
    <PrimeTabList
      :pt="{
        tabs: 'bg-transparent gap-4 sticky top-0 left-0 z-50 overflow-x-scroll '
      }"
    >
      <PrimeTab
        v-for="tab in tabs"
        :key="tab.title"
        :value="tab.value"
        >{{ tab.title }}</PrimeTab
      >
    </PrimeTabList>
    <PrimeTabPanel
      v-for="(tab, index) in tabs"
      :key="`tab-index-${tab.title}`"
      :value="tab.value"
      :pt="{
        root: 'h-full h-full overflow-scroll'
      }"
    >
    <div class="pb-4">
      <slot :name="tab.slotName" />
    </div>
    </PrimeTabPanel>
  </PrimeTabs>
</template>

<style></style>
