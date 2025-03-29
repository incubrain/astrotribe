// stores/useEventsStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AstronomyEvent {
  id: number
  title: string
  date: Date
  category: string
  description: string
  time?: string
  visibility?: string
  location?: string
}

export const useAstronomyEventsStore = defineStore('astronomyEvents', () => {
  // State
  const events = ref<AstronomyEvent[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // Categories for filtering
  const categories = ref([
    { name: 'Lunar Event', icon: 'mdi:moon-waning-crescent', color: 'gray', colorIntensity: '500' },
    { name: 'Meteor Shower', icon: 'mdi:meteor', color: 'red', colorIntensity: '400' },
    {
      name: 'Solar Event',
      icon: 'mdi:white-balance-sunny',
      color: 'yellow',
      colorIntensity: '500',
    },
    { name: 'Planetary Event', icon: 'mdi:planet', color: 'purple', colorIntensity: '500' },
    { name: 'Eclipse', icon: 'mdi:moon-new', color: 'indigo', colorIntensity: '500' },
    { name: 'Event by Astronera', icon: 'mdi:event-heart', color: 'blue', colorIntensity: '400' },
  ])

  // Active filters
  const activeFilters = ref<string[]>([])

  // Computed values
  const filteredEvents = computed(() => {
    if (activeFilters.value.length === 0) return events.value

    return events.value.filter((event) => activeFilters.value.includes(event.category))
  })

  // Actions
  const fetchEvents = async () => {
    loading.value = true
    error.value = null

    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data or API endpoint if it exists
      const response = await $fetch('/api/astronomy-events')
      events.value = response.data || []
    } catch (err: any) {
      console.error('Error fetching astronomy events:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const toggleFilter = (category: string) => {
    const index = activeFilters.value.indexOf(category)
    if (index > -1) {
      activeFilters.value.splice(index, 1)
    } else {
      activeFilters.value.push(category)
    }
  }

  const clearFilters = () => {
    activeFilters.value = []
  }

  // Initialize with all filters active
  const initFilters = () => {
    activeFilters.value = categories.value.map((c) => c.name)
  }

  // Initialize store
  const init = async () => {
    initFilters()
    await fetchEvents()
  }

  return {
    events,
    loading,
    error,
    categories,
    activeFilters,
    filteredEvents,
    fetchEvents,
    toggleFilter,
    clearFilters,
    initFilters,
    init,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAstronomyEventsStore, import.meta.hot))
}
