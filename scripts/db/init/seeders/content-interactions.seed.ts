import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedContentInteractions(
  pool: Pool,
  contentIds: string[],
  userIds: string[],
  count: number = 200,
) {
  if (contentIds.length === 0 || userIds.length === 0) {
    console.warn('No content or users available to seed content_interactions')
    return []
  }

  const interactionTypes = [
    'view',
    'click',
    'share',
    'download',
    'save',
    'print',
    'copy',
    'search',
    'scroll_depth',
    'time_spent',
  ]

  const contentInteractions = Array.from({ length: count }, () => {
    const interactionType = faker.helpers.arrayElement(interactionTypes)
    const contentId = faker.helpers.arrayElement(contentIds)
    const userId = faker.helpers.arrayElement(userIds)
    const createdAt = faker.date.recent()

    // Generate different details based on interaction type
    let details

    switch (interactionType) {
      case 'view':
        details = {
          view_duration: faker.number.int({ min: 5, max: 600 }),
          view_percentage: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
          device: faker.helpers.arrayElement(['mobile', 'desktop', 'tablet']),
          referrer: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.7 }),
        }
        break
      case 'click':
        details = {
          element_type: faker.helpers.arrayElement(['button', 'link', 'image', 'card', 'tab']),
          element_id: `el_${faker.string.alphanumeric(8)}`,
          position: {
            x: faker.number.int({ min: 0, max: 1200 }),
            y: faker.number.int({ min: 0, max: 800 }),
          },
        }
        break
      case 'share':
        details = {
          platform: faker.helpers.arrayElement([
            'twitter',
            'facebook',
            'linkedin',
            'email',
            'copy',
          ]),
          success: faker.datatype.boolean(),
        }
        break
      case 'scroll_depth':
        details = {
          max_depth: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
          read_time: faker.number.int({ min: 10, max: 300 }),
        }
        break
      case 'time_spent':
        details = {
          seconds: faker.number.int({ min: 5, max: 1200 }),
          active_seconds: faker.number.int({ min: 5, max: 600 }),
          completed: faker.datatype.boolean(),
        }
        break
      default:
        details = {
          timestamp: createdAt.toISOString(),
          success: faker.datatype.boolean(),
        }
    }

    return {
      id: generateUUID(),
      content_id: contentId,
      user_id: userId,
      interaction_type: interactionType,
      created_at: createdAt,
      details: details,
    }
  })

  await bulkInsert(pool, 'content_interactions', contentInteractions)
  return contentInteractions
}
