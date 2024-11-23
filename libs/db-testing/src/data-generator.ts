// db-testing/src/data-generator.ts
import { faker } from '@faker-js/faker'
import { z } from 'zod'
import { TEST_USERS, REFERENCE_DATA, DEFAULT_TEST_IDS } from './constants'
import type { TestDataContext } from './types'
import { tables, type InboundTableSchema, type SchemaKey } from './schemas'

export function generateTestData<T extends SchemaKey>(
  table: T,
  context: Partial<any> = {},
  overrides: Partial<InboundTableSchema<T>> = {},
): InboundTableSchema<T> {
  // Provide default context
  const defaultContext: TestDataContext = {
    userId: TEST_USERS.NORMAL_USER.id,
    role: 'user',
    contentIds: DEFAULT_TEST_IDS.contents,
    categoryIds: [...DEFAULT_TEST_IDS.categories],
    tagIds: [...DEFAULT_TEST_IDS.tags],
  }

  const fullContext = { ...defaultContext, ...context }

  const baseData = generateBaseData(table, fullContext)
  const requiredFields = getRequiredFields(table, fullContext)
  const tableData = generateTableSpecificData(table, fullContext)

  return {
    ...baseData,
    ...requiredFields,
    ...tableData,
    ...overrides,
  } as InboundTableSchema<T>
}

function getRequiredFields(table: string, context: TestDataContext): Record<string, any> {
  const commonFields = {
    id: faker.string.uuid(),
    is_active: true,
    is_public: false,
  }

  switch (table) {
    case 'addresses':
      return {
        street1: faker.location.streetAddress(),
        country_id: REFERENCE_DATA.countries[0].id,
        city_id: REFERENCE_DATA.cities[0].id,
        address_type: 'home',
      }
    case 'comments':
      return {
        content: faker.lorem.paragraph(),
        content_type: 'news',
        content_id: context.contentIds.news,
      }
    case 'bookmarks':
      return {
        content_id: context.contentIds.news,
        content_type: 'news',
        metadata: {},
      }
    case 'votes':
      return {
        content_id: context.contentIds.news,
        content_type: 'news',
        vote_type: 1,
      }
    case 'user_followers':
      return {
        follower_id: context.userId,
        followed_id: TEST_USERS.MODERATOR.id,
      }
    case 'follows':
      return {
        follower_id: context.userId,
        followed_id: TEST_USERS.MODERATOR.id,
        followed_entity: 'user',
      }
    case 'feedbacks':
      return {
        message: faker.lorem.sentence(),
        page_identifier: 'test-page',
        feedback_type: 'bug',
        feedback_status: 'new',
      }
    case 'feed_categories':
      return {
        feed_id: faker.string.uuid(),
        category_id: context.categoryIds[0],
      }
    // Add other tables as needed
    default:
      return commonFields
  }
}

function generateBaseData(table: string, context: TestDataContext) {
  return {
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...(needsUserId(table) ? { user_id: context.userId } : {}),
  }
}

function generateTableSpecificData(table: string, context: TestDataContext): any {
  switch (table) {
    case 'user_profiles':
      return {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        role: context.role,
        plan: 'free',
      }
    case 'bookmarks':
      return {
        content_type: 'news',
        content_id: context.contentIds.news,
        metadata: {},
      }
    case 'follows':
      return {
        follower_id: context.userId,
        followed_id: TEST_USERS.NORMAL_USER.id,
        followed_entity: 'user',
      }
    // Add cases for other tables
    default:
      return {}
  }
}

function needsUserId(table: string): boolean {
  const userOwnedTables = [
    'addresses',
    'bookmarks',
    'comments',
    'feedbacks',
    'searches',
    'user_profiles',
    'votes',
  ]
  return userOwnedTables.includes(table)
}
