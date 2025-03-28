/**
 * Utility functions for filtering news data
 */
import type { NewsCategory } from '@/stores/useNewsStore'

// Interface for news items
interface NewsItem {
  id: string
  title: string
  description?: string | null
  published_at?: string | null
  details?: {
    categories?: Array<{ name: string; isPrimary: boolean }>
    tags?: string[]
  }
  source_id?: string | null
  hot_score?: number
}

/**
 * Filter news by category
 * @param news Array of news items
 * @param category Category to filter by
 * @returns Filtered array of news items
 */
export function filterNewsByCategory(news: NewsItem[], category: NewsCategory): NewsItem[] {
  if (category === 'all') return news

  if (category === 'new') {
    // Sort by date, newest first
    return [...news].sort((a, b) => {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
      return dateB - dateA
    })
  }

  if (category === 'hot') {
    // Sort by hot score, highest first
    return [...news].sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0))
  }

  // Filter by category
  return news.filter((item) =>
    item.details?.categories?.some((cat) => cat.name.toLowerCase() === category.toLowerCase()),
  )
}

/**
 * Filter news by source
 * @param news Array of news items
 * @param sourceIds Source IDs to filter by
 * @returns Filtered array of news items
 */
export function filterNewsBySources(news: NewsItem[], sourceIds: string[]): NewsItem[] {
  if (!sourceIds.length) return news

  return news.filter((item) => item.source_id && sourceIds.includes(item.source_id))
}

/**
 * Filter news by date range
 * @param news Array of news items
 * @param startDate Start date
 * @param endDate End date
 * @returns Filtered array of news items
 */
export function filterNewsByDateRange(
  news: NewsItem[],
  startDate?: Date | null,
  endDate?: Date | null,
): NewsItem[] {
  if (!startDate && !endDate) return news

  return news.filter((item) => {
    if (!item.published_at) return false

    const itemDate = new Date(item.published_at)
    const startOk = !startDate || itemDate >= startDate
    const endOk = !endDate || itemDate <= endDate

    return startOk && endOk
  })
}

/**
 * Filter news by tags
 * @param news Array of news items
 * @param tags Tags to filter by
 * @returns Filtered array of news items
 */
export function filterNewsByTags(news: NewsItem[], tags: string[]): NewsItem[] {
  if (!tags.length) return news

  return news.filter((item) => item.details?.tags?.some((tag) => tags.includes(tag)))
}

/**
 * Filter news by keyword search
 * @param news Array of news items
 * @param query Search query
 * @returns Filtered array of news items
 */
export function filterNewsByKeyword(news: NewsItem[], query: string): NewsItem[] {
  if (!query) return news

  const normalizedQuery = query.toLowerCase().trim()

  return news.filter(
    (item) =>
      item.title?.toLowerCase().includes(normalizedQuery) ||
      item.description?.toLowerCase().includes(normalizedQuery) ||
      item.details?.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery)),
  )
}

/**
 * Calculate estimated reading time for content
 * @param text Text content
 * @param wordsPerMinute Average reading speed (default: 200)
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(text?: string | null, wordsPerMinute = 200): number {
  if (!text) return 2 // Default fallback

  const wordCount = text.split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

/**
 * Extract domain name from URL
 * @param url URL string
 * @returns Domain name without www.
 */
export function extractDomain(url?: string): string {
  if (!url) return 'Source'

  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return 'Source'
  }
}

/**
 * Apply multiple filters at once
 * @param news Array of news items
 * @param filters Object with filter parameters
 * @returns Filtered array of news items
 */
export function applyNewsFilters(
  news: NewsItem[],
  filters: {
    category?: NewsCategory
    sourceIds?: string[]
    startDate?: Date | null
    endDate?: Date | null
    tags?: string[]
    searchQuery?: string
  },
): NewsItem[] {
  let filtered = [...news]

  // Apply all filters in sequence
  if (filters.category && filters.category !== 'all') {
    filtered = filterNewsByCategory(filtered, filters.category)
  }

  if (filters.sourceIds?.length) {
    filtered = filterNewsBySources(filtered, filters.sourceIds)
  }

  if (filters.startDate || filters.endDate) {
    filtered = filterNewsByDateRange(filtered, filters.startDate, filters.endDate)
  }

  if (filters.tags?.length) {
    filtered = filterNewsByTags(filtered, filters.tags)
  }

  if (filters.searchQuery) {
    filtered = filterNewsByKeyword(filtered, filters.searchQuery)
  }

  return filtered
}

/**
 * Get unique categories from news items
 * @param news Array of news items
 * @returns Array of unique category names
 */
export function getUniqueCategories(news: NewsItem[]): string[] {
  const categories = new Set<string>()

  news.forEach((item) => {
    item.details?.categories?.forEach((category) => {
      categories.add(category.name)
    })
  })

  return Array.from(categories)
}

/**
 * Get unique tags from news items
 * @param news Array of news items
 * @returns Array of unique tags
 */
export function getUniqueTags(news: NewsItem[]): string[] {
  const tags = new Set<string>()

  news.forEach((item) => {
    item.details?.tags?.forEach((tag) => {
      tags.add(tag)
    })
  })

  return Array.from(tags)
}
