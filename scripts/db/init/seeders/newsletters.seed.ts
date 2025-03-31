import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { ContentStatus } from '../utils/types.js'

export async function seedNewsletters(pool: Pool, contentIds: string[], companyIds: string[]) {
  if (contentIds.length === 0 || companyIds.length === 0) {
    console.warn('No content or companies available for creating newsletters')
    return []
  }

  console.log(
    `Generating newsletters with ${contentIds.length} content items and ${companyIds.length} companies`,
  )

  try {
    // Generate newsletters with proper frequencies and date ranges
    const frequencies = ['daily', 'weekly', 'monthly', 'quarterly']

    const newsletters = contentIds.map((contentId) => {
      const startDate = new Date(faker.date.past())
      const endDate = faker.helpers.maybe(() => new Date(faker.date.future()), { probability: 0.3 })

      return {
        id: generateUUID(),
        title: faker.lorem.sentence(),
        frequency: faker.helpers.arrayElement(frequencies),
        start_date: startDate,
        end_date: endDate,
        generated_content: faker.lorem.paragraphs(3),
        created_at: new Date(faker.date.past()),
        updated_at: new Date(faker.date.recent()),
        content_status: faker.helpers.arrayElement([
          'draft',
          'scheduled',
          'published',
          'archived',
        ] as ContentStatus[]),
      }
    })

    console.log(`Generated ${newsletters.length} newsletters`)

    // Log a sample newsletter for debugging
    if (newsletters.length > 0) {
      console.log('Sample newsletter:', JSON.stringify(newsletters[0], null, 2))
    }

    await bulkInsert(pool, 'newsletters', newsletters)
    return newsletters
  } catch (error: any) {
    console.error('Error in seedNewsletters:', error)
    throw error
  }
}
