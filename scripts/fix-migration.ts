// scripts/fix-migration.ts
import * as fs from 'fs'
import * as path from 'path'

interface Replacement {
  find: RegExp
  replace: string
}

// Get the migration file path from command-line arguments
const migrationFilePath = process.argv[2]

if (!migrationFilePath) {
  console.error('Usage: npx ts-node scripts/fix-migration.ts <migration_file.sql>')
  process.exit(1)
}

// List of replacements to perform
const replacements: Replacement[] = [
  {
    // Add 'public.' schema to unqualified function calls
    find: /EXECUTE FUNCTION (\w+\(.*?\))/g,
    replace: 'EXECUTE FUNCTION public.$1',
  },
  // Add more replacements as needed
]

const __dirname = path.dirname(migrationFilePath)
const backupDir = path.join(__dirname, '../migration_backups')

function ensureBackupDirExists() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir)
  }
}

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
  const content = fs.readFileSync(filePath, 'utf-8')
  let updatedContent = content

  replacements.forEach(({ find, replace }) => {
    updatedContent = updatedContent.replace(find, replace)
  })

  fs.writeFileSync(filePath, updatedContent, 'utf-8')
  console.log(`Migration file updated: ${filePath}`)
}

backupMigrationFile(migrationFilePath)
performReplacements(migrationFilePath)
