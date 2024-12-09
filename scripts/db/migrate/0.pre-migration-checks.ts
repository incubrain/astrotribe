import chalk from 'chalk'
import pool from '../client'

async function checkAndAddTriggers(): Promise<void> {
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

export function preMigrationChecks(): Promise<void> {
  return checkAndAddTriggers()
}
