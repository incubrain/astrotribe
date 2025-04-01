import type { Pool } from 'pg'
import { v4 as uuidv4 } from 'uuid'
import chalk from 'chalk'

// Store seeding errors
const seedingErrors: Array<{ table: string; error: Error; stack?: string }> = []

// Utility to generate UUIDs
export function generateUUID(): string {
  return uuidv4()
}

// Fix for BigInt serialization
BigInt.prototype.toJSON = function () {
  return this.toString()
}

// Utility to bulk insert data into a table
export async function bulkInsert(
  pool: Pool,
  table: string,
  data: any[],
  batchSize: number = 500,
): Promise<void> {
  if (data.length === 0) {
    return
  }

  try {
    // Process in batches to avoid overwhelming the database
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)

      // Extract column names from the first object
      const columns = Object.keys(batch[0])

      // Prepare placeholders for values and parameters array
      const placeholders = batch
        .map(
          (_, rowIndex) =>
            `(${columns.map((_, colIndex) => `$${rowIndex * columns.length + colIndex + 1}`).join(', ')})`,
        )
        .join(', ')

      // Flatten all values for the batch
      const values = batch.flatMap((obj) =>
        columns.map((col) => {
          // Special handling for JSON data
          if (obj[col] && typeof obj[col] === 'object' && !(obj[col] instanceof Date)) {
            return JSON.stringify(obj[col])
          }
          return obj[col]
        }),
      )

      // Construct the query
      const query = `
        INSERT INTO "${table}" (${columns.map((c) => `"${c}"`).join(', ')})
        VALUES ${placeholders}
      `

      // Execute the query
      await pool.query(query, values)
    }

    console.log(chalk.green(`✓ Inserted ${data.length} records into ${table}`))
  } catch (error: any) {
    console.error(chalk.red(`Error bulk inserting into ${table}:`), error.message)
    throw error
  }
}

// Check if a table needs seeding and seed it if necessary
export async function checkAndSeed(
  pool: Pool,
  tableName: string,
  seederFunction: () => Promise<any[]>,
): Promise<any[]> {
  console.log(chalk.blue(`Checking table ${tableName}...`))

  try {
    // Check if the table already has data
    const { rows } = await pool.query(`SELECT COUNT(*) as count FROM "${tableName}"`)
    const rowCount = parseInt(rows[0].count, 10)

    if (rowCount > 0) {
      console.log(chalk.blue(`Table ${tableName} already has ${rowCount} rows. Skipping.`))
      return []
    }

    console.log(chalk.blue(`Seeding table ${tableName}...`))

    // Call the seeder function
    const result = await seederFunction()

    console.log(chalk.green(`✓ Successfully seeded ${result.length} rows into ${tableName}`))
    return result
  } catch (error: any) {
    console.error(chalk.red(`Error seeding table ${tableName}:`))
    console.error(chalk.red(error.message))
    if (error.stack) {
      console.error(chalk.red(`Stack trace: ${error.stack}`))
    }

    // Record the error
    seedingErrors.push({
      table: tableName,
      error: new Error(error.message),
      stack: error.stack,
    })

    return []
  }
}

// Get seeding errors
export function getSeedingErrors(): Array<{ table: string; error: Error; stack?: string }> {
  return seedingErrors
}

// Clear seeding errors
export function clearSeedingErrors(): void {
  seedingErrors.length = 0
}

// Helper to check if a table exists
export async function tableExists(pool: Pool, tableName: string): Promise<boolean> {
  const query = `
    SELECT EXISTS (
      SELECT 1 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    ) AS exists
  `

  const { rows } = await pool.query(query, [tableName])
  return rows[0].exists
}

// Helper to get enum values
export async function getEnumValues(pool: Pool, enumType: string): Promise<string[]> {
  try {
    const query = `SELECT unnest(enum_range(NULL::${enumType})) AS enum_value`
    const { rows } = await pool.query(query)
    return rows.map((row) => row.enum_value)
  } catch (error) {
    console.warn(`Could not get enum values for ${enumType}:`)
    return []
  }
}

// Helper to check for existing record
export async function recordExists(
  pool: Pool,
  tableName: string,
  conditions: Record<string, any>,
): Promise<boolean> {
  if (Object.keys(conditions).length === 0) {
    return false
  }

  const whereClauses = Object.keys(conditions).map((key, index) => `"${key}" = $${index + 1}`)
  const query = `SELECT 1 FROM "${tableName}" WHERE ${whereClauses.join(' AND ')} LIMIT 1`

  try {
    const { rows } = await pool.query(query, Object.values(conditions))
    return rows.length > 0
  } catch (error) {
    console.warn(`Error checking if record exists in ${tableName}:`)
    return false
  }
}

/**
 * Generate a seeding report with statistics and errors
 */
export async function generateSeedingReport(client: Pool): Promise<string> {
  try {
    // Get all tables in the database
    const { rows: tables } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `)

    const tableNames = tables.map((t: any) => t.table_name)
    const totalTables = tableNames.length

    // Get row counts for each table
    const tableCounts: Record<string, number> = {}
    const emptyTables: string[] = []
    const nonEmptyTables: string[] = []

    for (const tableName of tableNames) {
      const { rows } = await client.query(`SELECT COUNT(*) FROM "${tableName}"`)
      const count = parseInt(rows[0].count)

      tableCounts[tableName] = count

      if (count === 0) {
        emptyTables.push(tableName)
      } else {
        nonEmptyTables.push(tableName)
      }
    }

    // Sort tables by row count (descending)
    const sortedTables = Object.entries(tableCounts).sort(
      ([, countA], [, countB]) => countB - countA,
    )

    // Generate the report
    let report = '# Database Seeding Report\n\n'

    report += '## Summary\n'
    report += `- Total Tables: ${totalTables}\n`
    report += `- Tables with Data: ${nonEmptyTables.length} (${((nonEmptyTables.length / totalTables) * 100).toFixed(2)}%)\n`
    report += `- Empty Tables: ${emptyTables.length}\n`

    if (seedingErrors.length > 0) {
      report += `- Tables with Errors: ${seedingErrors.length}\n`
    }

    report += '\n## Tables with Data (Row Counts)\n'
    sortedTables.forEach(([table, count], index) => {
      if (count > 0) {
        report += `${index + 1}. ${table}: ${count} rows\n`
      }
    })

    report += '\n## Empty Tables\n'
    emptyTables.sort().forEach((table, index) => {
      report += `${index + 1}. ${table}\n`
    })

    if (seedingErrors.length > 0) {
      report += '\n## Seeding Errors\n'
      seedingErrors.forEach((error, index) => {
        report += `### ${index + 1}. ${error.table}\n`
        report += `- Error: ${error.error.message}\n`
        if (error.details) {
          report += `- Details: ${error.details}\n`
        }
        report += `- Timestamp: ${error.timestamp.toISOString()}\n\n`
      })
    }

    return report
  } catch (error: any) {
    console.error(chalk.red('Error generating seeding report:'), error)
    return `# Database Seeding Report\n\nError generating report: ${error.message}`
  }
}
