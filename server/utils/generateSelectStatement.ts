// import { ZodSchema, ZodObject, ZodTypeAny, ZodEffects } from 'zod'
import type { TableKey } from './base.interface'

type AllowedValue = true
type AllowedFields = Record<string, AllowedValue | Record<string, AllowedValue>>
/**
 * Use this type for defining pick objects for SQL select generation.
 * - Ensure that no field goes beyond two levels of depth.
 * - Each field at any level must be a boolean set to true.
 */
export interface PickObject {
  [key: string]: AllowedFields | AllowedValue
}

const referenceTables: TableKey[] = [
  'categories',
  'roles',
  'categories',
  'embeddings',
  'news',
  'news_embeddings',
  'news_tags',
  'research',
  'tags',
  'user_followers',
  'user_profiles'
]

function formatNestedFields(fields: AllowedFields): string {
  return Object.entries(fields)
    .map(([key, value]) => {
      if (typeof value === 'object') {
        return `${key}(${formatNestedFields(value)})`
      } else if (referenceTables.includes(key as TableKey)) {
        return `${key}(*)`
      } else {
        return key // This case might never hit if all references are true or objects, adjust logic if needed.
      }
    })
    .join(', ')
}

/**
 * Generates a SQL SELECT statement from a structured object similar to Zod pick object.
 * Supports a hierarchical structure for complex queries.
 * @param {PickObject} pickObject - Data mapper for client-specific data, e.g., UserCard.
 * @returns {string} The generated SQL SELECT statement.
 */
export function generateSelectStatement(pickObject: PickObject): string {
  const fieldEntries = Object.entries(pickObject)

  const fields = fieldEntries.map(([key, value]) => {
    if (referenceTables.includes(key as TableKey)) {
      return `${key}(*)`
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      return formatNestedFields(value)
    } else {
      return key
    }
  })

  return fields.join(', ')
}
