/**
 * Utility functions for filtering and sorting opportunity data
 */
import type { Opportunity } from '~/types/opportunities'

/**
 * Filter opportunities by location
 * @param opportunities Array of opportunity objects
 * @param location Location string to filter by
 * @returns Filtered array of opportunities
 */
export function filterOpportunitiesByLocation(opportunities: Opportunity[], location?: string): Opportunity[] {
  if (!location) return opportunities

  const normalizedLocation = location.toLowerCase().trim()
  return opportunities.filter(
    (opportunity) => opportunity.location && opportunity.location.toLowerCase().includes(normalizedLocation),
  )
}

/**
 * Filter opportunities by company
 * @param opportunities Array of opportunity objects
 * @param companyId Company ID to filter by
 * @returns Filtered array of opportunities
 */
export function filterOpportunitiesByCompany(opportunities: Opportunity[], companyId?: string): Opportunity[] {
  if (!companyId) return opportunities

  return opportunities.filter((opportunity) => opportunity.company_id === companyId)
}

/**
 * Filter opportunities by employment type
 * @param opportunities Array of opportunity objects
 * @param type Employment type to filter by
 * @returns Filtered array of opportunities
 */
export function filterOpportunitiesByType(opportunities: Opportunity[], type?: string): Opportunity[] {
  if (!type) return opportunities

  const normalizedType = type.toLowerCase().trim()
  return opportunities.filter(
    (opportunity) => opportunity.employment_type && opportunity.employment_type.toLowerCase() === normalizedType,
  )
}

/**
 * Filter opportunities by salary range
 * @param opportunities Array of opportunity objects
 * @param min Minimum salary
 * @param max Maximum salary
 * @returns Filtered array of opportunities
 */
export function filterOpportunitiesBySalary(opportunities: Opportunity[], min?: number, max?: number): Opportunity[] {
  let filtered = opportunities

  if (min) {
    filtered = filtered.filter((opportunity) => typeof opportunity.salary === 'number' && opportunity.salary >= min)
  }

  if (max) {
    filtered = filtered.filter((opportunity) => typeof opportunity.salary === 'number' && opportunity.salary <= max)
  }

  return filtered
}

/**
 * Filter opportunities by tags
 * @param opportunities Array of opportunity objects
 * @param tags Tags to filter by
 * @returns Filtered array of opportunities
 */
export function filterOpportunitiesByTags(opportunities: Opportunity[], tags?: string[]): Opportunity[] {
  if (!tags || tags.length === 0) return opportunities

  return opportunities.filter((opportunity) => {
    if (!opportunity.tags || opportunity.tags.length === 0) return false

    // Check if opportunity has any of the specified tags
    return tags.some((tag) => opportunity.tags?.some((opportunityTag) => opportunityTag.toLowerCase() === tag.toLowerCase()))
  })
}

/**
 * Filter opportunities by keyword in title or description
 * @param opportunities Array of opportunity objects
 * @param searchQuery Search query string
 * @returns Filtered array of opportunities
 */
export function filterOpportunitiesByKeyword(opportunities: Opportunity[], searchQuery?: string): Opportunity[] {
  if (!searchQuery) return opportunities

  const normalizedQuery = searchQuery.toLowerCase().trim()
  return opportunities.filter((opportunity) => {
    const titleMatch = opportunity.title && opportunity.title.toLowerCase().includes(normalizedQuery)
    const descriptionMatch =
      opportunity.description && opportunity.description.toLowerCase().includes(normalizedQuery)
    const companyMatch = opportunity.company && opportunity.company.toLowerCase().includes(normalizedQuery)

    return titleMatch || descriptionMatch || companyMatch
  })
}

/**
 * Sort opportunities by a specific field
 * @param opportunities Array of opportunity objects
 * @param sortBy Field to sort by
 * @param ascending Sort ascending or descending
 * @returns Sorted array of opportunities
 */
export function sortOpportunities(
  opportunities: Opportunity[],
  sortBy: string = 'published_at',
  ascending: boolean = false,
): Opportunity[] {
  const sorted = [...opportunities] // Create a copy to avoid mutating the original

  sorted.sort((a, b) => {
    let valueA: any
    let valueB: any

    switch (sortBy) {
      case 'title':
        valueA = a.title || ''
        valueB = b.title || ''
        break
      case 'company':
        valueA = a.company || ''
        valueB = b.company || ''
        break
      case 'location':
        valueA = a.location || ''
        valueB = b.location || ''
        break
      case 'salary':
        valueA = a.salary || 0
        valueB = b.salary || 0
        break
      case 'published_at':
        valueA = a.published_at ? new Date(a.published_at).getTime() : 0
        valueB = b.published_at ? new Date(b.published_at).getTime() : 0
        break
      case 'expires_at':
        valueA = a.expires_at ? new Date(a.expires_at).getTime() : Infinity
        valueB = b.expires_at ? new Date(b.expires_at).getTime() : Infinity
        break
      case 'hot_score':
        valueA = a.hot_score || 0
        valueB = b.hot_score || 0
        break
      default:
        valueA = a[sortBy as keyof Opportunity] || ''
        valueB = b[sortBy as keyof Opportunity] || ''
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
 * Group opportunities by location
 * @param opportunities Array of opportunity objects
 * @returns Object with locations as keys and arrays of opportunities as values
 */
export function groupOpportunitiesByLocation(opportunities: Opportunity[]): Record<string, Opportunity[]> {
  return opportunities.reduce(
    (groups, opportunity) => {
      if (!opportunity.location) return groups

      const location = opportunity.location.trim()
      if (!groups[location]) {
        groups[location] = []
      }

      groups[location].push(opportunity)
      return groups
    },
    {} as Record<string, Opportunity[]>,
  )
}

/**
 * Get unique locations from opportunities
 * @param opportunities Array of opportunity objects
 * @returns Array of unique locations
 */
export function getUniqueLocations(opportunities: Opportunity[]): string[] {
  const locations = new Set<string>()

  opportunities.forEach((opportunity) => {
    if (opportunity.location) {
      locations.add(opportunity.location.trim())
    }
  })

  return Array.from(locations)
}

/**
 * Get unique employment types from opportunities
 * @param opportunities Array of opportunity objects
 * @returns Array of unique employment types
 */
export function getUniqueEmploymentTypes(opportunities: Opportunity[]): string[] {
  const types = new Set<string>()

  opportunities.forEach((opportunity) => {
    if (opportunity.employment_type) {
      types.add(opportunity.employment_type.trim())
    }
  })

  return Array.from(types)
}

/**
 * Get unique companies from opportunities
 * @param opportunities Array of opportunity objects
 * @returns Array of unique company objects with id and name
 */
export function getUniqueCompanies(opportunities: Opportunity[]): Array<{ id: string; name: string }> {
  const companies = new Map<string, string>()

  opportunities.forEach((opportunity) => {
    if (opportunity.company_id && opportunity.company) {
      companies.set(opportunity.company_id, opportunity.company)
    }
  })

  return Array.from(companies.entries()).map(([id, name]) => ({ id, name }))
}

/**
 * Apply multiple filters at once
 * @param opportunities Array of opportunity objects
 * @param filters Object with filter parameters
 * @returns Filtered array of opportunities
 */
export function applyFilters(
  opportunities: Opportunity[],
  filters: {
    location?: string
    companyId?: string
    type?: string
    minSalary?: number
    maxSalary?: number
    tags?: string[]
    searchQuery?: string
    sortBy?: string
    ascending?: boolean
  },
): Opportunity[] {
  let filtered = [...opportunities]

  // Apply all filters in sequence
  if (filters.location) {
    filtered = filterOpportunitiesByLocation(filtered, filters.location)
  }

  if (filters.companyId) {
    filtered = filterOpportunitiesByCompany(filtered, filters.companyId)
  }

  if (filters.type) {
    filtered = filterOpportunitiesByType(filtered, filters.type)
  }

  if (filters.minSalary || filters.maxSalary) {
    filtered = filterOpportunitiesBySalary(filtered, filters.minSalary, filters.maxSalary)
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filterOpportunitiesByTags(filtered, filters.tags)
  }

  if (filters.searchQuery) {
    filtered = filterOpportunitiesByKeyword(filtered, filters.searchQuery)
  }

  // Sort results
  return sortOpportunities(filtered, filters.sortBy || 'published_at', filters.ascending || false)
}
