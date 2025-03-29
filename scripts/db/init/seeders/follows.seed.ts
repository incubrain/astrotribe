import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { FollowedEntity } from '../utils/types'

export async function seedFollows(
  pool: Pool,
  userIds: string[] = [],
  companyIds: string[] = [],
  count: number = 100,
) {
  // If no users are provided, try to fetch from the database
  if (userIds.length === 0) {
    try {
      const { rows } = await pool.query('SELECT id FROM users LIMIT 100')
      if (rows.length > 0) {
        userIds = rows.map((row) => row.id)
      } else {
        console.log('No users found for follows')
        return []
      }
    } catch (error) {
      console.error('Error fetching users for follows:', error)
      return []
    }
  }

  // If no companies are provided, try to fetch from the database
  if (companyIds.length === 0) {
    try {
      const { rows } = await pool.query('SELECT id FROM companies LIMIT 100')
      if (rows.length > 0) {
        companyIds = rows.map((row) => row.id)
      } else {
        console.log('No companies found for follows')
        // We can still create user-follows-user relationships
      }
    } catch (error) {
      console.error('Error fetching companies for follows:', error)
      // We can still create user-follows-user relationships
    }
  }

  // Create a Set to track unique relationships and avoid duplicates
  const uniqueRelationships = new Set<string>()
  const follows: any[] = []

  // Generate user follows company relationships
  if (companyIds.length > 0) {
    const userFollowsCompanyCount = Math.min(count / 2, userIds.length * companyIds.length)
    let attempts = 0
    const maxAttempts = userFollowsCompanyCount * 3 // Allow multiple attempts to find unique combinations

    while (follows.length < userFollowsCompanyCount && attempts < maxAttempts) {
      attempts++
      const userId = faker.helpers.arrayElement(userIds)
      const companyId = faker.helpers.arrayElement(companyIds)
      
      // Create a unique key for this relationship
      const relationshipKey = `${userId}:${companyId}:company`
      
      // Only add if this relationship doesn't already exist
      if (!uniqueRelationships.has(relationshipKey)) {
        uniqueRelationships.add(relationshipKey)
        follows.push({
          id: generateUUID(),
          user_id: userId,
          followed_id: companyId,
          followed_entity: 'company' as FollowedEntity,
          created_at: faker.date.past(),
        })
      }
    }
  }

  // Generate user follows user relationships
  if (userIds.length > 1) {
    const userFollowsUserCount = Math.min(count / 2, userIds.length * (userIds.length - 1))
    let attempts = 0
    const maxAttempts = userFollowsUserCount * 3 // Allow multiple attempts to find unique combinations

    while (follows.length - (companyIds.length > 0 ? Math.min(count / 2, userIds.length * companyIds.length) : 0) < userFollowsUserCount && attempts < maxAttempts) {
      attempts++
      // Make sure a user doesn't follow themselves
      const followerId = faker.helpers.arrayElement(userIds)
      let followedId
      do {
        followedId = faker.helpers.arrayElement(userIds)
      } while (followedId === followerId)

      // Create a unique key for this relationship
      const relationshipKey = `${followerId}:${followedId}:user`
      
      // Only add if this relationship doesn't already exist
      if (!uniqueRelationships.has(relationshipKey)) {
        uniqueRelationships.add(relationshipKey)
        follows.push({
          id: generateUUID(),
          user_id: followerId,
          followed_id: followedId,
          followed_entity: 'user' as FollowedEntity,
          created_at: faker.date.past(),
        })
      }
    }
  }

  if (follows.length === 0) {
    console.log('No follows data could be generated')
    return []
  }

  // Check if there are already follows in the database to avoid duplicates
  try {
    const { rows } = await pool.query('SELECT user_id, followed_id, followed_entity FROM follows')
    
    // Filter out any follows that would violate the unique constraint
    const existingRelationships = new Set(
      rows.map((row) => `${row.user_id}:${row.followed_id}:${row.followed_entity}`)
    )
    
    const uniqueFollows = follows.filter((follow) => {
      const key = `${follow.user_id}:${follow.followed_id}:${follow.followed_entity}`
      return !existingRelationships.has(key)
    })
    
    if (uniqueFollows.length === 0) {
      console.log('All generated follows already exist in the database')
      return []
    }
    
    console.log(`Inserting ${uniqueFollows.length} unique follows (filtered out ${follows.length - uniqueFollows.length} duplicates)`)
    await bulkInsert(pool, 'follows', uniqueFollows)
    return uniqueFollows
  } catch (error) {
    console.error('Error checking existing follows:', error)
    // Proceed with caution, some might fail due to unique constraint
    await bulkInsert(pool, 'follows', follows)
    return follows
  }
}
