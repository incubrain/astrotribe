import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedFeedSources(
  pool: Pool,
  feedIds: string[] = [],
  sourceIds: string[] = [],
) {
  // Handle empty feeds
  if (feedIds.length === 0) {
    try {
      // Try to get feed IDs from database
      const { rows: feedRows } = await pool.query('SELECT id FROM feeds LIMIT 100')
      if (feedRows.length > 0) {
        feedIds = feedRows.map((row) => row.id)
      } else {
        console.warn('No feeds found for feed sources')
        return []
      }
    } catch (error) {
      console.error('Error fetching feed IDs:', error)
      return []
    }
  }

  // Handle empty content sources
  if (sourceIds.length === 0) {
    try {
      // Try to get content source IDs from database
      const { rows: sourceRows } = await pool.query('SELECT id FROM content_sources LIMIT 100')
      if (sourceRows.length > 0) {
        sourceIds = sourceRows.map((row) => row.id)
      } else {
        console.warn('No content sources found for feed sources')
        return []
      }
    } catch (error) {
      console.error('Error fetching content source IDs:', error)
      return []
    }
  }

  // If we still don't have feeds or sources, return empty array
  if (feedIds.length === 0 || sourceIds.length === 0) {
    console.warn('Could not find feeds or content sources for feed_sources')
    return []
  }

  // Create unique feed-source pairs to avoid duplicates
  const feedSourcePairs = new Set<string>()
  interface FeedSource {
    id: string
    feed_id: string
    content_source_id: string
    created_at: Date
  }

  const feedSources: FeedSource[] = []

  // Each feed can have multiple sources
  for (const feedId of feedIds) {
    // Randomly select 1-5 sources for this feed
    const numSources = faker.number.int({ min: 1, max: Math.min(5, sourceIds.length) })
    const shuffledSources = faker.helpers.shuffle([...sourceIds]).slice(0, numSources)

    for (const sourceId of shuffledSources) {
      const pairKey = `${feedId}-${sourceId}`
      if (!feedSourcePairs.has(pairKey)) {
        feedSourcePairs.add(pairKey)

        feedSources.push({
          id: generateUUID(),
          feed_id: feedId,
          content_source_id: sourceId,
          created_at: faker.date.past(),
        })
      }
    }
  }

  await bulkInsert(pool, 'feed_sources', feedSources)
  return feedSources
}
