import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedFeatureVotes(pool: Pool, userIds: string[], featureRequestIds: string[]) {
  // If we don't have users or feature requests, we can't create votes
  if (userIds.length === 0 || featureRequestIds.length === 0) {
    console.log('No users or feature requests available for creating votes')
    return []
  }

  console.log(
    `Generating feature votes with ${userIds.length} users and ${featureRequestIds.length} feature requests`,
  )

  try {
    // First, get existing user-feature pairs to avoid duplicates
    const existingPairs = new Set<string>()
    try {
      const { rows } = await pool.query('SELECT user_id, feature_id FROM feature_votes')
      rows.forEach((row) => {
        existingPairs.add(`${row.user_id}-${row.feature_id}`)
      })
      console.log(`Found ${existingPairs.size} existing user-feature pairs`)
    } catch (err) {
      console.warn('Could not query existing feature votes')
    }

    // Check valid vote_type values - default to 1 (upvote) or -1 (downvote)
    const voteTypeValues = [1, -1]

    try {
      const { rows } = await pool.query(`
        SELECT pg_get_constraintdef(oid) as constraint_def
        FROM pg_constraint
        WHERE conrelid = 'feature_votes'::regclass
        AND contype = 'c'
      `)

      if (rows.length > 0) {
        // Parse constraint definitions to find vote_type check
        for (const row of rows) {
          const constraintDef = row.constraint_def
          if (constraintDef.includes('vote_type')) {
            console.log(`Vote type constraint: ${constraintDef}`)
            break
          }
        }
      }
    } catch (err) {
      console.warn('Could not determine vote_type constraints, using defaults [-1, 1]')
    }

    // Generate unique user-feature combinations that don't already exist in the database
    const votes = [] as {
      id: string
      user_id: string
      feature_id: string
      vote_type: number
      feedback?: string
      created_at: Date
      updated_at: Date
    }[]

    // Loop through each feature
    for (const featureId of featureRequestIds) {
      // For each feature, loop through a subset of users (to avoid too many attempts)
      const userSubset = faker.helpers.shuffle([...userIds]).slice(0, 10) // Use at most 10 users per feature

      for (const userId of userSubset) {
        // Skip if this pair already exists in database
        const pairKey = `${userId}-${featureId}`
        if (existingPairs.has(pairKey)) {
          continue
        }

        existingPairs.add(pairKey)

        votes.push({
          id: generateUUID(),
          user_id: userId,
          feature_id: featureId,
          vote_type: faker.helpers.arrayElement(voteTypeValues), // Only use valid values [-1, 1]
          feedback: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
          created_at: new Date(faker.date.past()),
          updated_at: new Date(faker.date.recent()),
        })
      }
    }

    console.log(`Generated ${votes.length} feature votes`)

    // Log a sample vote for debugging
    if (votes.length > 0) {
      console.log('Sample vote:', JSON.stringify(votes[0], null, 2))
    }

    await bulkInsert(pool, 'feature_votes', votes)
    return votes
  } catch (error: any) {
    console.error('Error in seedFeatureVotes:', error)
    throw error
  }
}
