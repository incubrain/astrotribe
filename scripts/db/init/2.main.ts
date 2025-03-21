// scripts/db/init/1.main.ts

import chalk from 'chalk'
import permissionsConfig from '../generated/role-permissions.json'
import client from '../client'
import { generatePermissions } from '../update/generate-permissions'
import { databaseConfig } from './1.config'
import { setAdminUser } from './create-admin'
import { updateDatabasePermissions } from './upsert-permissions'
import { runSeeders } from './seeders/run-seeders'
import { refreshDatabaseViews } from './refresh-views'

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
    }

    // 2. Set up admin users
    if (databaseConfig.steps.setAdminUsers) {
      console.log(chalk.blue('\n👤 Setting up admin users...'))
      await setAdminUser(client, databaseConfig.admins)
    }

    // 3. Generate Permissions
    if (databaseConfig.steps.generatePermissions) {
      console.log(chalk.blue('\n🔑 Generating new permissions configuration...'))
      await generatePermissions()
      console.log(chalk.green('✓ Permissions configuration generated'))
    }

    // 4. Update Database Permissions
    if (databaseConfig.steps.updatePermissions) {
      console.log(chalk.blue('\n🔑 Updating database permissions...'))
      const permissionsUpdated = await updateDatabasePermissions(client, permissionsConfig)
      if (!permissionsUpdated) {
        throw new Error('Failed to update permissions')
      }
      console.log(chalk.green('✓ Database permissions updated'))
    }

    // Refresh database views

    if (databaseConfig.steps.refreshViews) {
      // Add this to your config
      console.log(chalk.blue('\n🔄 Refreshing database views...'))
      const viewsRefreshed = await refreshDatabaseViews(client)
      if (!viewsRefreshed) {
        throw new Error('Failed to refresh views')
      }
      console.log(chalk.green('✓ Database views refreshed'))
    }

    console.log(chalk.green('\n✨ Database initialization completed successfully'))
    process.exit(0)
  } catch (error: any) {
    console.error(chalk.red('\n❌ Error during database initialization:'), error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
