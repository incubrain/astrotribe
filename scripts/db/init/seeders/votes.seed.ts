import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedVotes(pool: Pool, userIds: string[], contentIds: string[]) {
  if (userIds.length === 0 || contentIds.length === 0) {
    console.warn('No users or content available for voting')
    return []
  }

  // Generate unique combinations to avoid duplicate vote constraints
  const userContentPairs = new Set<string>()
  const contentTypes = ['article', 'news', 'research', 'job', 'company']

  // Limited number of votes to reduce chance of collision
  const maxVotes = Math.min(500, userIds.length * contentIds.length)

  // Create votes with unique user-content combinations
  const votes = []
  let attempts = 0
  const maxAttempts = maxVotes * 3 // Allow some extra attempts to find unique combinations

  while (votes.length < maxVotes && attempts < maxAttempts) {
    attempts++

    const userId = faker.helpers.arrayElement(userIds)
    const contentId = faker.helpers.arrayElement(contentIds)
    const contentType = faker.helpers.arrayElement(contentTypes)
    const key = `${contentType}-${contentId}-${userId}`

    if (!userContentPairs.has(key)) {
      userContentPairs.add(key)

      votes.push({
        id: generateUUID(),
        content_type: contentType,
        content_id: contentId,
        user_id: userId,
        vote_type: faker.helpers.arrayElement([-1, 1]), // Downvote or upvote
        created_at: faker.date.past(),
      })
    }
  }

  // Check if database already has votes with the same content_type, content_id, user_id
  // This extra step helps avoid constraint violations
  try {
    // For each vote, check if it already exists
    for (let i = votes.length - 1; i >= 0; i--) {
      const vote = votes[i]
      const { rows } = await pool.query(
        'SELECT 1 FROM votes WHERE content_type = $1 AND content_id = $2 AND user_id = $3 LIMIT 1',
        [vote.content_type, vote.content_id, vote.user_id],
      )

      if (rows.length > 0) {
        // Remove votes that already exist
        votes.splice(i, 1)
      }
    }
  } catch (error: any) {
    console.warn('Error checking existing votes:', error)
  }

  if (votes.length === 0) {
    console.warn('No valid votes to insert - all potential combinations already exist in database')
    return []
  }

  console.log(`Inserting ${votes.length} votes after filtering for duplicates`)
  await bulkInsert(pool, 'votes', votes)
  return votes
}
