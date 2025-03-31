import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { ContentStatus } from '../utils/types'

export async function seedJobs(pool: Pool, companyIds: string[] = [], count: number = 100) {
  // First, check if we have enough content entries
  let contentsIds: string[] = []
  try {
    const { rows } = await pool.query('SELECT id FROM contents WHERE content_type = $1 LIMIT $2', [
      'job',
      count,
    ])
    contentsIds = rows.map((row) => row.id)
  } catch (error: any) {
    console.error('Error fetching content IDs:', error)
  }

  // If we don't have enough content IDs, create them first
  if (contentsIds.length < count) {
    console.log(`Not enough contents for jobs. Found: ${contentsIds.length}, needed: ${count}`)
    console.log('Creating contents for jobs...')
    try {
      // Create content entries first
      const newContents = Array.from({ length: count - contentsIds.length }, () => ({
        id: generateUUID(),
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(3),
        content_type: 'job',
        url: faker.internet.url(),
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
      }))
      if (newContents.length > 0) {
        await bulkInsert(pool, 'contents', newContents)
        contentsIds = [...contentsIds, ...newContents.map((c) => c.id)]
        console.log(`Created ${newContents.length} new content entries`)
      }
    } catch (error: any) {
      console.error('Error creating content entries:', error)
    }
  }

  // If we still don't have enough content IDs, reduce the job count
  if (contentsIds.length < count) {
    console.log(`Still not enough contents. Reducing job count to ${contentsIds.length}`)
    count = contentsIds.length
  }

  // If we have no content IDs, we can't create jobs
  if (contentsIds.length === 0) {
    console.log('No contents available. Cannot create jobs.')
    return []
  }

  // Get content source IDs if available
  let contentSourceIds: string[] = []
  try {
    const { rows } = await pool.query('SELECT id FROM content_sources LIMIT 10')
    contentSourceIds = rows.map((row) => row.id)
  } catch (error: any) {
    console.log('No content sources found or error fetching them:', error)
  }

  // Create jobs data
  const jobs = Array.from({ length: count }, (_, index) => {
    const publishedAt = faker.date.past()
    const expiresAt = faker.date.future({ refDate: publishedAt })

    // Base job object
    const job: any = {
      id: generateUUID(),
      contents_id: contentsIds[index % contentsIds.length],
      title: faker.person.jobTitle(),
      location: faker.location.city(),
      description: faker.lorem.paragraphs(3),
      published_at: publishedAt,
      expires_at: expiresAt,
      scraped_at: faker.date.recent(),
      updated_at: faker.date.recent(),
      created_at: faker.date.past(),
      content_status: faker.helpers.arrayElement([
        'draft',
        'published',
        'archived',
      ]) as ContentStatus,
      url: faker.internet.url(),
      hash: faker.number.int({ min: 1000000000, max: 9999999999 }),
      metadata: JSON.stringify({
        salary: faker.helpers.maybe(() => ({
          min: faker.number.int({ min: 30000, max: 70000 }),
          max: faker.number.int({ min: 70001, max: 150000 }),
          currency: 'USD',
        })),
        remote: faker.datatype.boolean(),
        skills: faker.helpers.multiple(() => faker.person.jobArea(), { count: { min: 1, max: 5 } }),
      }),
      employment_type: faker.helpers.arrayElement([
        'full-time',
        'part-time',
        'contract',
        'temporary',
        'internship',
      ]),
    }

    // Add company_id if available
    if (companyIds.length > 0) {
      job.company_id = faker.helpers.arrayElement(companyIds)
    }

    // Add content_source_id if available
    if (contentSourceIds.length > 0) {
      job.content_source_id = faker.helpers.arrayElement(contentSourceIds)
    }

    return job
  })

  await bulkInsert(pool, 'jobs', jobs)
  return jobs
}
