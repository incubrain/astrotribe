import fs from 'fs'
import chalk from 'chalk'
import type { Pool } from 'pg'
import pool from '../../client'

// List of jobs we've already extracted and handled
const handledJobs = [
  'SELECT public.execute_weekly_maintenance()',
  'SELECT public.gather_database_stats()',
  'SELECT public.cleanup_table_stats()',
  'SELECT public.perform_weekly_maintenance()',
  'SELECT public.sync_all_logs()',
  'SELECT sync_all_logs()',
]

// Helper to generate a job name from command
function generateJobName(command: string): string {
  return command
    .toLowerCase()
    .replace(/^select\s+public\./i, '')
    .replace(/\(\)$/, '')
    .replace(/[^a-z0-9_]/g, '_')
}

async function extractCronJobs(): Promise<string> {
  try {
    const result = await pool.query(
      `
      SELECT 
        jobid,
        schedule,
        command
      FROM 
        cron.job
      WHERE 
        command != ALL($1)
      ORDER BY
        jobid;
    `,
      [handledJobs],
    )

    if (result.rows.length === 0) {
      return ''
    }

    // Generate SQL statements to recreate the cron jobs
    const statements = result.rows.map((job) => {
      const schedule = job.schedule.replace(/'/g, "''")
      const command = job.command.replace(/'/g, "''")
      const jobName = generateJobName(command)

      return `
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM cron.job 
    WHERE command = '${command}'
  ) THEN
    PERFORM cron.schedule(
      '${jobName}',
      '${schedule}',
      '${command}'
    );
  END IF;
END $$;`.trim()
    })

    return statements.join('\n\n') + '\n'
  } catch (error: any) {
    console.error('Error extracting cron jobs:', error)
    throw error
  }
}

async function appendCronJobs(migrationFilePath: string) {
  console.log(chalk.cyan('📅 Extracting cron jobs'))

  try {
    const cronJobs = await extractCronJobs()

    if (cronJobs) {
      console.log(chalk.gray('Found new cron jobs, appending to migration...'))

      // Add a section header with explanation
      const cronSection = `
-- Cron Jobs
-- Note: Common maintenance jobs are handled in a separate migration
-- This section only includes additional custom jobs
${cronJobs}`

      // Append to the migration file
      fs.appendFileSync(migrationFilePath, cronSection)
      console.log(chalk.green('✓ New cron jobs added to migration'))
    } else {
      console.log(chalk.gray('No new cron jobs found to migrate'))
    }
  } catch (error: any) {
    console.error(chalk.yellow('⚠ Warning: Failed to extract cron jobs'))
    console.error(chalk.gray(error))
  }
}

// Export for testing
export { appendCronJobs, extractCronJobs, handledJobs, generateJobName }
