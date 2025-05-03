import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ViewMode = 'grid' | 'list'

export const useViewModeStore = defineStore('viewMode', () => {
  const viewMode = ref<ViewMode>('grid')

  // Load from localStorage if available
  if (import.meta.client) {
    const saved = localStorage.getItem('viewMode')
    if (saved === 'grid' || saved === 'list') {
      viewMode.value = saved
    }
  }

  // Persist changes
  watch(viewMode, (newMode) => {
    if (import.meta.client) {
      localStorage.setItem('viewMode', newMode)
    }
  })

  const setViewMode = (mode: ViewMode) => {
    viewMode.value = mode
  }

  return {
    viewMode,
    setViewMode,
  }
})
