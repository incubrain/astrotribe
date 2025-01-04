import { faker } from '@faker-js/faker'
import chalk from 'chalk'
import type { Pool } from 'pg'

const DEFAULT_SCHEMA = 'public'

// Helper to safely format SQL values
export function formatValue(value: any): string {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'boolean') return value.toString()
  if (typeof value === 'number') return value.toString()
  if (value instanceof Date) return `'${value.toISOString()}'`
  // Handle arrays specifically for PostgreSQL
  if (Array.isArray(value)) {
    // Convert array to PostgreSQL array format: ARRAY['value1', 'value2', 'value3']
    const formattedValues = value
      .map((item) => {
        if (typeof item === 'string') {
          // Escape single quotes in strings
          return `'${item.replace(/'/g, "''")}'`
        }
        return item
      })
      .join(',')
    return `ARRAY[${formattedValues}]`
  }
  if (typeof value === 'object') return `'${JSON.stringify(value)}'`
  return `'${value.toString().replace(/'/g, "''")}'`
}

export function generateUniqueValue<T>(
  generator: () => T,
  existingValues: Set<T>,
  maxAttempts = 100,
): T {
  let attempts = 0
  let value: T

  do {
    value = generator()
    attempts++

    if (attempts >= maxAttempts) {
      throw new Error(`Failed to generate unique value after ${maxAttempts} attempts`)
    }
  } while (existingValues.has(value))

  existingValues.add(value)
  return value
}

// Helper to generate a integer ID within a range
export function generateUniqueId(min: number, max: number, existingIds: Set<number>): number {
  return generateUniqueValue(() => faker.number.int({ min, max }), existingIds)
}

// Helper to generate unique URL
export function generateUniqueUrl(existingUrls: Set<string>, prefix = '', suffix = ''): string {
  return generateUniqueValue(() => {
    const uniquePart = `${faker.internet.domainWord()}-${faker.internet.domainWord()}-${faker.number.int({ min: 1000, max: 9999 })}`
    return `${prefix}${uniquePart}${suffix}`
  }, existingUrls)
}

// Helper to generate bulk insert SQL
export async function bulkInsert<T extends Record<string, any>>(
  pool: Pool,
  tableName: string,
  records: T[],
  columns?: string[],
  schema: string = DEFAULT_SCHEMA,
): Promise<any> {
  if (!records.length) return

  // If columns aren't specified, use keys from first record
  const cols = columns || Object.keys(records[0])

  const values = records
    .map((record) => `(${cols.map((col) => formatValue(record[col])).join(',')})`)
    .join(',')

  const query = `
    INSERT INTO ${schema}.${tableName} (${cols.join(',')})
      VALUES ${values}
      RETURNING *;
    `

  const client = await pool.connect()
  try {
    const result = await client.query(query)
    console.log(chalk.green(`✓ Inserted ${records.length} records into ${tableName}`))
    return result.rows
  } catch (error: any) {
    console.error(chalk.red(`Error inserting into ${tableName}:`), error)
    throw error
  } finally {
    client.release()
  }
}

// Simple helper to check and seed data
export async function checkAndSeed<T>(
  pool: Pool,
  tableName: string,
  seederFn: () => Promise<T[]>,
): Promise<T[]> {
  try {
    // Check if table has data
    const {
      rows: [{ count }],
    } = await pool.query(`SELECT COUNT(*) FROM ${tableName}`)

    if (Number(count) > 0) {
      console.log(chalk.blue(`Using existing data in ${tableName}`))
      const { rows } = await pool.query(`SELECT * FROM ${tableName}`)
      return rows
    }

    // If no data exists, run the seeder
    console.log(chalk.blue(`Seeding ${tableName}...`))
    const result = await seederFn()
    console.log(chalk.green(`✓ Successfully seeded ${tableName}`))
    return result
  } catch (error: any) {
    console.error(chalk.red(`Error while seeding ${tableName}:`), error)
    throw error
  }
}

// Helper to generate a UUID
export const generateUUID = () => crypto.randomUUID()
