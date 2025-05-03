<script setup lang="ts">
const viewStore = useViewModeStore()

const toggle = () => {
  const newViewMode = viewStore.viewMode === 'grid' ? 'list' : 'grid'
  viewStore.setViewMode(newViewMode)
}

const getNextViewMode = computed(() => {
  return viewStore.viewMode === 'grid' ? 'list' : 'grid'
})

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
    class="p-2 rounded-lg bg-primary-900/50 border border-primary-800/30 hover:bg-primary-800/50 transition-colors flex"
    :title="viewOptions[getNextViewMode].title"
    @click="toggle"
  >
    <Icon
      :name="viewOptions[getNextViewMode].icon"
      class="text-primary-300"
      size="24px"
    />
  </button>
</template>
