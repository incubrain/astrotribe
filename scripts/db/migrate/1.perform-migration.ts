// scripts/dbMigrate.ts
import { exec } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import { preMigrationChecks } from './0.pre-migration-checks'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get project root by going up from scripts directory
const projectRoot = path.resolve(__dirname, '../../../')
const migrationsDir = path.join(projectRoot, 'supabase/migrations')
const fixMigrationScript = path.resolve(__dirname, '3.fix-migration.ts')

const migrationName = process.argv[2]

if (!migrationName) {
  console.error(chalk.red('✖ Error: Missing migration name'))
  console.error(chalk.yellow('\nUsage: npm run db:migrate <migration_name>\n'))
  process.exit(1)
}

console.log(chalk.blue('\n📦 Starting migration process'))
console.log(chalk.gray(`• Migration name: ${chalk.white(migrationName)}`))
console.log(chalk.gray(`• Migrations directory: ${chalk.white(migrationsDir)}\n`))

function runCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(chalk.cyan('⚡ Executing command:'))
    console.log(chalk.gray(`$ ${command}\n`))

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red('✖ Command failed:'))
        console.error(chalk.red(stderr))
        reject(error)
      } else {
        if (stdout.trim()) {
          console.log(chalk.gray(stdout))
        }
        console.log(chalk.green('✓ Command completed successfully\n'))
        resolve()
      }
    })
  })
}

function findLatestMigrationFile(migrationName: string): string | null {
  console.log(chalk.cyan(`🔍 Looking for migration file: ${migrationName}`))

  const files = fs.readdirSync(migrationsDir)
  const matchingFiles = files
    .filter((file) => file.endsWith(`_${migrationName}.sql`))
    .map((file) => ({
      name: file,
      time: fs.statSync(path.join(migrationsDir, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time)

  if (matchingFiles.length === 0) {
    console.log(chalk.yellow('⚠ No matching migration files found'))
    return null
  }

  const foundFile = path.join(migrationsDir, matchingFiles[0].name)
  console.log(chalk.green(`✓ Found migration file: ${chalk.white(foundFile)}\n`))
  return foundFile
}

async function runMigration() {
  try {
    // Step 0: Pre-migration checks
    console.log(chalk.blue('🔍 Step 0: Running pre-migration checks'))
    await preMigrationChecks()

    // Step 1: Generate the migration
    console.log(chalk.blue('📝 Step 1: Generating migration'))
    await runCommand(`supabase db diff -f "${migrationName}"`)

    // Step 2: Find the generated migration file
    console.log(chalk.blue('🔍 Step 2: Locating migration file'))
    const migrationFilePath = findLatestMigrationFile(migrationName)

    if (!migrationFilePath) {
      throw new Error(`Migration file for "${migrationName}" not found.`)
    }

    // Step 3: Fix the migration file
    console.log(chalk.blue('🔧 Step 3: Fixing migration file'))
    await runCommand(`npx tsx "${fixMigrationScript}" "${migrationFilePath}"`)

    // Step 4: Reset the database
    console.log(chalk.blue('🔄 Step 4: Resetting database'))
    await runCommand('supabase db reset')

    // Step 5: Setup the database
    console.log(chalk.blue('🚀 Step 5: Setting up database'))
    await runCommand('npm run db:setup')

    console.log(chalk.green(`\n✨ Migration "${migrationName}" completed successfully! ✨\n`))
  } catch (error) {
    console.error(chalk.red(`\n✖ Migration "${migrationName}" failed.\n`))
    console.error(chalk.red(error))
    process.exit(1)
  }
}

runMigration()
