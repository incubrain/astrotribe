/**
 * Composable for location-based job grouping functionality
 */
import { ref, computed } from 'vue'

export interface LocationGroup {
  name: string
  count: number
  normalized: string
}

export interface CountryGroup {
  name: string
  count: number
  cities: LocationGroup[]
}

// Allow for defining a job type or using any
type Job = any

export function useLocationGrouping(jobs: Job[] | Ref<Opportunity[]>) {
  const jobsRef = isRef(jobs) ? jobs : ref(jobs)

  /**
   * Normalize location string for consistent grouping
   * @param location Location string
   * @returns Normalized location string
   */
  const normalizeLocation = (location: string): string => {
    return location
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\bst\.?\b/i, 'saint')
      .replace(/\bmt\.?\b/i, 'mount')
  }

  /**
   * Extract city and country from location string
   * @param location Location string
   * @returns Object with city and country
   */
  const extractCityCountry = (location: string): { city: string; country: string } => {
    // Handle common formats like "City, Country", "City (Country)", etc.
    let city = ''
    let country = ''

    // Try to split by comma
    const commaSplit = location.split(',')
    if (commaSplit.length >= 2) {
      city = commaSplit[0].trim()
      country = commaSplit[commaSplit.length - 1].trim()
      return { city, country }
    }

    // Try to extract from parentheses
    const parenMatch = location.match(/(.+?)\s*\((.+?)\)/)
    if (parenMatch) {
      city = parenMatch[1].trim()
      country = parenMatch[2].trim()
      return { city, country }
    }

    // Try to split by dash
    const dashSplit = location.split('-')
    if (dashSplit.length >= 2) {
      city = dashSplit[0].trim()
      country = dashSplit[dashSplit.length - 1].trim()
      return { city, country }
    }

    // If no pattern matches, consider the whole string as a city
    city = location.trim()
    return { city, country }
  }

  /**
   * Group jobs by location
   * @returns Map of location groups
   */
  const locationGroups = computed(() => {
    const groups = new Map<string, LocationGroup>()

    jobsRef.value.forEach((job) => {
      if (!job.location) return

      const location = job.location.trim()
      const normalized = normalizeLocation(location)

      if (groups.has(normalized)) {
        groups.get(normalized)!.count++
      } else {
        groups.set(normalized, {
          name: location,
          count: 1,
          normalized,
        })
      }
    })

    return groups
  })

  /**
   * Get location groups sorted by count
   */
  const sortedLocationGroups = computed(() => {
    return Array.from(locationGroups.value.values()).sort((a, b) => b.count - a.count)
  })

  /**
   * Group jobs by country, then by city
   * @returns Array of country groups
   */
  const countryGroups = computed(() => {
    const countries = new Map<string, CountryGroup>()

    jobsRef.value.forEach((job) => {
      if (!job.location) return

      const location = job.location.trim()
      const { city, country } = extractCityCountry(location)

      // Skip if no city identified
      if (!city) return

      const normalizedCountry = country ? normalizeLocation(country) : 'other'
      const normalizedCity = normalizeLocation(city)

      // Add or update country
      if (!countries.has(normalizedCountry)) {
        countries.set(normalizedCountry, {
          name: country || 'Other',
          count: 0,
          cities: [],
        })
      }

      const countryGroup = countries.get(normalizedCountry)!
      countryGroup.count++

      // Find city in country's cities
      let cityGroup = countryGroup.cities.find((c) => c.normalized === normalizedCity)

      if (!cityGroup) {
        cityGroup = {
          name: city,
          count: 0,
          normalized: normalizedCity,
        }
        countryGroup.cities.push(cityGroup)
      }

      cityGroup.count++
    })

    // Sort countries by count
    return Array.from(countries.values())
      .sort((a, b) => b.count - a.count)
      .map((country) => ({
        ...country,
        // Sort cities by count
        cities: country.cities.sort((a, b) => b.count - a.count),
      }))
  })

  /**
   * Get location filter options
   * @param limit Maximum number of options to return
   * @returns Array of location options for filtering
   */
  const locationFilterOptions = computed(() => {
    return sortedLocationGroups.value.map((group) => ({
      label: group.name,
      value: group.normalized,
      count: group.count,
    }))
  })

  /**
   * Get top locations
   * @param limit Maximum number of locations to return
   * @returns Array of top locations by job count
   */
  const topLocations = computed(() => {
    return sortedLocationGroups.value.slice(0, 5)
  })

  /**
   * Get jobs for a specific location
   * @param location Location string or normalized location
   * @returns Filtered array of jobs
   */
  const getJobsByLocation = (location: string) => {
    const normalized = normalizeLocation(location)
    return jobsRef.value.filter((job) => {
      if (!job.location) return false
      return normalizeLocation(job.location) === normalized
    })
  }

  /**
   * Get recommended locations based on job density and diversity
   * @returns Array of recommended locations
   */
  const recommendedLocations = computed(() => {
    // Focus on locations with substantial job count
    return sortedLocationGroups.value.filter((location) => location.count >= 3).slice(0, 10)
  })

  return {
    locationGroups,
    sortedLocationGroups,
    countryGroups,
    locationFilterOptions,
    topLocations,
    recommendedLocations,
    getJobsByLocation,
    normalizeLocation,
    extractCityCountry,
  }
}
