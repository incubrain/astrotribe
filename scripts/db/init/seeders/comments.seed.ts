import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedComments(pool: Pool, userIds: string[], contentIds: string[]) {
  if (userIds.length === 0 || contentIds.length === 0) {
    console.warn('No users or content available for creating comments')
    return []
  }

  const comments = contentIds.flatMap((contentId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      id: generateUUID(),
      comment_text: faker.lorem.paragraph(), // Changed from 'content' to 'comment_text' based on schema
      user_id: faker.helpers.arrayElement(userIds),
      content_id: contentId,
      parent_comment_id: null, // Most comments don't have a parent
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
      deleted_at: null,
      is_active: true,
    })),
  )

  // Add some nested comments (replies) - about 20% of comments will be replies
  const parentComments = comments.slice(0, Math.floor(comments.length * 0.8))
  const nestedComments = Array.from({ length: Math.floor(comments.length * 0.2) }, () => ({
    id: generateUUID(),
    comment_text: faker.lorem.paragraph(),
    user_id: faker.helpers.arrayElement(userIds),
    content_id: faker.helpers.arrayElement(contentIds),
    parent_comment_id: faker.helpers.arrayElement(parentComments).id,
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    deleted_at: null,
    is_active: true,
  }))

  const allComments = [...comments, ...nestedComments]

  await bulkInsert(pool, 'comments', allComments)
  return allComments
}
