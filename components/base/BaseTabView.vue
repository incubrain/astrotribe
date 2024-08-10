<script setup lang="ts">
interface Tab {
  title: string
  slotName: string
  value: string
}

defineProps<{
  tabs: Tab[]
}>()
</script>

<template>
  <PrimeTabs
    value="0"
    class="h-full"
    scrollable
    :pt="{
      root: 'min-h-full w-full'
    }"
    :ptOptions="{ mergeSections: true }"
  >
    <PrimeTabList
      :pt="{
        root: 'gap-4 sticky top-0 left-0 z-50 flex text-nowrap flex-grow w-full overflow-scroll no-scrollbar border-b border-color'
      }"
      :ptOptions="{ mergeSections: true }"
    >
      <PrimeTab
        v-for="tab in tabs"
        :key="tab.title"
        :value="tab.value"
        :pt="{
          root: ({ context }) => ({
            class: [
              'text-nowrap px-6 py-4 border-x border-color',
              { 'bg-primary-900': context.active }
            ]
          })
        }"
        :ptOptions="{ mergeSections: true }"
      >
        {{ tab.title }}
      </PrimeTab>
    </PrimeTabList>
    <PrimeTabPanel
      v-for="(tab, index) in tabs"
      :key="`tab-index-${tab.title}`"
      :value="tab.value"
      :pt="{
        root: 'h-full overflow-scroll'
      }"
      :ptOptions="{ mergeProps: true, mergeSections: true }"
    >
      <div class="pb-4">
        <slot :name="tab.slotName" />
      </div>
    </PrimeTabPanel>
  </PrimeTabs>
</template>

<style></style>
