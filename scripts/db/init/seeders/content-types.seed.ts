import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert } from '../utils'

export async function seedContentTypes(pool: Pool) {
  // Define standard content types used in the application
  const contentTypes = [
    {
      type_name: 'article',
      config: {
        allowed_tags: ['p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'img', 'a'],
        max_length: 10000,
        requires_featured_image: true,
        supports_comments: true,
        excerpt_length: 160,
        supports_ratings: true,
        display_options: {
          show_author: true,
          show_date: true,
          show_reading_time: true,
        },
      },
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    {
      type_name: 'news',
      config: {
        allowed_tags: ['p', 'h1', 'h2', 'ul', 'ol', 'li', 'img', 'a'],
        max_length: 5000,
        requires_featured_image: true,
        supports_comments: true,
        excerpt_length: 120,
        supports_ratings: false,
        display_options: {
          show_author: true,
          show_date: true,
          show_source: true,
        },
      },
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    {
      type_name: 'research',
      config: {
        allowed_tags: [
          'p',
          'h1',
          'h2',
          'h3',
          'h4',
          'table',
          'tr',
          'td',
          'th',
          'ul',
          'ol',
          'li',
          'blockquote',
          'pre',
          'code',
          'img',
          'a',
        ],
        max_length: 50000,
        requires_featured_image: false,
        supports_comments: true,
        excerpt_length: 200,
        supports_ratings: true,
        display_options: {
          show_author: true,
          show_date: true,
          show_citations: true,
          show_doi: true,
        },
      },
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    {
      type_name: 'job',
      config: {
        allowed_tags: ['p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
        max_length: 3000,
        requires_featured_image: false,
        supports_comments: false,
        excerpt_length: 100,
        supports_ratings: false,
        metadata_fields: [
          'salary_range',
          'location',
          'employment_type',
          'experience_level',
          'application_url',
        ],
        display_options: {
          show_company: true,
          show_location: true,
          show_salary: true,
        },
      },
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    {
      type_name: 'event',
      config: {
        allowed_tags: ['p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'img', 'a'],
        max_length: 3000,
        requires_featured_image: true,
        supports_comments: true,
        excerpt_length: 140,
        supports_ratings: false,
        metadata_fields: [
          'start_date',
          'end_date',
          'location',
          'virtual_link',
          'registration_url',
          'cost',
          'organizer',
        ],
        display_options: {
          show_date: true,
          show_location: true,
          show_organizer: true,
        },
      },
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    {
      type_name: 'company',
      config: {
        allowed_tags: ['p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'img', 'a'],
        max_length: 5000,
        requires_featured_image: true,
        supports_comments: false,
        excerpt_length: 150,
        supports_ratings: true,
        metadata_fields: [
          'founded_year',
          'headquarters',
          'industry',
          'company_size',
          'funding',
          'website',
          'social_links',
        ],
        display_options: {
          show_logo: true,
          show_jobs: true,
          show_news: true,
        },
      },
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    {
      type_name: 'newsletter',
      config: {
        allowed_tags: ['p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'img', 'a', 'blockquote'],
        max_length: 8000,
        requires_featured_image: false,
        supports_comments: false,
        excerpt_length: 150,
        supports_ratings: false,
        display_options: {
          show_issue_number: true,
          show_date: true,
          show_author: true,
        },
      },
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
  ]

  await bulkInsert(pool, 'content_types', contentTypes)
  return contentTypes
}
