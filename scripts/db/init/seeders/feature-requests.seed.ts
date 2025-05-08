import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedFeatureRequests(pool: Pool) {
  // First, let's query the database to find out what status values are allowed
  try {
    const { rows } = await pool.query(`
      SELECT
        pg_constraint.conname AS constraint_name,
        pg_get_constraintdef(pg_constraint.oid) AS constraint_definition
      FROM pg_constraint
      JOIN pg_class ON pg_constraint.conrelid = pg_class.oid
      JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
      WHERE pg_class.relname = 'feature_requests'
      AND pg_constraint.conname = 'status_check'
    `)

    console.log('Feature requests status constraint:', rows[0]?.constraint_definition)
  } catch (error: any) {
    console.error('Error querying status constraint:', error)
  }

  // Use only 'planned', 'in_progress', 'completed' as these are likely the allowed values
  // based on common patterns for status fields
  const requests = Array.from({ length: faker.number.int({ min: 10, max: 30 }) }, () => ({
    id: generateUUID(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(['planned', 'in_progress', 'completed']),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    upvotes: faker.number.int({ min: 0, max: 100 }),
    downvotes: faker.number.int({ min: 0, max: 20 }),
    engagement_score: faker.number.int({ min: 0, max: 1000 }),
    priority_score: faker.number.int({ min: 0, max: 1000 }),
  }))

  await bulkInsert(pool, 'feature_requests', requests)
  return requests
}
