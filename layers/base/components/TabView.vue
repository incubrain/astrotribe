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
      root: 'w-full h-full',
    }"
    :pt-options="{ mergeSections: true }"
  >
    <PrimeTabList
      :pt="{
        root: 'gap-4 sticky top-0 left-0 z-50 flex text-nowrap flex-grow w-full overflow-scroll bg-black no-scrollbar border-b border-color',
      }"
      :pt-options="{ mergeSections: true, mergeProps: true }"
    >
      <PrimeTab
        v-for="tab in tabs"
        :key="tab.title"
        :value="tab.value"
        :pt="{
          root: ({ context }) => ({
            class: [
              'text-nowrap px-6 py-4 border-x border-color h-full',
              { 'bg-primary-900': context.active },
            ],
          }),
        }"
        :pt-options="{ mergeSections: true, mergeProps: true }"
      >
        {{ tab.title }}
      </PrimeTab>
    </PrimeTabList>
    <PrimeTabPanel
      v-for="tab in tabs"
      :key="`tab-index-${tab.title}`"
      :value="tab.value"
      :pt="{
        root: 'overflow-scroll h-full',
      }"
      :pt-options="{ mergeProps: true, mergeSections: true }"
    >
      <slot :name="tab.slotName" />
    </PrimeTabPanel>
  </PrimeTabs>
</template>

<style></style>
