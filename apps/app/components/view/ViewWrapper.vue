<script setup lang="ts">
const props = defineProps<{
  showPaywall: boolean
  feature: string
  itemsShown: number
  total: number
}>()

const viewStore = useViewModeStore()
</script>

<template>
  <div
    :class="
      viewStore.viewMode === 'grid'
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative'
        : 'space-y-4 relative'
    "
  >
    <!-- Render main items slot -->
    <slot name="items" />

    <!-- Paywall Blur -->
    <FeaturePaywall
      v-if="showPaywall"
      class="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 relative grid gid-cols-4 pointer-events-none"
      :feature="feature"
      :items-shown="itemsShown"
      :items-total="total"
      :show="showPaywall"
    >
      <slot name="last-row-items" />
    </FeaturePaywall>
  </div>
</template>
