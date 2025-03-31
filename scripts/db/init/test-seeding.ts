import chalk from 'chalk'
import client from '../client'

async function getTableRowCounts(): Promise<{
  nonEmptyTables: { name: string; count: number }[]
  emptyTables: string[]
}> {
  try {
    // Get all tables in the public schema
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `
    const { rows: tables } = await client.query(tablesQuery)

    console.log(chalk.blue(`\n📊 Checking row counts for ${tables.length} tables...\n`))

    // Track tables with zero rows
    const emptyTables: string[] = []
    const nonEmptyTables: { name: string; count: number }[] = []

    // Get row count for each table
    for (const table of tables) {
      const tableName = table.table_name
      // In PostgreSQL, we need double quotes for identifiers
      const countQuery = `SELECT COUNT(*) FROM ${tableName}`

      try {
        const { rows } = await client.query(countQuery)
        const count = parseInt(rows[0].count, 10)

        if (count === 0) {
          emptyTables.push(tableName)
        } else {
          nonEmptyTables.push({ name: tableName, count })
        }
      } catch (error: any) {
        console.error(chalk.red(`Error counting rows in table ${tableName}:`), error)
      }
    }

    // Display results
    console.log(chalk.green('✅ Tables with data:'))
    nonEmptyTables.sort((a, b) => b.count - a.count) // Sort by count descending
    nonEmptyTables.forEach(({ name, count }) => {
      console.log(chalk.green(`   ${name}: ${count} rows`))
    })

    console.log(chalk.yellow(`\n⚠️ Empty tables (${emptyTables.length}):`))
    emptyTables.sort()
    emptyTables.forEach((name) => {
      console.log(chalk.yellow(`   ${name}`))
    })

    return { nonEmptyTables, emptyTables }
  } catch (error: any) {
    console.error(chalk.red('Error getting table row counts:'), error)
    return { nonEmptyTables: [], emptyTables: [] }
  }
}

async function main(): Promise<void> {
  console.log(chalk.blue('🔍 Starting database seeding validation...'))

  try {
    const { nonEmptyTables, emptyTables } = await getTableRowCounts()

    // Calculate statistics
    const totalTables = nonEmptyTables.length + emptyTables.length
    const seedingRate = ((nonEmptyTables.length / totalTables) * 100).toFixed(2)

    console.log(chalk.blue(`\n📈 Seeding Statistics:`))
    console.log(chalk.blue(`   Total tables: ${totalTables}`))
    console.log(chalk.blue(`   Tables with data: ${nonEmptyTables.length} (${seedingRate}%)`))
    console.log(chalk.blue(`   Empty tables: ${emptyTables.length}`))

    // Check for tables that should have data but don't
    const expectedNonEmptyTables = [
      'countries',
      'cities',
      'content_types',
      'categories',
      'tags',
      'business_domains',
      'social_media',
    ]

    const missingData = expectedNonEmptyTables.filter((table) => emptyTables.includes(table))

    if (missingData.length > 0) {
      console.log(chalk.red('\n❌ Critical: The following tables should have data but are empty:'))
      missingData.forEach((table) => {
        console.log(chalk.red(`   ${table}`))
      })
    } else {
      console.log(chalk.green('\n✅ All critical tables have data!'))
    }

    console.log(chalk.blue('\n🔍 Seeding validation completed!'))
  } catch (error: any) {
    console.error(chalk.red('Error during seeding validation:'), error)
  } finally {
    await client.end()
  }
}

// Run the main function
main().catch((error) => {
  console.error(chalk.red('Unhandled error:'), error)
  process.exit(1)
})
