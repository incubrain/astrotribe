import chalk from 'chalk'
import type { Pool } from 'pg'

import pool from '../client'
import { enableRLSOnAllTables } from '../init/enable-rls'
import { updateDatabasePermissions } from '../init/upsert-permissions'
import { updateRLSPolicies } from '../init/create-rls-policies'
import { generatePermissions } from '../update/generate-permissions'
import permissionsConfig from '../generated/role-permissions.json'

async function checkAndAddTriggers(pool: Pool): Promise<void> {
  const client = await pool.connect()

  try {
    console.log(chalk.cyan('🔍 Checking for missing updated_at triggers...'))

    const result = await client.query('SELECT * FROM add_missing_updated_at_triggers()')

    let triggersAdded = false
    result.rows.forEach((row) => {
      if (row.action_taken === 'Added trigger') {
        console.log(chalk.yellow(`🔧 Added updated_at trigger to table: ${row.checked_table_name}`))
        triggersAdded = true
      }
    })

    if (!triggersAdded) {
      console.log(chalk.green('✓ All tables have required updated_at triggers\n'))
    } else {
      console.log(chalk.green('\n✓ Finished adding missing triggers\n'))
    }
  } finally {
    client.release()
  }
}

export async function preMigrationChecks(): Promise<void> {
  checkAndAddTriggers(pool)

  console.log(chalk.blue('\n🔑 Generating new permissions configuration...'))
  await generatePermissions()
  console.log(chalk.green('✓ Permissions configuration generated'))

  // 4. Update Database Permissions
  console.log(chalk.blue('\n🔑 Updating database permissions...'))
  const permissionsUpdated = await updateDatabasePermissions(pool, permissionsConfig)
  if (!permissionsUpdated) {
    throw new Error('Failed to update permissions')
  }
  console.log(chalk.green('✓ Database permissions updated'))

  console.log(chalk.blue('\n🔒 Enabling Row Level Security...'))
  const rlsEnabled = await enableRLSOnAllTables(pool)

  if (!rlsEnabled) {
    throw new Error('Failed to enable RLS')
  }
  console.log(chalk.green('✓ RLS enabled'))

  console.log(chalk.blue('\n🔒 Updating RLS policies...'))
  const policiesUpdated = await updateRLSPolicies(pool)

  if (!policiesUpdated) {
    throw new Error('Failed to update RLS policies')
  }
  console.log(chalk.green('✓ RLS policies updated'))
}
