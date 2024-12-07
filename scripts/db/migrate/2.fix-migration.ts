// scripts/fix-migration.ts

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

function ensureBackupDirExists() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir)
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface Replacement {
  find: RegExp
  replace: string
  description: string // For better logging and maintenance
}

const replacements: Replacement[] = [
  {
    // Add 'public.' schema to unqualified function calls
    find: /EXECUTE FUNCTION (\w+\(.*?\))/g,
    replace: 'EXECUTE FUNCTION public.$1',
    description: 'Function calls in triggers',
  },
  {
    // Add public schema to unqualified app_role_enum type usage
    find: /([^.])app_role_enum([^a-zA-Z])/g,
    replace: '$1public.app_role_enum$2',
    description: 'Unqualified app_role_enum types',
  },
  {
    // Fix references to sequence class
    find: /nextval\('(\w+)_id_seq'/g,
    replace: "nextval('public.$1_id_seq'",
    description: 'Sequence references',
  },
  {
    // Add public schema to authorize function calls in policies
    find: /\(\(([^.])authorize\(/g,
    replace: '((public.authorize(',
    description: 'Authorize function in policies',
  },
  {
    // Add public schema to table references in alter table statements
    find: /alter table "(\w+)" /gi,
    replace: 'alter table "public.$1" ',
    description: 'Table references in alter statements',
  },
  {
    // Add public schema to table references in create table statements
    find: /create table "(\w+)" /gi,
    replace: 'create table "public.$1" ',
    description: 'Table references in create statements',
  },
  {
    // Add public schema to FROM clause references
    find: /FROM (?!public\.)(\w+);/g,
    replace: 'FROM public.$1;',
    description: 'FROM clause table references',
  },
]

function backupMigrationFile(filePath: string) {
  ensureBackupDirExists()

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const fileName = path.basename(filePath)
  const backupFileName = `${fileName}.${timestamp}.bak`
  const backupFilePath = path.join(backupDir, backupFileName)

  fs.copyFileSync(filePath, backupFilePath)
  console.log(`Backup created: ${backupFilePath}`)

  // Clean up old backups (keep last 10)
  const backups = fs
    .readdirSync(backupDir)
    .filter((file) => file.startsWith(fileName))
    .map((file) => ({
      name: file,
      time: fs.statSync(path.join(backupDir, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time)

  if (backups.length > 10) {
    const oldBackups = backups.slice(10)
    for (const backup of oldBackups) {
      fs.unlinkSync(path.join(backupDir, backup.name))
      console.log(`Old backup removed: ${backup.name}`)
    }
  }
}

function performReplacements(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8')
  let changesMade = false

  replacements.forEach(({ find, replace, description }) => {
    const newContent = content.replace(find, replace)
    if (newContent !== content) {
      console.log(`Applied fix: ${description}`)
      changesMade = true
      content = newContent
    }
  })

  if (changesMade) {
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`Migration file updated: ${filePath}`)
  } else {
    console.log('No changes were necessary')
  }
}

// Main execution
const migrationFilePath = process.argv[2]

if (!migrationFilePath) {
  console.error('Usage: npx ts-node scripts/fix-migration.ts <migration_file.sql>')
  process.exit(1)
}

const backupDir = path.join(path.dirname(migrationFilePath), 'migration_backups')

try {
  backupMigrationFile(migrationFilePath)
  performReplacements(migrationFilePath)
} catch (error) {
  console.error('Error processing migration file:', error)
  process.exit(1)
}
