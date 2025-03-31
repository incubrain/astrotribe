import type { Pool } from 'pg'
import { faker } from '@faker-js/faker'
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
    // Generate a reasonable number of votes per feature request
    const votes = featureRequestIds.flatMap((requestId) =>
      Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => ({
        id: generateUUID(),
        user_id: faker.helpers.arrayElement(userIds),
        feature_id: requestId,
        vote_type: faker.number.int({ min: 0, max: 1 }),
        feedback: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
        created_at: new Date(faker.date.past()),
        updated_at: new Date(faker.date.recent()),
      })),
    )

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
