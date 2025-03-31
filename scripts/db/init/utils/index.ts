import type { Pool } from 'pg'
import chalk from 'chalk'

export * from './helpers'
export * from './seed-helpers'
export * from '../utils/types.js'

// List of tables that should not be seeded as they are managed separately
export const PROTECTED_TABLES = [
  'user_profiles', // Managed by auth system
  'migrations', // Managed by migration system
  'schema_migrations', // Managed by migration system
  '_prisma_migrations', // Managed by Prisma
  'spatial_ref_sys', // PostGIS system table
  'geometry_columns', // PostGIS system table
  'geography_columns', // PostGIS system table
]

// Track seeding errors
const seedingErrors: Array<{ table: string; error: Error }> = []

export async function checkAndSeed<T>(
  pool: Pool,
  tableName: string,
  seedFn: () => Promise<T[]>,
): Promise<T[]> {
  try {
    if (PROTECTED_TABLES.includes(tableName)) {
      console.log(chalk.yellow(`Skipping protected table: ${tableName}`))
      return []
    }

    const { rows } = await pool.query(`SELECT COUNT(*) FROM ${tableName}`)
    if (parseInt(rows[0].count) > 0) {
      console.log(chalk.yellow(`Table ${tableName} already has data, skipping...`))
      return []
    }

    console.log(chalk.blue(`Seeding ${tableName}...`))
    const result = await seedFn()
    console.log(chalk.green(`✓ Seeded ${result.length} rows in ${tableName}`))
    return result
  } catch (error: any) {
    console.error(chalk.red(`Error seeding ${tableName}:`), error)
    seedingErrors.push({ table: tableName, error: error as Error })
    return []
  }
}

// Function to get all seeding errors
export function getSeedingErrors() {
  return seedingErrors
}

// Function to clear seeding errors
export function clearSeedingErrors() {
  seedingErrors.length = 0
}
