import chalk from 'chalk'
import type { Pool } from 'pg'

export async function updateDatabasePermissions(pool: Pool, config: any) {
  try {
    const client = await pool.connect()
    try {
      console.log(chalk.blue('Upserting role permissions in database...'))

      // Convert config to string and escape single quotes for SQL
      const jsonConfig = JSON.stringify(config).replace(/'/g, "''")

      await client.query(`SELECT update_role_permissions('${jsonConfig}'::jsonb)`)
      console.log(chalk.green('✓ Role permissions updated successfully'))

      return true
    } finally {
      client.release()
    }
  } catch (error) {
    console.error(chalk.red('Error upserting role permissions:'), error)
    return false
  }
}
