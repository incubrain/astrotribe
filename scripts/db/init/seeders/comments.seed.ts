import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedComments(pool: Pool, userIds: string[], contentIds: string[]) {
  if (userIds.length === 0 || contentIds.length === 0) {
    console.warn('No users or content available for creating comments')
    return []
  }

  console.log(
    `Generating comments with ${userIds.length} users and ${contentIds.length} content items`,
  )

  try {
    // Generate main comments
    const comments = contentIds.flatMap((contentId) =>
      Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
        id: generateUUID(),
        comment_text: faker.lorem.paragraph(),
        user_id: faker.helpers.arrayElement(userIds),
        content_id: contentId,
        parent_comment_id: null,
        created_at: new Date(faker.date.past()),
        updated_at: new Date(faker.date.recent()),
        deleted_at: null,
        is_active: true,
      })),
    )

    console.log(`Generated ${comments.length} main comments`)

    // Add some nested comments (replies) - about 20% of comments will be replies
    const parentComments = comments.slice(0, Math.floor(comments.length * 0.8))
    const nestedComments = Array.from({ length: Math.floor(comments.length * 0.2) }, () => ({
      id: generateUUID(),
      comment_text: faker.lorem.paragraph(),
      user_id: faker.helpers.arrayElement(userIds),
      content_id: faker.helpers.arrayElement(contentIds),
      parent_comment_id: faker.helpers.arrayElement(parentComments).id,
      created_at: new Date(faker.date.recent()),
      updated_at: new Date(faker.date.recent()),
      deleted_at: null,
      is_active: true,
    }))

    console.log(`Generated ${nestedComments.length} nested comments (replies)`)

    // Combine main comments and nested comments
    const allComments = [...comments, ...nestedComments]

    // Log a sample comment for debugging
    if (allComments.length > 0) {
      console.log('Sample comment:', JSON.stringify(allComments[0], null, 2))
    }

    await bulkInsert(pool, 'comments', allComments)
    return allComments
  } catch (error: any) {
    console.error('Error in seedComments:', error)
    throw error
  }
}
