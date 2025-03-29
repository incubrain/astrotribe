import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import {
  bulkInsert,
  generateUUID,
  generateUniqueId,
  generateUniqueUrl,
  generateUniqueValue,
} from './seed-helpers'
import {
  ERROR_MESSAGES,
  ERROR_TYPES,
  SERVICE_NAMES,
  SEVERITIES,
  COMMON_ERRORS,
  generateStackTrace,
} from './errors'

export const formatTimeWithZone = (date: Date) => {
  return (
    date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
    }) + '+00'
  )
}

export const getContentStatusFlow = (entityType: string) => {
  const commonStatuses = [
    'draft',
    'pending_agent_review',
    'pending_human_review',
    'published',
    'archived',
  ] as const

  // Add entity-specific statuses
  switch (entityType) {
    case 'news':
      return [...commonStatuses, 'pending_relevance_check', 'scraped', 'outdated', 'updated']
    case 'research':
      return [...commonStatuses, 'pending_crawl', 'irrelevant']
    default:
      return commonStatuses
  }
}

export const randomEnum = <T extends string>(values: readonly T[]): T => {
  return faker.helpers.arrayElement(values as T[])
}

export const createContentStatuses = async (
  pool: Pool,
  contents: Array<{ id: string; content_status: string }>,
  entityType: string, // e.g., 'news', 'research', 'company'
) => {
  const statuses = contents.map((content) => ({
    id: generateUUID(),
    content_id: content.id,
    content_status: content.content_status,
    notes: `Initial ${entityType} status`,
    created_at: new Date(),
  }))

  await bulkInsert(pool, 'content_statuses', statuses)
  return statuses
}

export {
  bulkInsert,
  generateUUID,
  generateUniqueId,
  generateUniqueUrl,
  generateUniqueValue,
  ERROR_MESSAGES,
  ERROR_TYPES,
  SERVICE_NAMES,
  SEVERITIES,
  COMMON_ERRORS,
  generateStackTrace,
}
