import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedFeedCategories(
  pool: Pool,
  feedIds: string[] = [],
  categoryIds: string[] = [], // Use string type for UUID values
) {
  // Handle empty inputs
  if (feedIds.length === 0) {
    try {
      // Try to get feed IDs from database
      const { rows: feedRows } = await pool.query('SELECT id FROM feeds LIMIT 100')
      if (feedRows.length > 0) {
        feedIds = feedRows.map((row) => row.id)
      } else {
        console.warn('No feeds found for feed categories')
        return []
      }
    } catch (error) {
      console.error('Error fetching feed IDs:', error)
      return []
    }
  }

  if (categoryIds.length === 0) {
    try {
      // Try to get category IDs from database - now expecting UUID values
      const { rows: categoryRows } = await pool.query('SELECT id FROM categories LIMIT 100')
      if (categoryRows.length > 0) {
        categoryIds = categoryRows.map((row) => row.id)
      } else {
        console.warn('No categories found for feed categories')
        return []
      }
    } catch (error) {
      console.error('Error fetching category IDs:', error)
      return []
    }
  }

  // If we still don't have feeds or categories, return empty array
  if (feedIds.length === 0 || categoryIds.length === 0) {
    console.warn('Could not find feeds or categories for feed_categories')
    return []
  }

  // Create unique feed-category pairs to avoid duplicates
  const feedCategoryPairs = new Set<string>()
  const feedCategories = [] as any[]

  // Each feed can have 1-3 categories
  for (const feedId of feedIds) {
    // Randomly select 1-3 categories for this feed
    const numCategories = faker.number.int({ min: 1, max: Math.min(3, categoryIds.length) })
    const shuffledCategories = faker.helpers.shuffle([...categoryIds]).slice(0, numCategories)

    for (const categoryId of shuffledCategories) {
      const pairKey = `${feedId}-${categoryId}`
      if (!feedCategoryPairs.has(pairKey)) {
        feedCategoryPairs.add(pairKey)

        // Use the UUID directly since the database now expects UUID type
        feedCategories.push({
          id: generateUUID(),
          created_at: faker.date.past(),
          feed_id: feedId,
          category_id: categoryId, // Use the UUID directly
        })
      }
    }
  }

  await bulkInsert(pool, 'feed_categories', feedCategories)
  return feedCategories
}
