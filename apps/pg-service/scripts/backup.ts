// scripts/backup.js
import { execSync } from 'child_process'
import path from 'path'

try {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = process.env.PG_BACKUP_PATH || '/var/lib/postgresql/backups'
  const backupFile = path.join(backupPath, `backup-${timestamp}.sql`)

  const connectionString =
    process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres'

  // Parse connection string to extract credentials
  const url = new URL(connectionString)
  const host = url.hostname
  const port = url.port
  const database = url.pathname.substring(1)
  const user = url.username
  const password = url.password

  // Run pg_dump with connection details
  const command = `PGPASSWORD=${password} pg_dump -h ${host} -p ${port} -U ${user} -d ${database} -F c -f ${backupFile}`
  execSync(command)

  console.log(`Backup created: ${backupFile}`)
} catch (error: any) {
  console.error('Backup failed:', error)
  process.exit(1)
}
