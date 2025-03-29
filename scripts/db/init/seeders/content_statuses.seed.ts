import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { ContentStatus } from '../utils/types.js'

export async function seedContentStatuses(pool: Pool, contentIds: string[]) {
  const statuses = contentIds.map((contentId) => ({
    id: generateUUID(),
    content_id: contentId,
    content_status: 'draft' as ContentStatus,
    notes: 'Initial content status',
    created_at: new Date(),
  }))

  await bulkInsert(pool, 'content_statuses', statuses)
  return statuses
}
