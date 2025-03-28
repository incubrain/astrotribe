/**
 * Utility functions for filtering and sorting job data
 */
import type { Job } from '~/types/jobs'

/**
 * Filter jobs by location
 * @param jobs Array of job objects
 * @param location Location string to filter by
 * @returns Filtered array of jobs
 */
export function filterJobsByLocation(jobs: Job[], location?: string): Job[] {
  if (!location) return jobs

  const normalizedLocation = location.toLowerCase().trim()
  return jobs.filter(
    (job) => job.location && job.location.toLowerCase().includes(normalizedLocation),
  )
}

/**
 * Filter jobs by company
 * @param jobs Array of job objects
 * @param companyId Company ID to filter by
 * @returns Filtered array of jobs
 */
export function filterJobsByCompany(jobs: Job[], companyId?: string): Job[] {
  if (!companyId) return jobs

  return jobs.filter((job) => job.company_id === companyId)
}

/**
 * Filter jobs by employment type
 * @param jobs Array of job objects
 * @param type Employment type to filter by
 * @returns Filtered array of jobs
 */
export function filterJobsByType(jobs: Job[], type?: string): Job[] {
  if (!type) return jobs

  const normalizedType = type.toLowerCase().trim()
  return jobs.filter(
    (job) => job.employment_type && job.employment_type.toLowerCase() === normalizedType,
  )
}

/**
 * Filter jobs by salary range
 * @param jobs Array of job objects
 * @param min Minimum salary
 * @param max Maximum salary
 * @returns Filtered array of jobs
 */
export function filterJobsBySalary(jobs: Job[], min?: number, max?: number): Job[] {
  let filtered = jobs

  if (min) {
    filtered = filtered.filter((job) => typeof job.salary === 'number' && job.salary >= min)
  }

  if (max) {
    filtered = filtered.filter((job) => typeof job.salary === 'number' && job.salary <= max)
  }

  return filtered
}

/**
 * Filter jobs by tags
 * @param jobs Array of job objects
 * @param tags Tags to filter by
 * @returns Filtered array of jobs
 */
export function filterJobsByTags(jobs: Job[], tags?: string[]): Job[] {
  if (!tags || tags.length === 0) return jobs

  return jobs.filter((job) => {
    if (!job.tags || job.tags.length === 0) return false

    // Check if job has any of the specified tags
    return tags.some((tag) => job.tags.some((jobTag) => jobTag.toLowerCase() === tag.toLowerCase()))
  })
}

/**
 * Filter jobs by keyword in title or description
 * @param jobs Array of job objects
 * @param searchQuery Search query string
 * @returns Filtered array of jobs
 */
export function filterJobsByKeyword(jobs: Job[], searchQuery?: string): Job[] {
  if (!searchQuery) return jobs

  const normalizedQuery = searchQuery.toLowerCase().trim()
  return jobs.filter((job) => {
    const titleMatch = job.title && job.title.toLowerCase().includes(normalizedQuery)
    const descriptionMatch =
      job.description && job.description.toLowerCase().includes(normalizedQuery)
    const companyMatch = job.company && job.company.toLowerCase().includes(normalizedQuery)

    return titleMatch || descriptionMatch || companyMatch
  })
}

/**
 * Sort jobs by a specific field
 * @param jobs Array of job objects
 * @param sortBy Field to sort by
 * @param ascending Sort ascending or descending
 * @returns Sorted array of jobs
 */
export function sortJobs(
  jobs: Job[],
  sortBy: string = 'published_at',
  ascending: boolean = false,
): Job[] {
  const sorted = [...jobs] // Create a copy to avoid mutating the original

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
        valueA = a[sortBy as keyof Job] || ''
        valueB = b[sortBy as keyof Job] || ''
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
 * Group jobs by location
 * @param jobs Array of job objects
 * @returns Object with locations as keys and arrays of jobs as values
 */
export function groupJobsByLocation(jobs: Job[]): Record<string, Job[]> {
  return jobs.reduce(
    (groups, job) => {
      if (!job.location) return groups

      const location = job.location.trim()
      if (!groups[location]) {
        groups[location] = []
      }

      groups[location].push(job)
      return groups
    },
    {} as Record<string, Job[]>,
  )
}

/**
 * Get unique locations from jobs
 * @param jobs Array of job objects
 * @returns Array of unique locations
 */
export function getUniqueLocations(jobs: Job[]): string[] {
  const locations = new Set<string>()

  jobs.forEach((job) => {
    if (job.location) {
      locations.add(job.location.trim())
    }
  })

  return Array.from(locations)
}

/**
 * Get unique employment types from jobs
 * @param jobs Array of job objects
 * @returns Array of unique employment types
 */
export function getUniqueEmploymentTypes(jobs: Job[]): string[] {
  const types = new Set<string>()

  jobs.forEach((job) => {
    if (job.employment_type) {
      types.add(job.employment_type.trim())
    }
  })

  return Array.from(types)
}

/**
 * Get unique companies from jobs
 * @param jobs Array of job objects
 * @returns Array of unique company objects with id and name
 */
export function getUniqueCompanies(jobs: Job[]): Array<{ id: string; name: string }> {
  const companies = new Map<string, string>()

  jobs.forEach((job) => {
    if (job.company_id && job.company) {
      companies.set(job.company_id, job.company)
    }
  })

  return Array.from(companies.entries()).map(([id, name]) => ({ id, name }))
}

/**
 * Apply multiple filters at once
 * @param jobs Array of job objects
 * @param filters Object with filter parameters
 * @returns Filtered array of jobs
 */
export function applyFilters(
  jobs: Job[],
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
): Job[] {
  let filtered = [...jobs]

  // Apply all filters in sequence
  if (filters.location) {
    filtered = filterJobsByLocation(filtered, filters.location)
  }

  if (filters.companyId) {
    filtered = filterJobsByCompany(filtered, filters.companyId)
  }

  if (filters.type) {
    filtered = filterJobsByType(filtered, filters.type)
  }

  if (filters.minSalary || filters.maxSalary) {
    filtered = filterJobsBySalary(filtered, filters.minSalary, filters.maxSalary)
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filterJobsByTags(filtered, filters.tags)
  }

  if (filters.searchQuery) {
    filtered = filterJobsByKeyword(filtered, filters.searchQuery)
  }

  // Sort results
  return sortJobs(filtered, filters.sortBy || 'published_at', filters.ascending || false)
}
