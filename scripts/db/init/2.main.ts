// scripts/db/init/1.main.ts

import chalk from 'chalk'
import client from '../client'
import { databaseConfig } from './1.config'
import { setAdminUser } from './create-admin'
import { enableRLSOnAllTables } from './enable-rls'
import { updateDatabasePermissions } from './upsert-permissions'
import { runSeeders } from './run-seeders'

async function main() {
  console.log(chalk.blue('🚀 Starting database initialization...'))

  try {
    // 1. Run seeders
    if (databaseConfig.steps.runSeeders) {
      console.log(chalk.blue('\n📦 Seeding database...'))
      const seedResult = await runSeeders()
      if (!seedResult) {
        throw new Error('Database seeding failed')
      }
      console.log(chalk.green('✓ Database seeding completed'))
    }

    // 2. Set up admin users
    if (databaseConfig.steps.setAdminUsers) {
      console.log(chalk.blue('\n👤 Setting up admin users...'))
      await setAdminUser(client, databaseConfig.admins)
      console.log(chalk.green('✓ Admin users configured'))
    }

    // 3. Enable RLS
    if (databaseConfig.steps.enableRLS) {
      console.log(chalk.blue('\n🔒 Enabling Row Level Security...'))
      const rlsEnabled = await enableRLSOnAllTables(client)
      if (!rlsEnabled) {
        throw new Error('Failed to enable RLS')
      }
      console.log(chalk.green('✓ RLS enabled'))
    }

    // 4. Update permissions
    if (databaseConfig.steps.updatePermissions) {
      console.log(chalk.blue('\n🔑 Updating permissions...'))
      const permissionsUpdated = await updateDatabasePermissions(client, {})
      if (!permissionsUpdated) {
        throw new Error('Failed to update permissions')
      }
      console.log(chalk.green('✓ Permissions updated'))
    }

    console.log(chalk.green('\n✨ Database initialization completed successfully'))
    process.exit(0)
  } catch (error) {
    console.error(chalk.red('\n❌ Error during database initialization:'), error)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
