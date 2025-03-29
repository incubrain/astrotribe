import chalk from 'chalk'
import type { Pool, QueryResult } from 'pg'
import { v4 as uuidv4 } from 'uuid'

interface SeedingError {
  table: string
  error: Error
  timestamp: Date
  details?: string
}

// Store seeding errors for reporting
const seedingErrors: SeedingError[] = []

/**
 * Generate a UUID
 */
export function generateUUID(): string {
  return uuidv4()
}

/**
 * Bulk insert records into a table
 * @param pool Database connection pool
 * @param tableName Table to insert into
 * @param records Records to insert
 * @param batchSize Number of records to insert in a single query
 */
export async function bulkInsert(
  pool: Pool,
  tableName: string,
  records: Record<string, any>[],
  batchSize = 100,
): Promise<void> {
  if (records.length === 0) {
    console.log(chalk.yellow(`No records to insert into ${tableName}`))
    return
  }

  try {
    // Process in batches to avoid query size limits
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      
      if (batch.length === 0) continue
      
      // Get column names from the first record
      const columns = Object.keys(batch[0])
      
      // Build the query
      const placeholders = batch.map((_record, recordIndex) => 
        `(${columns.map((_col, colIndex) => `$${recordIndex * columns.length + colIndex + 1}`).join(', ')})`,
      ).join(', ')
      
      const query = `
        INSERT INTO "${tableName}" (${columns.map((c) => `"${c}"`).join(', ')})
        VALUES ${placeholders}
      `
      
      // Flatten values for the query
      const values = batch.flatMap((record) => columns.map((col) => record[col]))
      
      await pool.query(query, values)
    }
    
    console.log(chalk.green(`✓ Inserted ${records.length} records into ${tableName}`))
  } catch (error: any) {
    console.error(chalk.red(`Error bulk inserting into ${tableName}:`), error.message)
    
    // Add detailed error information
    if (error.detail) {
      console.error(chalk.yellow('Detail:'), error.detail)
    }
    
    // Store the error for reporting
    seedingErrors.push({
      table: tableName,
      error,
      timestamp: new Date(),
      details: error.detail || error.hint || undefined,
    })
    
    throw error
  }
}

/**
 * Clear all seeding errors
 */
export function clearSeedingErrors(): void {
  seedingErrors.length = 0
}

/**
 * Get all seeding errors
 */
export function getSeedingErrors(): SeedingError[] {
  return seedingErrors
}

/**
 * Check if a table exists and has data, then seed it if needed
 * Enhanced with better error logging and dependency validation
 */
export async function checkAndSeed<T>(
  client: Pool,
  tableName: string,
  seeder: () => Promise<T[]>,
  options: {
    forceReseed?: boolean
    dependencies?: { table: string; minCount?: number }[]
    isCritical?: boolean
  } = {},
): Promise<T[]> {
  const { forceReseed = false, dependencies = [], isCritical = false } = options
  
  try {
    console.log(chalk.blue(`Checking table ${tableName}...`))
    
    // Check if dependencies are met
    for (const dep of dependencies) {
      const { table, minCount = 1 } = dep
      const { rows } = await client.query(`SELECT COUNT(*) FROM "${table}"`)
      const count = parseInt(rows[0].count)
      
      if (count < minCount) {
        const errorMsg = `Dependency check failed: Table "${table}" has ${count} rows, but at least ${minCount} are required.`
        console.error(chalk.red(errorMsg))
        
        seedingErrors.push({
          table: tableName,
          error: new Error(errorMsg),
          timestamp: new Date(),
          details: `Dependency failure: ${table} (${count}/${minCount})`,
        })
        
        return []
      }
    }
    
    // Check if table already has data
    const { rows } = await client.query(`SELECT COUNT(*) FROM "${tableName}"`)
    const count = parseInt(rows[0].count)
    
    if (count > 0 && !forceReseed) {
      console.log(chalk.green(`Table ${tableName} already has ${count} rows. Skipping.`))
      
      // Return existing data if needed
      const result = await client.query(`SELECT * FROM "${tableName}" LIMIT 1000`)
      return result.rows
    }
    
    // Seed the table
    console.log(chalk.yellow(`Seeding table ${tableName}...`))
    
    // Use a transaction for the seeding operation
    await client.query('BEGIN')
    
    const result = await seeder()
    
    await client.query('COMMIT')
    
    console.log(chalk.green(`✓ Successfully seeded ${result.length} rows into ${tableName}`))
    return result
  } catch (error: any) {
    // Roll back the transaction if it was started
    try {
      await client.query('ROLLBACK')
    } catch (rollbackError) {
      console.error(chalk.red(`Error rolling back transaction for ${tableName}:`), rollbackError)
    }
    
    // Log the error with detailed information
    console.error(chalk.red(`Error seeding table ${tableName}:`))
    console.error(chalk.red(error.message))
    
    if (error.detail) {
      console.error(chalk.yellow('Detail:'), error.detail)
    }
    
    if (error.hint) {
      console.error(chalk.yellow('Hint:'), error.hint)
    }
    
    if (error.stack) {
      console.error(chalk.gray('Stack trace:'), error.stack.split('\n').slice(0, 3).join('\n'))
    }
    
    // Store the error for reporting
    seedingErrors.push({
      table: tableName,
      error,
      timestamp: new Date(),
      details: error.detail || error.hint || undefined,
    })
    
    // If this is a critical table, rethrow the error to stop the seeding process
    if (isCritical) {
      throw new Error(`Critical table ${tableName} failed to seed: ${error.message}`)
    }
    
    return []
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
    const sortedTables = Object.entries(tableCounts)
      .sort(([, countA], [, countB]) => countB - countA)
    
    // Generate the report
    let report = '# Database Seeding Report\n\n'
    
    report += `## Summary\n`
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
