// scripts/update-rba-permissions.ts
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs/promises'
import dotenv from 'dotenv'
import chalk from 'chalk'
import { confirmAction } from '../scripts/helpers'
import { generatePermissions } from '../generators/generate-rba-permissions.js'
import { updateDatabasePermissions } from '../scripts/db/init/upsert-permissions'
import { enableRLSOnAllTables } from '../scripts/db/init/enable-rls'
import { updateRLSPolicies } from '../scripts/db/init/create-rls-policies'

import client from '../scripts/db/client'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  console.log(chalk.blue('Starting RBA permissions update process...\n'))

  try {
    // Read the generated file
    const configPath = path.join(__dirname, '../generated/role-permissions.json')
    const config = JSON.parse(await fs.readFile(configPath, 'utf-8'))
    await generatePermissions()
    console.log(chalk.green('✓ New permissions configuration generated\n'))

    // Step 2: Update database permissions
    console.log(chalk.blue('Step 2: Database permissions update'))
    if (await confirmAction('Would you like to update the database permissions?')) {
      const success = await updateDatabasePermissions(client, config)
      if (!success) {
        console.log(chalk.red('Database permissions update failed. Stopping process.'))
        process.exit(1)
      }
    } else {
      console.log(chalk.yellow('Skipping database permissions update\n'))
    }

    // Step 3: Enable RLS on all tables
    console.log(chalk.blue('Step 3: Enabling RLS on all tables'))
    if (await confirmAction('Would you like to enable RLS on all tables?')) {
      const success = await enableRLSOnAllTables(client)
      if (!success) {
        console.log(chalk.red('Error enabling RLS on tables. Stopping process.'))
        process.exit(1)
      }
    } else {
      console.log(chalk.yellow('Skipping RLS enablement on all tables\n'))
    }

    // Step 4: Update RLS policies
    console.log(chalk.blue('\nStep 4: RLS policies update'))
    if (await confirmAction('Would you like to update the RLS policies?')) {
      const success = await updateRLSPolicies(client)
      if (!success) {
        console.log(chalk.red('RLS policies update failed.'))
        process.exit(1)
      }
    } else {
      console.log(chalk.yellow('Skipping RLS policies update'))
    }

    console.log(chalk.green('\n✓ RBA permissions update process completed successfully!'))
  } catch (error) {
    console.error(chalk.red('\nError during RBA permissions update:'), error)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main as updateRBAPermissions }
