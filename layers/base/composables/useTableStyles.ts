// Create this in a composable file like useTableStyles.ts

import { computed } from 'vue'
import type { Job } from '~/types/jobs'

export const useTableStyles = () => {
  /**
   * Dynamic row class function for DataTable
   * Applies special styling for featured items based on theme tokens
   */
  const getRowClass = (data: Job) => {
    return {
      'featured-row': data.featured,
    }
  }

  /**
   * Gets severity level for a tag based on its content
   * Useful for applying PrimeVue severity colors to tags
   */
  const getTagSeverity = (tag: string) => {
    // Map common tag categories to severity levels
    const tagMap: Record<string, string> = {
      senior: 'info',
      junior: 'success',
      remote: 'info',
      contract: 'warning',
      fulltime: 'success',
      parttime: 'warning',
      urgent: 'danger',
      featured: 'info',
    }

    // Check if the tag (or part of it) matches any key in the map
    const matchedKey = Object.keys(tagMap).find((key) =>
      tag.toLowerCase().includes(key.toLowerCase()),
    )

    // Return the appropriate severity or default to 'secondary'
    return matchedKey ? tagMap[matchedKey] : 'secondary'
  }

  return {
    getRowClass,
    getTagSeverity,
  }
}
