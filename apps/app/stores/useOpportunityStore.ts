/**
 * Composable for managing job-related localStorage operations
 */
import { ref, watch } from 'vue'

export interface OpportunityFilter {
  location: { value: any; options: any[] }
  company: { value: any; options: any[] }
  type: { value: any; options: any[] }
  tags?: string[]
  minSalary?: number
}

export interface SortPreference {
  sortBy: string
  isAscending: boolean
}

export interface ViewPreference {
  mode: 'grid' | 'list'
}

export function useOpportunityStore() {
  // Filter preferences
  const filters = ref<OpportunityFilter>({
    location: { value: '', options: [] },
    company: { value: '', options: [] },
    type: { value: '', options: [] },
    tags: [],
  })

  // Sort preferences
  const sortPreference = ref<SortPreference>({
    sortBy: 'published_at',
    isAscending: false,
  })

  // View preferences
  const viewPreference = ref<ViewPreference>({
    mode: 'grid',
  })

  // Recent searches
  const recentSearches = ref<string[]>([])

  // Recently viewed job IDs
  const recentlyViewedJobs = ref<string[]>([])

  /**
   * Load all preferences from localStorage
   */
  const loadPreferences = () => {
    try {
      // Load filters
      const savedFilters = localStorage.getItem('opportunity_filters')
      if (savedFilters) {
        filters.value = JSON.parse(savedFilters)
      }

      // Load sort preference
      const savedSort = localStorage.getItem('job_sort_preference')
      if (savedSort) {
        sortPreference.value = JSON.parse(savedSort)
      }

      // Load view preference
      const savedView = localStorage.getItem('job_view_preference')
      if (savedView) {
        viewPreference.value = JSON.parse(savedView)
      }

      // Load recent searches
      const savedSearches = localStorage.getItem('job_recent_searches')
      if (savedSearches) {
        recentSearches.value = JSON.parse(savedSearches)
      }

      // Load recently viewed jobs
      const savedViewedJobs = localStorage.getItem('job_recently_viewed')
      if (savedViewedJobs) {
        recentlyViewedJobs.value = JSON.parse(savedViewedJobs)
      }
    } catch (error: any) {
      console.error('Error loading preferences from localStorage:', error)
      // If error, reset to defaults
      resetAllPreferences()
    }
  }

  /**
   * Save filter preferences to localStorage
   */
  const saveFilters = () => {
    try {
      localStorage.setItem('opportunity_filters', JSON.stringify(filters.value))
    } catch (error: any) {
      console.error('Error saving filters to localStorage:', error)
    }
  }

  /**
   * Save sort preference to localStorage
   */
  const saveSortPreference = () => {
    try {
      localStorage.setItem('job_sort_preference', JSON.stringify(sortPreference.value))
    } catch (error: any) {
      console.error('Error saving sort preference to localStorage:', error)
    }
  }

  /**
   * Save view preference to localStorage
   */
  const saveViewPreference = () => {
    try {
      localStorage.setItem('job_view_preference', JSON.stringify(viewPreference.value))
    } catch (error: any) {
      console.error('Error saving view preference to localStorage:', error)
    }
  }

  /**
   * Add a search query to recent searches
   * @param query Search query string
   * @param maxItems Maximum number of recent searches to store
   */
  const addToRecentSearches = (query: string, maxItems: number = 5) => {
    if (!query || query.trim() === '') return

    // Remove query if it already exists
    const normalizedQuery = query.trim()
    const updatedSearches = recentSearches.value.filter(
      (q) => q.toLowerCase() !== normalizedQuery.toLowerCase(),
    )

    // Add new query at the beginning
    updatedSearches.unshift(normalizedQuery)

    // Keep only up to maxItems
    recentSearches.value = updatedSearches.slice(0, maxItems)

    // Save to localStorage
    try {
      localStorage.setItem('job_recent_searches', JSON.stringify(recentSearches.value))
    } catch (error: any) {
      console.error('Error saving recent searches to localStorage:', error)
    }
  }

  /**
   * Clear recent searches
   */
  const clearRecentSearches = () => {
    recentSearches.value = []
    try {
      localStorage.removeItem('job_recent_searches')
    } catch (error: any) {
      console.error('Error clearing recent searches from localStorage:', error)
    }
  }

  /**
   * Add a job ID to recently viewed jobs
   * @param jobId Job ID
   * @param maxItems Maximum number of recently viewed jobs to store
   */
  const addToRecentlyViewedJobs = (jobId: string, maxItems: number = 10) => {
    if (!jobId) return

    // Remove job if it already exists
    const updatedViewedJobs = recentlyViewedJobs.value.filter((id) => id !== jobId)

    // Add new job at the beginning
    updatedViewedJobs.unshift(jobId)

    // Keep only up to maxItems
    recentlyViewedJobs.value = updatedViewedJobs.slice(0, maxItems)

    // Save to localStorage
    try {
      localStorage.setItem('job_recently_viewed', JSON.stringify(recentlyViewedJobs.value))
    } catch (error: any) {
      console.error('Error saving recently viewed jobs to localStorage:', error)
    }
  }

  /**
   * Reset all preferences to defaults
   */
  const resetAllPreferences = () => {
    // Reset filters
    filters.value = {
      location: { value: '', options: [] },
      company: { value: '', options: [] },
      type: { value: '', options: [] },
      tags: [],
    }

    // Reset sort preference
    sortPreference.value = {
      sortBy: 'published_at',
      isAscending: false,
    }

    // Reset view preference
    viewPreference.value = {
      mode: 'grid',
    }

    // Clear localStorage
    try {
      localStorage.removeItem('opportunity_filters')
      localStorage.removeItem('job_sort_preference')
      localStorage.removeItem('job_view_preference')
    } catch (error: any) {
      console.error('Error resetting preferences in localStorage:', error)
    }
  }

  /**
   * Reset only filters
   */
  const resetFilters = () => {
    filters.value = {
      location: { value: '', options: [] },
      company: { value: '', options: [] },
      type: { value: '', options: [] },
      tags: [],
    }

    try {
      localStorage.removeItem('opportunity_filters')
    } catch (error: any) {
      console.error('Error removing filters from localStorage:', error)
    }
  }

  // Watch for changes and save to localStorage
  watch(
    () => filters.value,
    () => saveFilters(),
    { deep: true },
  )

  watch(
    () => sortPreference.value,
    () => saveSortPreference(),
    { deep: true },
  )

  watch(
    () => viewPreference.value,
    () => saveViewPreference(),
    { deep: true },
  )

  // Load preferences from localStorage on mount
  if (import.meta.client) {
    loadPreferences()
  }

  return {
    // State
    filters,
    sortPreference,
    viewPreference,
    recentSearches,
    recentlyViewedJobs,

    // Methods
    loadPreferences,
    saveFilters,
    saveSortPreference,
    saveViewPreference,
    addToRecentSearches,
    clearRecentSearches,
    addToRecentlyViewedJobs,
    resetAllPreferences,
    resetFilters,
  }
}
