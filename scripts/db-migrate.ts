// scripts/dbMigrate.ts
import { exec } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'

const migrationName = process.argv[2]

if (!migrationName) {
  console.error('Usage: npm run db:migrate <migration_name>')
  process.exit(1)
}

const migrationsDir = path.resolve('supabase/migrations')
const __dirname = path.resolve()
const fixMigrationScript = path.resolve(__dirname, 'fix-migration.ts')

console.log(`\nStarting migration: ${migrationName}\n`)

function runCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}\n`)
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error:\n${stderr}`)
        reject(error)
      } else {
        console.log(`Output:\n${stdout}`)
        resolve()
      }
    })
  })
}

function findLatestMigrationFile(migrationName: string): string | null {
  const files = fs.readdirSync(migrationsDir)
  const matchingFiles = files
    .filter((file) => file.endsWith(`_${migrationName}.sql`))
    .map((file) => ({
      name: file,
      time: fs.statSync(path.join(migrationsDir, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time)

  if (matchingFiles.length === 0) {
    return null
  }

  return path.join(migrationsDir, matchingFiles[0].name)
}

async function runMigration() {
  try {
    // Step 1: Generate the migration
    await runCommand(`supabase db diff -f "${migrationName}"`)

    // Step 2: Find the generated migration file
    const migrationFilePath = findLatestMigrationFile(migrationName)

    if (!migrationFilePath) {
      throw new Error(`Migration file for "${migrationName}" not found.`)
    }

    console.log(`Migration file found: ${migrationFilePath}\n`)

    // Step 3: Fix the migration file
    await runCommand(`npx ts-node "${fixMigrationScript}" "${migrationFilePath}"`)

    // Step 4: Reset the database
    await runCommand('supabase db reset')

    console.log(`\nMigration "${migrationName}" completed successfully.\n`)
  } catch (error) {
    console.error(`\nMigration "${migrationName}" failed.\n`)
    console.error(error)
    process.exit(1)
  }
}

runMigration()