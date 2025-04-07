import * as fs from 'fs'
import { promises as fsPromise, constants } from 'fs'
import * as path from 'path'

interface Pattern {
  find: RegExp | string
  replace: string
  description: string
}

const patterns: Pattern[] = [
  {
    find: /\(authorize\(/g,
    replace: '(public.authorize(',
    description: 'Add public schema to authorize function calls',
  },
  {
    find: /CREATE FUNCTION ([^\s(]+)\(/g,
    replace: 'CREATE OR REPLACE FUNCTION $1(',
    description: 'Add OR REPLACE to function definitions',
  },
  {
    find: /DROP FUNCTION ([^;]+);/g,
    replace: 'DROP FUNCTION IF EXISTS $1;',
    description: 'Add IF EXISTS to function drops',
  },
]

function fixMigrationSQL(sql: string): string {
  const statements = sql
    .split(';')
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt)

  // Apply fix patterns to remaining statements
  const fixedStatements = statements.map((stmt) => {
    let fixed = stmt
    for (const pattern of patterns) {
      const matches = fixed.match(pattern.find)
      if (matches) {
        console.log(`Found ${matches.length} instances of: ${pattern.description}`)
        fixed = fixed.replace(pattern.find, pattern.replace)
      }
    }
    return fixed
  })

  // Rejoin with proper formatting
  return fixedStatements.join(';\n\n') + ';\n'
}

function createBackup(filePath: string): void {
  // Create migrations-backup directory in the same directory as the migration file
  const migrationDir = path.dirname(filePath)
  const backupDir = path.join(migrationDir, 'migration_backups')

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  // Create backup with timestamp
  const timestamp = new Date().toISOString().replace(/[:\.]/g, '-')
  const fileName = path.basename(filePath)
  const backupPath = path.join(backupDir, `${fileName}.${timestamp}.bak`)

  fs.copyFileSync(filePath, backupPath)
  console.log(`Backup created: ${backupPath}`)
}

async function main() {
  const migrationFilePath = process.argv[2]

  if (!migrationFilePath) {
    console.error('Usage: pnpx tsx fix-migration.ts <migration_file.sql>')
    process.exit(1)
  }

  try {
    const content = fs.readFileSync(migrationFilePath, 'utf-8')

    // Create backup in migrations-backup directory
    createBackup(migrationFilePath)

    // Fix and write the content
    const fixedContent = fixMigrationSQL(content)
    fs.writeFileSync(migrationFilePath, fixedContent)
    console.log(`Fixed migration written to: ${migrationFilePath}`)
  } catch (error: any) {
    console.error('Error processing migration file:', error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { fixMigrationSQL, patterns }
