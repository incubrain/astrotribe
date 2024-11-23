import chalk from 'chalk'
import type { Pool } from 'pg'

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

// Helper to generate bulk insert SQL
export async function bulkInsert<T extends Record<string, any>>(
  pool: Pool,
  tableName: string,
  records: T[],
  columns?: string[],
): Promise<any> {
  if (!records.length) return

  // If columns aren't specified, use keys from first record
  const cols = columns || Object.keys(records[0])

  const values = records
    .map((record) => `(${cols.map((col) => formatValue(record[col])).join(',')})`)
    .join(',')

  const query = `
      INSERT INTO ${tableName} (${cols.join(',')})
      VALUES ${values}
      RETURNING *;
    `

  const client = await pool.connect()
  try {
    const result = await client.query(query)
    console.log(chalk.green(`✓ Inserted ${records.length} records into ${tableName}`))
    return result.rows
  } catch (error) {
    console.error(chalk.red(`Error inserting into ${tableName}:`), error)
    throw error
  } finally {
    client.release()
  }
}

// Helper to generate a UUID
export const generateUUID = () => crypto.randomUUID()
