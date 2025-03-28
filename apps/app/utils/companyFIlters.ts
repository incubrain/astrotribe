/**
 * Utility functions for filtering and sorting company data
 */

type Company = any // Replace with your actual Company type

/**
 * Filter companies by location
 * @param companies Array of company objects
 * @param location Location string to filter by
 * @returns Filtered array of companies
 */
export function filterCompaniesByLocation(companies: Company[], location?: string): Company[] {
  if (!location) return companies

  const normalizedLocation = location.toLowerCase().trim()
  return companies.filter((company) => {
    const cityMatch = company.city && company.city.toLowerCase().includes(normalizedLocation)
    const countryMatch =
      company.country && company.country.toLowerCase().includes(normalizedLocation)
    return cityMatch || countryMatch
  })
}

/**
 * Filter companies by category
 * @param companies Array of company objects
 * @param category Category to filter by
 * @returns Filtered array of companies
 */
export function filterCompaniesByCategory(companies: Company[], category?: string): Company[] {
  if (!category) return companies

  const normalizedCategory = category.toLowerCase().trim()
  return companies.filter(
    (company) => company.category && company.category.toLowerCase() === normalizedCategory,
  )
}

/**
 * Filter companies by type (government/private)
 * @param companies Array of company objects
 * @param type 'government' or 'private'
 * @returns Filtered array of companies
 */
export function filterCompaniesByType(companies: Company[], type?: string): Company[] {
  if (!type) return companies

  const isGovernment = type.toLowerCase() === 'government'
  return companies.filter((company) => company.is_government === isGovernment)
}

/**
 * Filter companies by founding year range
 * @param companies Array of company objects
 * @param min Minimum founding year
 * @param max Maximum founding year
 * @returns Filtered array of companies
 */
export function filterCompaniesByFoundingYear(
  companies: Company[],
  min?: number,
  max?: number,
): Company[] {
  let filtered = [...companies]

  if (min) {
    filtered = filtered.filter((company) => company.founding_year && company.founding_year >= min)
  }

  if (max) {
    filtered = filtered.filter((company) => company.founding_year && company.founding_year <= max)
  }

  return filtered
}

/**
 * Filter companies by keywords/tags
 * @param companies Array of company objects
 * @param tags Tags to filter by
 * @returns Filtered array of companies
 */
export function filterCompaniesByTags(companies: Company[], tags?: string[]): Company[] {
  if (!tags || tags.length === 0) return companies

  return companies.filter((company) => {
    if (!company.keywords || company.keywords.length === 0) return false

    // Check if company has any of the specified tags
    return tags.some((tag) =>
      company.keywords.some((keyword: string) => keyword.toLowerCase() === tag.toLowerCase()),
    )
  })
}

/**
 * Filter companies by search query in name or description
 * @param companies Array of company objects
 * @param searchQuery Search query string
 * @returns Filtered array of companies
 */
export function filterCompaniesByKeyword(companies: Company[], searchQuery?: string): Company[] {
  if (!searchQuery) return companies

  const normalizedQuery = searchQuery.toLowerCase().trim()
  return companies.filter((company) => {
    const nameMatch = company.name && company.name.toLowerCase().includes(normalizedQuery)
    const descriptionMatch =
      company.description && company.description.toLowerCase().includes(normalizedQuery)

    return nameMatch || descriptionMatch
  })
}

/**
 * Sort companies by a specific field
 * @param companies Array of company objects
 * @param sortBy Field to sort by
 * @param ascending Sort ascending or descending
 * @returns Sorted array of companies
 */
export function sortCompanies(
  companies: Company[],
  sortBy: string = 'name',
  ascending: boolean = true,
): Company[] {
  const sorted = [...companies] // Create a copy to avoid mutating the original

  sorted.sort((a, b) => {
    let valueA: any
    let valueB: any

    switch (sortBy) {
      case 'name':
        valueA = a.name || ''
        valueB = b.name || ''
        break
      case 'founding_year':
        valueA = a.founding_year || 0
        valueB = b.founding_year || 0
        break
      case 'country':
        valueA = a.country || ''
        valueB = b.country || ''
        break
      default:
        valueA = a[sortBy as keyof Company] || ''
        valueB = b[sortBy as keyof Company] || ''
    }

    // Handle string comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return ascending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    }

    // Handle number comparison
    return ascending ? valueA - valueB : valueB - valueA
  })

  return sorted
}

/**
 * Get unique categories from companies
 * @param companies Array of company objects
 * @returns Array of unique categories
 */
export function getUniqueCategories(companies: Company[]): string[] {
  const categories = new Set<string>()

  companies.forEach((company) => {
    if (company.category) {
      categories.add(company.category.trim())
    }
  })

  return Array.from(categories)
}

/**
 * Get unique locations from companies
 * @param companies Array of company objects
 * @returns Array of unique locations
 */
export function getUniqueLocations(companies: Company[]): string[] {
  const locations = new Set<string>()

  companies.forEach((company) => {
    if (company.city && company.country) {
      locations.add(`${company.city}, ${company.country}`)
    } else if (company.country) {
      locations.add(company.country)
    } else if (company.city) {
      locations.add(company.city)
    }
  })

  return Array.from(locations)
}

/**
 * Apply multiple filters at once
 * @param companies Array of company objects
 * @param filters Object with filter parameters
 * @returns Filtered array of companies
 */
export function applyFilters(
  companies: Company[],
  filters: {
    location?: string
    category?: string
    type?: string
    minFoundingYear?: number
    maxFoundingYear?: number
    tags?: string[]
    searchQuery?: string
    sortBy?: string
    ascending?: boolean
  },
): Company[] {
  let filtered = [...companies]

  // Apply all filters in sequence
  if (filters.location) {
    filtered = filterCompaniesByLocation(filtered, filters.location)
  }

  if (filters.category) {
    filtered = filterCompaniesByCategory(filtered, filters.category)
  }

  if (filters.type) {
    filtered = filterCompaniesByType(filtered, filters.type)
  }

  if (filters.minFoundingYear || filters.maxFoundingYear) {
    filtered = filterCompaniesByFoundingYear(
      filtered,
      filters.minFoundingYear,
      filters.maxFoundingYear,
    )
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filterCompaniesByTags(filtered, filters.tags)
  }

  if (filters.searchQuery) {
    filtered = filterCompaniesByKeyword(filtered, filters.searchQuery)
  }

  // Sort results
  return sortCompanies(filtered, filters.sortBy || 'name', filters.ascending ?? true)
}
