// scripts/fix-migration.ts

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import type { Pool } from 'pg'
import pool from '../client'
import { SchemaAnalyzer } from '../schema-analyzer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface Replacement {
  find: RegExp
  replace: string
  description: string
  category?: string
}

function generateReplacementPatterns(objNames: string[]): Replacement[] {
  return objNames.map((name) => ({
    find: new RegExp(`(?<!public\\.)(?<!\\.)(?<!public\\.)(${name})(?!\\.)`, 'g'),
    replace: `public.${name}`,
    description: `Add schema to ${name}`,
    category: 'schema_prefix',
  }))
}

async function generateReplacements(pool: Pool): Promise<Replacement[]> {
  const analyzer = new SchemaAnalyzer(pool)
  const schema = await analyzer.analyzeDatabase({
    includeTables: true,
    includeEnums: true,
    includeFunctions: true,
    includeTriggers: true,
  })

  // Collect all object names
  const objectNames = new Set<string>()

  // Add table names
  schema.forEach((s) => objectNames.add(s.name))

  // Add enum names
  schema.forEach((s) => s.enums?.forEach((e) => objectNames.add(e.name)))

  // Add function names
  schema.forEach((s) => s.functions?.forEach((f) => objectNames.add(f.name)))

  // Add trigger names
  schema.forEach((s) => s.triggers?.forEach((t) => objectNames.add(t.name)))

  // Generate patterns for all objects
  const dynamicReplacements = generateReplacementPatterns(Array.from(objectNames))

  // Add static patterns that shouldn't use the generic pattern
  const staticReplacements: Replacement[] = [
    {
      find: /nextval\('(?!public\.)(\w+_id_seq)'/g,
      replace: "nextval('public.$1'",
      description: 'Sequence references',
      category: 'sequences',
    },
    {
      find: /EXECUTE\s+FUNCTION\s+(?!public\.)(\w+\()/g,
      replace: 'EXECUTE FUNCTION public.$1',
      description: 'Function execution',
      category: 'functions',
    },
  ]

  return [...dynamicReplacements, ...staticReplacements]
}

function ensureBackupDirExists(backupDir: string) {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }
}

function backupMigrationFile(filePath: string) {
  const backupDir = path.join(path.dirname(filePath), 'migration_backups')
  ensureBackupDirExists(backupDir)

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

async function performReplacements(filePath: string, replacements: Replacement[]) {
  let content = fs.readFileSync(filePath, 'utf-8')
  let changesMade = false
  const changes: { pattern: string; matches: string[] }[] = []

  for (const { find, replace, description, category } of replacements) {
    const matches = content.match(find)
    if (matches) {
      changes.push({
        pattern: find.toString(),
        matches,
      })
      content = content.replace(find, replace)
      console.log(`Applied fix: ${description} (${matches.length} occurrences)`)
      changesMade = true
    }
  }

  if (changesMade) {
    // Save changes log
    const logDir = path.join(path.dirname(filePath), 'migration_logs')
    ensureBackupDirExists(logDir)

    const log = {
      timestamp: new Date().toISOString(),
      file: path.basename(filePath),
      changes,
    }

    const logPath = path.join(
      logDir,
      `changes_${path.basename(filePath, '.sql')}_${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
    )

    fs.writeFileSync(logPath, JSON.stringify(log, null, 2))
    fs.writeFileSync(filePath, content)

    console.log(`Migration file updated: ${filePath}`)
    console.log(`Changes log saved: ${logPath}`)
  } else {
    console.log('No changes were necessary')
  }
}

// Main execution
async function main() {
  const migrationFilePath = process.argv[2]

  if (!migrationFilePath) {
    console.error('Usage: npx ts-node scripts/fix-migration.ts <migration_file.sql>')
    process.exit(1)
  }

  try {
    const replacements = await generateReplacements(pool)

    backupMigrationFile(migrationFilePath)
    await performReplacements(migrationFilePath, replacements)

    await pool.end()
  } catch (error) {
    console.error('Error processing migration file:', error)
    process.exit(1)
  }
}

main()
