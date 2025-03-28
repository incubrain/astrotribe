<script setup lang="ts">
interface Tab {
  title: string
  slotName: string
  value: string
}

const props = defineProps<{
  tabs: Tab[]
}>()

const activeTab = ref(props.tabs[0]?.value || '0')
</script>

<template>
  <PrimeTabs
    :value="activeTab"
    class="h-full"
    scrollable
    :pt="{
      root: 'w-full h-full',
    }"
    :pt-options="{ mergeSections: true }"
  >
    <PrimeTabList
      :pt="{
        root: 'gap-4 sticky top-0 left-0 z-50 flex items-center text-nowrap w-full overflow-scroll bg-black no-scrollbar border-b border-color',
      }"
      :pt-options="{ mergeSections: true, mergeProps: true }"
    >
      <!-- Start Slot -->

      <!-- Tabs -->
      <div class="flex-1 flex items-center">
        <div class="flex-none px-4">
          <slot name="start" />
        </div>
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
        <!-- End Slot -->
        <div class="flex-none px-4">
          <slot name="end" />
        </div>
      </div>
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

<style scoped>
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
