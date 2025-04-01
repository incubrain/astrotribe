import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedBookmarks(pool: Pool, userIds: string[], contentIds: string[]) {
  if (userIds.length === 0 || contentIds.length === 0) {
    console.warn('No users or content available for creating bookmarks')
    return []
  }

  console.log(
    `Generating bookmarks for ${userIds.length} users with ${contentIds.length} content items`,
  )

  try {
    // First, get existing user-content-type combinations to avoid duplicates
    const existingCombinations = new Set<string>()
    try {
      const { rows } = await pool.query('SELECT user_id, content_type, content_id FROM bookmarks')
      rows.forEach((row) => {
        existingCombinations.add(`${row.user_id}-${row.content_type}-${row.content_id}`)
      })
      console.log(`Found ${existingCombinations.size} existing bookmark combinations`)
    } catch (err) {
      console.warn('Could not query existing bookmarks')
    }

    // Valid content types
    const contentTypes = ['article', 'news', 'research', 'job', 'company']

    const bookmarks = [] as {
      id: string
      user_id: string
      content_id: string
      content_type: string
      created_at: Date
      metadata: string
    }[]

    // Generate bookmarks with unique combinations
    for (const userId of userIds) {
      // Only create 1-3 bookmarks per user to minimize chance of conflicts
      const numBookmarks = faker.number.int({ min: 1, max: 3 })

      for (let i = 0; i < numBookmarks; i++) {
        // Try up to 10 times to find a unique combination for this user
        for (let attempt = 0; attempt < 10; attempt++) {
          const contentId = faker.helpers.arrayElement(contentIds)
          const contentType = faker.helpers.arrayElement(contentTypes)
          const key = `${userId}-${contentType}-${contentId}`

          // Skip if this combination already exists
          if (existingCombinations.has(key)) {
            continue
          }

          existingCombinations.add(key)

          bookmarks.push({
            id: generateUUID(),
            user_id: userId,
            content_id: contentId,
            content_type: contentType,
            created_at: faker.date.past(),
            metadata: JSON.stringify({
              saved_from: faker.helpers.arrayElement([
                'feed',
                'search',
                'profile',
                'recommendation',
              ]),
              notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
            }),
          })

          // Break the attempt loop if we successfully added a bookmark
          break
        }
      }
    }

    if (bookmarks.length === 0) {
      console.log('No unique bookmarks could be created after checking existing combinations')
      return []
    }

    console.log(`Generated ${bookmarks.length} unique bookmarks`)

    // Log a sample bookmark
    if (bookmarks.length > 0) {
      console.log('Sample bookmark:', JSON.stringify(bookmarks[0], null, 2))
    }

    await bulkInsert(pool, 'bookmarks', bookmarks)
    return bookmarks
  } catch (error: any) {
    console.error('Error in seedBookmarks:', error)
    throw error
  }
}
