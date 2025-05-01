import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import Fuse from 'fuse.js'
import { useLogger } from '../composables/useLogger'

const logger = useLogger('CompaniesStore')

interface FilterOption {
  key: string
  value: string
}

interface CompanyFilter {
  location: { value: any; options: FilterOption[] }
  category: { value: any; options: FilterOption[] }
  type: { value: any; options: FilterOption[] }
  foundingYearRange: { min: number | null; max: number | null }
  tags?: string[]
}

interface SortPreference {
  sortBy: string
  isAscending: boolean
}

interface ViewPreference {
  mode: 'grid' | 'list'
}

interface CompanyStorage {
  filters: CompanyFilter
  sortPreference: SortPreference
  viewPreference: ViewPreference
  recentlyViewedCompanies: string[]
}

// Define company interface based on database schema
interface Company {
  id: string
  name: string
  description?: string
  logo_url?: string
  founding_year?: number
  url: string
  is_government?: boolean
  category?: string
  keywords?: any
  job_url?: string
  created_at?: string
  updated_at?: string
  city?: string
  country?: string
  addresses?: Array<{
    id: string
    cities?: { name: string }
    countries?: { name: string }
  }>
  categories?: { id: string; name: string }
  social_media?: {
    id: string
    facebook_url?: string
    linkedin_url?: string
    twitter_url?: string
    instagram_url?: string
    youtube_url?: string
  }
}

export const useCompaniesStore = defineStore('companies', () => {
  // State
  const companies = ref<Company[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Client-side storage for preferences - these would be saved to localStorage
  const storedPreferences = ref<CompanyStorage>({
    filters: {
      location: { value: null, options: [] },
      category: { value: null, options: [] },
      type: { value: null, options: [] },
      foundingYearRange: { min: null, max: null },
      tags: [],
    },
    sortPreference: {
      sortBy: 'name',
      isAscending: true,
    },
    viewPreference: {
      mode: 'grid',
    },
    recentlyViewedCompanies: [],
  })

  // Search state
  const searchQuery = ref('')
  const searchResults = ref<Company[]>([])

  // Detail view state
  const selectedCompany = ref<Company | null>(null)
  const showDetailModal = ref(false)

  // Computed properties
  const filters = computed({
    get: () => storedPreferences.value.filters,
    set: (value) => {
      storedPreferences.value.filters = value
      if (import.meta.client) {
        localStorage.setItem('companies-filters', JSON.stringify(value))
      }
    },
  })

  const viewMode = computed({
    get: () => storedPreferences.value.viewPreference.mode,
    set: (value) => {
      storedPreferences.value.viewPreference.mode = value
      if (import.meta.client) {
        localStorage.setItem('companies-view-mode', value)
      }
    },
  })

  const sortPreference = computed({
    get: () => storedPreferences.value.sortPreference,
    set: (value) => {
      storedPreferences.value.sortPreference = value
      if (import.meta.client) {
        localStorage.setItem('companies-sort', JSON.stringify(value))
      }
    },
  })

  // Apply filters and sorting to companies
  const filteredCompanies = computed(() => {
    let filtered = companies.value

    // If search is active, filter by search results
    if (searchQuery.value && searchResults.value.length) {
      filtered = searchResults.value
    } else {
      // Apply filters
      filtered = applyFilters(filtered, {
        location: filters.value.location.value?.key,
        category: filters.value.category.value?.key,
        type: filters.value.type.value?.key,
        minFoundingYear: filters.value.foundingYearRange.min || undefined,
        maxFoundingYear: filters.value.foundingYearRange.max || undefined,
        tags: filters.value.tags,
        sortBy: sortPreference.value.sortBy,
        ascending: sortPreference.value.isAscending,
      })
    }

    return filtered
  })

  // Actions
  const fetchCompanies = async () => {
    logger.info('Fetching companies data')
    loading.value = true
    error.value = null

    // Add retry logic
    const maxRetries = 3
    let retryCount = 0
    let success = false

    while (retryCount < maxRetries && !success) {
      try {
        logger.debug(`Fetching companies attempt ${retryCount + 1}/${maxRetries}`)
        // In a real application, this would be an API call
        // For now, we'll use the existing store mechanism
        const { store } = useSelectData('companies', {
          orderBy: { column: 'name', ascending: true },
          columns: `
            id,
            name,
            description,
            logo_url,
            founding_year,
            url,
            is_government,
            category_id,
            keywords,
            job_url,
            created_at,
            updated_at,
            social_media(id, facebook_url, linkedin_url, twitter_url, instagram_url, youtube_url)
          `,
          pagination: {
            page: 1,
            limit: 50,
          },
          initialFetch: true,
        })

        // When data is loaded, process it
        watch(
          () => store.items,
          (newItems) => {
            if (newItems && newItems.length > 0) {
              logger.info(`Received ${newItems.length} companies`)

              // Format the companies data
              companies.value = newItems.map((company: any) => ({
                ...company,
                city: company.addresses?.[0]?.cities?.name,
                country: company.addresses?.[0]?.countries?.name,
                category: company.categories?.name,
              }))

              // Initialize filter options
              initializeFilterOptions()

              // Load saved preferences
              loadSavedPreferences()

              loading.value = false
              success = true
            } else if (newItems && newItems.length === 0) {
              logger.warn('No companies data received')
              companies.value = []
              loading.value = false
              success = true
            }
          },
          { immediate: true },
        )

        // If we reach here without error, break the retry loop
        if (!success) {
          logger.debug('Waiting for data to load...')
          // Add a timeout to prevent hanging if watch doesn't trigger
          setTimeout(() => {
            if (!success) {
              logger.warn('Data loading timeout, considering as success to prevent hanging')
              loading.value = false
              success = true
            }
          }, 10000) // 10 second timeout
        }
      } catch (e: any) {
        retryCount++
        logger.error(`Failed to fetch companies (attempt ${retryCount}/${maxRetries}):`, e)

        if (retryCount >= maxRetries) {
          error.value = e.message || 'Failed to fetch companies after multiple attempts'
          loading.value = false
          logger.error('Max retries reached, giving up', { error: error.value })
        } else {
          // Wait before retrying (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, retryCount), 8000)
          logger.debug(`Retrying in ${delay}ms...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }
  }

  const initializeFilterOptions = () => {
    // Locations
    const locations = getUniqueLocations(companies.value)
    filters.value.location.options = locations.map((location: string) => ({
      key: location,
      value: location,
    }))

    // Categories
    const categories = getUniqueCategories(companies.value)
    filters.value.category.options = categories.map((category: string) => ({
      key: category,
      value: category,
    }))

    // Company types
    filters.value.type.options = [
      { key: 'government', value: 'Government' },
      { key: 'private', value: 'Private' },
    ]
  }

  const loadSavedPreferences = () => {
    if (!import.meta.client) return

    // Load filters
    const savedFilters = localStorage.getItem('companies-filters')
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters)
        // Merge with current filter options
        filters.value = {
          ...parsedFilters,
          location: {
            value: parsedFilters.location.value,
            options: filters.value.location.options,
          },
          category: {
            value: parsedFilters.category.value,
            options: filters.value.category.options,
          },
          type: {
            value: parsedFilters.type.value,
            options: filters.value.type.options,
          },
        }
      } catch (e) {
        console.error('Error parsing saved filters:', e)
      }
    }

    // Load view mode
    const savedViewMode = localStorage.getItem('companies-view-mode')
    if (savedViewMode && (savedViewMode === 'grid' || savedViewMode === 'list')) {
      viewMode.value = savedViewMode
    }

    // Load sort preference
    const savedSort = localStorage.getItem('companies-sort')
    if (savedSort) {
      try {
        sortPreference.value = JSON.parse(savedSort)
      } catch (e) {
        console.error('Error parsing saved sort preference:', e)
      }
    }

    // Load recently viewed companies
    const savedRecentlyViewed = localStorage.getItem('recently-viewed-companies')
    if (savedRecentlyViewed) {
      try {
        storedPreferences.value.recentlyViewedCompanies = JSON.parse(savedRecentlyViewed)
      } catch (e) {
        console.error('Error parsing recently viewed companies:', e)
      }
    }
  }

  // Search handling with Fuse.js
  const handleSearch = (query: string) => {
    searchQuery.value = query

    if (!query) {
      searchResults.value = []
      return
    }

    const fuse = new Fuse(companies.value, {
      keys: ['name', 'description', 'category', 'keywords', 'city', 'country'],
      threshold: 0.3,
      includeScore: true,
    })

    const results = fuse.search(query)
    searchResults.value = results.map((result) => result.item)
  }

  // Reset filters
  const resetFilters = () => {
    filters.value = {
      location: { value: null, options: filters.value.location.options },
      category: { value: null, options: filters.value.category.options },
      type: { value: null, options: filters.value.type.options },
      foundingYearRange: { min: null, max: null },
      tags: [],
    }

    if (import.meta.client) {
      localStorage.removeItem('companies-filters')
    }
  }

  // Set active view mode
  const setViewMode = (mode: 'grid' | 'list') => {
    viewMode.value = mode
  }

  // Set sort preferences
  const setSortPreference = (sortBy: string, isAscending: boolean) => {
    sortPreference.value = { sortBy, isAscending }
  }

  // Track company view
  const viewCompanyDetails = (company: Company) => {
    selectedCompany.value = company
    showDetailModal.value = true

    // Add to recently viewed (if not already at the top)
    if (storedPreferences.value.recentlyViewedCompanies[0] !== company.id) {
      // Remove if already exists
      const filtered = storedPreferences.value.recentlyViewedCompanies.filter(
        (id) => id !== company.id,
      )

      // Add to front of array
      storedPreferences.value.recentlyViewedCompanies = [company.id, ...filtered].slice(0, 10)

      // Save to localStorage
      if (import.meta.client) {
        localStorage.setItem(
          'recently-viewed-companies',
          JSON.stringify(storedPreferences.value.recentlyViewedCompanies),
        )
      }
    }
  }

  // Add tag to filters
  const addTagFilter = (tag: string) => {
    if (!filters.value.tags) {
      filters.value.tags = []
    }

    if (!filters.value.tags.includes(tag)) {
      filters.value.tags.push(tag)
    }
  }

  // Remove tag from filters
  const removeTagFilter = (tag: string) => {
    if (!filters.value.tags) return

    filters.value.tags = filters.value.tags.filter((t) => t !== tag)
  }

  // Get recently viewed companies data
  const recentlyViewedCompaniesData = computed(() => {
    return storedPreferences.value.recentlyViewedCompanies
      .map((id) => companies.value.find((company) => company.id === id))
      .filter(Boolean)
  })

  return {
    // State
    companies,
    loading,
    error,
    filters,
    viewMode,
    sortPreference,
    searchQuery,
    selectedCompany,
    showDetailModal,

    // Computed
    filteredCompanies,
    recentlyViewedCompaniesData,

    // Actions
    fetchCompanies,
    resetFilters,
    handleSearch,
    setViewMode,
    setSortPreference,
    viewCompanyDetails,
    addTagFilter,
    removeTagFilter,
  }
})
