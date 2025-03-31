// scripts/restore.js
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

try {
  const backupPath = process.env.PG_BACKUP_PATH || '/var/lib/postgresql/backups'
  const backupFile = process.env.BACKUP_FILE

  if (!backupFile) {
    console.error('No backup file specified. Set BACKUP_FILE environment variable.')
    process.exit(1)
  }

  const fullBackupPath = path.join(backupPath, backupFile)

  if (!fs.existsSync(fullBackupPath)) {
    console.error(`Backup file not found: ${fullBackupPath}`)
    process.exit(1)
  }

  const connectionString =
    process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres'

  // Parse connection string to extract credentials
  const url = new URL(connectionString)
  const host = url.hostname
  const port = url.port
  const database = url.pathname.substring(1)
  const user = url.username
  const password = url.password

  // Restore from backup
  const command = `PGPASSWORD=${password} pg_restore -h ${host} -p ${port} -U ${user} -d ${database} -c ${fullBackupPath}`
  execSync(command, { stdio: 'inherit' })

  console.log(`Restored from backup: ${backupFile}`)
} catch (error: any) {
  console.error('Restore failed:', error)
  process.exit(1)
}
