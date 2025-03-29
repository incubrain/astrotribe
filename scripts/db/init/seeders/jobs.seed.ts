import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUniqueUrl } from '../utils'

const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP'] as const
const REMOTE_TYPES = ['REMOTE', 'HYBRID', 'ON_SITE'] as const
const EXPERIENCE_LEVELS = ['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE'] as const

// Helper to generate random salary
function generateSalary() {
  return faker.number.int({ min: 30000, max: 150000 })
}

// Helper to generate benefits
function generateBenefits() {
  const benefits = [
    'Health Insurance',
    'Dental Insurance',
    'Vision Insurance',
    'Life Insurance',
    '401k',
    'Remote Work',
    'Flexible Hours',
    'Paid Time Off',
    'Professional Development',
    'Gym Membership',
    'Stock Options',
    'Performance Bonus',
  ]
  return faker.helpers.arrayElements(benefits, { min: 3, max: 6 })
}

// Helper to generate skills based on job type
function generateSkills(jobTitle: string) {
  const commonSkills = ['Communication', 'Problem Solving', 'Time Management']

  const techSkills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS']
  const designSkills = ['Figma', 'Adobe XD', 'UI/UX', 'User Research', 'Prototyping']
  const marketingSkills = [
    'SEO',
    'Content Marketing',
    'Social Media',
    'Analytics',
    'Email Marketing',
  ]

  let roleSpecificSkills = [] as string[]
  if (jobTitle.toLowerCase().includes('developer') || jobTitle.toLowerCase().includes('engineer')) {
    roleSpecificSkills = techSkills
  } else if (jobTitle.toLowerCase().includes('designer')) {
    roleSpecificSkills = designSkills
  } else if (jobTitle.toLowerCase().includes('marketing')) {
    roleSpecificSkills = marketingSkills
  }

  return [
    ...faker.helpers.arrayElements(commonSkills, 2),
    ...faker.helpers.arrayElements(roleSpecificSkills, { min: 2, max: 4 }),
  ]
}

export async function seedJobs(
  pool: Pool,
  contentsIds: string[],
  companyIds: string[],
  contentSourceIds: string[],
  count = 50,
) {
  const usedUrls = new Set<string>()

  if (contentsIds.length < count) {
    throw new Error(`Not enough contents to create ${count} jobs. Found: ${contentsIds.length}`)
  }

  // Ensure we pick unique contents_id values
  const jobContents = faker.helpers.shuffle(contentsIds).slice(0, count)

  const jobs = jobContents.map((contentID) => {
    const title = faker.person.jobTitle()
    const url = generateUniqueUrl(usedUrls, 'https://careers.', '.com/jobs/')
    const publishedAt = faker.date.past()
    const expiresAt = faker.date.future({ refDate: publishedAt })

    return {
      id: crypto.randomUUID(),
      contents_id: contentID, // ✅ Ensures each job has a unique contents_id
      title,
      company_id: faker.helpers.arrayElement(companyIds),
      location: faker.location.city() + ', ' + faker.location.country(),
      description: faker.lorem.paragraphs(3),
      published_at: publishedAt,
      expires_at: expiresAt,
      scraped_at: new Date(),
      updated_at: new Date(),
      created_at: new Date(),
      content_status: 'published',
      content_source_id: faker.helpers.arrayElement(contentSourceIds),
      url,
      hash: BigInt(faker.number.int({ min: 1000000, max: 9999999 })),
      employment_details: {
        salary: generateSalary(),
        employment_type: faker.helpers.arrayElement(EMPLOYMENT_TYPES),
        remote_type: faker.helpers.arrayElement(REMOTE_TYPES),
      },
      metadata: {
        benefits: generateBenefits(),
        skills: generateSkills(title),
        experience_level: faker.helpers.arrayElement(EXPERIENCE_LEVELS),
      },
    }
  })

  await bulkInsert(pool, 'jobs', jobs)

  // Create corresponding content statuses
  const contentStatuses = jobs.map((job) => ({
    content_id: job.contents_id,
    content_status: 'published',
    created_at: new Date(),
    notes: 'Job was published',
  }))

  await bulkInsert(pool, 'content_statuses', contentStatuses)

  return jobs
}
