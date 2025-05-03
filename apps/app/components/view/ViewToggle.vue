<script setup lang="ts">
const viewStore = useViewModeStore()

const toggle = (viewMode: string) => {
  const newViewMode = viewMode === 'grid' ? 'list' : 'grid'
  viewStore.setViewMode(newViewMode)
}

const viewOptions = {
  grid: {
    id: 'grid',
    icon: 'mdi:view-grid',
    title: 'Switch to list view',
  },
  list: {
    id: 'list',
    icon: 'mdi:view-list',
    title: 'Switch to grid view',
  },
}
</script>

<template>
  <button
    class="p-2 rounded-lg bg-primary-900/50 border border-primary-800/30 hover:bg-primary-800/50 transition-colors"
    :title="viewOptions[viewStore.viewMode].title"
    @click="toggle(viewOptions[viewStore.viewMode].id)"
  >
    <Icon
      :name="viewOptions[viewStore.viewMode].icon"
      class="w-5 h-5 text-primary-300"
    />
  </button>
</template>
