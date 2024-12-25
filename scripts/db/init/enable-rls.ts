// enable-rls.ts
import chalk from 'chalk'
import type { Pool } from 'pg'

export async function enableRLSOnAllTables(pool: Pool): Promise<boolean> {
  try {
    const client = await pool.connect()
    try {
      await client.query('SELECT enable_rls_on_all_tables()')
      return true
    } catch (error: any) {
      console.error('Error enabling RLS on tables:', error)
      throw error
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error(chalk.red('Error updating RLS policies:'), error)
    return false
  }
}
