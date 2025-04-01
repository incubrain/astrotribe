// scripts/backup.ts
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { getSharedEnv } from '../../../shared/env'

const env = getSharedEnv().private

interface BackupOptions {
  connectionString?: string
  backupPath?: string
  format?: 'custom' | 'plain' | 'directory' | 'tar'
  compress?: boolean
  verbose?: boolean
  pgDumpPath?: string
  useDocker?: boolean
  dataOnly?: boolean
  schemaOnly?: boolean
  tables?: string[]
  excludeTables?: string[]
  exportFormat?: 'sql' | 'csv' | 'json' | 'inserts' | 'bulk-inserts' | 'copy'
  bulkInsertSize?: number
  debug?: boolean
}

/**
 * Create a PostgreSQL database backup
 * @param options Backup configuration options
 * @returns Path to the created backup file
 */
export async function createBackup(options: BackupOptions = {}): Promise<string> {
  try {
    const isDebug = options.debug === true
    function debugLog(...args: any[]) {
      if (isDebug) {
        console.log('🐞 [DEBUG]:', ...args)
      }
    }

    debugLog('Starting backup with options:', JSON.stringify(options, null, 2))

    // Get current directory for relative path resolution
    const __dirname = path.dirname(fileURLToPath(import.meta.url))

    // Generate timestamp for the backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

    // Determine backup path with proper defaults
    const defaultBackupPath = path.resolve(__dirname, '../backups')
    const backupPath = options.backupPath || env.PG_BACKUP_PATH || defaultBackupPath

    // Ensure backup directory exists
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true })
    }

    // *** IMPORTANT: Handle export format ***
    // Determine the effective format based on export format
    let effectiveFormat = options.format || 'custom' // Default to custom if not specified
    let exportFormatFlags = ''

    // If exportFormat is specified, it may need to override the output format
    if (options.exportFormat) {
      debugLog(`Export format specified: ${options.exportFormat}`)

      switch (options.exportFormat) {
        case 'csv':
          // CSV handled separately
          debugLog('CSV export will be handled separately')
          break
        case 'json':
          // JSON handled separately
          debugLog('JSON export will be handled separately')
          break
        case 'inserts':
          // Inserts require plain text format with --inserts flag
          effectiveFormat = 'plain'
          exportFormatFlags = '--inserts --column-inserts'
          debugLog('Using plain text format with INSERT statements')
          break
        case 'bulk-inserts':
          // We'll create the backup with plain format and inserts, then process afterward
          effectiveFormat = 'plain'
          exportFormatFlags = '--inserts --column-inserts'
          debugLog('Using plain text format for bulk INSERT processing')
          break
        case 'sql':
          // SQL is just plain text format
          effectiveFormat = 'plain'
          debugLog('Using plain text SQL format')
          break
        case 'copy':
          // Default COPY format (most efficient for PostgreSQL)
          effectiveFormat = 'plain'
          debugLog('Using COPY format (PostgreSQL native)')
          break
      }
    }

    // Now use effectiveFormat instead of the original format
    const formatFlag = `-F ${getFormatFlag(effectiveFormat)}`
    debugLog(`Using format flag: ${formatFlag}`)

    // Compression flag
    const compressionFlag = options.compress ? '-Z 9' : ''

    // Set backup filename with appropriate extension based on the effective format
    const extension = getFileExtension(effectiveFormat)
    const backupFile = path.join(backupPath, `backup-${timestamp}${extension}`)
    debugLog(`Backup will be saved to: ${backupFile}`)

    // Get connection string with proper fallbacks
    const connectionString =
      options.connectionString ||
      env.backupUrl ||
      'postgres://postgres:postgres@localhost:5432/postgres'

    // Parse connection string to extract credentials
    const url = new URL(connectionString)
    const host = url.hostname
    const port = url.port || '5432'
    const database = url.pathname.substring(1)
    const user = url.username
    const password = url.password

    // Check for pg_dump binary versions
    let pgDumpCommand = 'pg_dump'

    // Try to determine server version first
    try {
      const versionCommand = `PGPASSWORD=${password} psql -h ${host} -p ${port} -U ${user} -d ${database} -t -c "SELECT version()"`
      const versionOutput = execSync(versionCommand, { stdio: 'pipe' }).toString()
      console.log(`Server version: ${versionOutput.trim()}`)

      // Check for pg_dump version compatibility
      const pgDumpVersions = [
        { cmd: 'pg_dump', version: null },
        { cmd: 'pg_dump15', version: null },
        { cmd: 'pg_dump14', version: null },
        { cmd: 'pg_dump13', version: null },
      ]

      // Find available pg_dump binaries
      for (const pgDump of pgDumpVersions) {
        try {
          const versionCmd = `${pgDump.cmd} --version`
          const output = execSync(versionCmd, { stdio: 'pipe' }).toString()
          pgDump.version = output.trim()
          console.log(`Found ${pgDump.cmd}: ${pgDump.version}`)
        } catch (e) {
          // This version not available
        }
      }

      // If we have multiple pg_dump versions, use the one that might be compatible
      const availableDumps = pgDumpVersions.filter((pg) => pg.version !== null)
      if (availableDumps.length > 1) {
        // If server is PostgreSQL 15.x, try to use pg_dump15 if available
        if (versionOutput.includes('PostgreSQL 15.')) {
          const pg15 = availableDumps.find(
            (pg) => pg.cmd === 'pg_dump15' || pg.version.includes('15.'),
          )
          if (pg15) {
            pgDumpCommand = pg15.cmd
            console.log(`Selected ${pgDumpCommand} to match server version`)
          }
        }
      }
    } catch (e) {
      console.warn(
        '⚠️ Unable to check PostgreSQL version compatibility, proceeding with default pg_dump',
      )
    }

    // Custom pg_dump path (if provided)
    if (options.pgDumpPath) {
      pgDumpCommand = options.pgDumpPath
    }

    // Determine data/schema flags
    const dataOnlyFlag = options.dataOnly ? '--data-only' : ''
    const schemaOnlyFlag = options.schemaOnly ? '--schema-only' : ''

    // Handle specific tables
    const tablesFlag = options.tables?.length
      ? options.tables.map((table) => `--table=${table}`).join(' ')
      : ''

    // Handle excluded tables
    const excludeTablesFlag = options.excludeTables?.length
      ? options.excludeTables.map((table) => `--exclude-table=${table}`).join(' ')
      : ''

    // Build pg_dump command
    const verboseFlag = options.verbose ? '-v' : ''
    const command = `PGPASSWORD=${password} ${pgDumpCommand} ${verboseFlag} -h ${host} -p ${port} -U ${user} -d ${database} ${formatFlag} ${compressionFlag} ${dataOnlyFlag} ${schemaOnlyFlag} ${tablesFlag} ${excludeTablesFlag} ${exportFormatFlags} -f ${backupFile}`

    // Check if we should use Docker as fallback
    if (options.useDocker) {
      try {
        const dockerCommand = `docker run --rm postgres:15 pg_dump -h ${host} -p ${port} -U ${user} -d ${database} ${formatFlag} ${compressionFlag} > ${backupFile}`
        console.log(`Using Docker fallback: ${dockerCommand.replace(password, '********')}`)

        // Execute via Docker
        execSync(`PGPASSWORD=${password} ${dockerCommand}`, {
          stdio: options.verbose ? 'inherit' : 'pipe',
        })
        return backupFile
      } catch (dockerError) {
        console.error('❌ Docker fallback failed:', dockerError.message)
        throw dockerError
      }
    }

    // Execute backup command
    console.log(`Executing: ${command.replace(password, '********')}`)
    execSync(command, { stdio: options.verbose ? 'inherit' : 'pipe' })

    // Process special export formats if needed
    if (options.exportFormat === 'csv' || options.exportFormat === 'json') {
      console.log(`Processing special export format: ${options.exportFormat}`)
      try {
        // Special export format handling could be implemented here
        // This would be similar to the handleSpecialExport function we discussed earlier
      } catch (exportError: any) {
        console.error(`⚠️ Special export failed: ${exportError.message}`)
      }
    }

    // Process bulk inserts if requested
    if (options.exportFormat === 'bulk-inserts') {
      console.log('Processing backup file to create bulk INSERT statements...')
      const bulkInsertSize = options.bulkInsertSize || 250 // Default to 250 rows per INSERT

      try {
        // Create a temporary file for processed output
        const tempFile = `${backupFile}.tmp`

        // Process the SQL file to create bulk inserts
        processBulkInserts(backupFile, tempFile, bulkInsertSize, isDebug)

        // Replace the original file with the processed file
        fs.renameSync(tempFile, backupFile)
        console.log(
          `✅ Successfully processed backup with bulk INSERTs (${bulkInsertSize} rows per statement)`,
        )
      } catch (error: any) {
        console.error(`⚠️ Failed to process bulk inserts: ${error.message}`)
        console.log(`Original backup file is still available at: ${backupFile}`)
      }
    }

    // Log success
    console.log(`✅ Backup created: ${backupFile}`)
    return backupFile
  } catch (error: any) {
    console.error('❌ Backup failed:', error.message)
    throw error
  }
}

/**
 * Process a SQL file to convert individual INSERTs to bulk INSERTs
 * @param inputFile Path to original SQL file
 * @param outputFile Path to save processed SQL
 * @param batchSize Number of rows per INSERT statement
 * @param debug Enable debug output
 */
function processBulkInserts(
  inputFile: string,
  outputFile: string,
  batchSize: number = 250,
  debug: boolean = false,
): void {
  // Read the SQL file
  const sql = fs.readFileSync(inputFile, 'utf8')

  // Track table-specific inserts
  const tableInserts: Record<string, { columns: string; values: string[] }> = {}

  // Process line by line
  const lines = sql.split('\n')
  const outputLines: string[] = []

  const currentTable = ''
  let insertCount = 0
  let totalInserts = 0

  for (const line of lines) {
    // Keep non-INSERT statements as is
    if (!line.trim().startsWith('INSERT INTO')) {
      outputLines.push(line)
      continue
    }

    totalInserts++

    // Extract table name and columns
    const insertMatch = line.match(/INSERT INTO ([^\s]+) \(([^)]+)\) VALUES \((.+)\);$/)
    if (!insertMatch) {
      // Unexpected format, keep as is
      outputLines.push(line)
      continue
    }

    const tableName = insertMatch[1]
    const columns = insertMatch[2]
    const values = insertMatch[3]

    // Initialize table entry if not exists
    if (!tableInserts[tableName]) {
      tableInserts[tableName] = {
        columns,
        values: [],
      }
    }

    // Add values to the collection
    tableInserts[tableName].values.push(values)

    // If we've reached the batch size, write out the bulk insert
    if (tableInserts[tableName].values.length >= batchSize) {
      const bulkInsert = createBulkInsert(
        tableName,
        tableInserts[tableName].columns,
        tableInserts[tableName].values,
      )
      outputLines.push(bulkInsert)
      insertCount++

      // Reset the values array for this table
      tableInserts[tableName].values = []
    }
  }

  // Write any remaining inserts
  for (const [tableName, data] of Object.entries(tableInserts)) {
    if (data.values.length > 0) {
      const bulkInsert = createBulkInsert(tableName, data.columns, data.values)
      outputLines.push(bulkInsert)
      insertCount++
    }
  }

  // Write the processed SQL to the output file
  fs.writeFileSync(outputFile, outputLines.join('\n'))

  if (debug) {
    console.log(
      `🐞 [DEBUG] Processed ${totalInserts} individual INSERTs into ${insertCount} bulk INSERTs`,
    )
    console.log(`🐞 [DEBUG] Average batch size: ${Math.round(totalInserts / insertCount)}`)
  }
}

/**
 * Create a bulk INSERT statement
 */
function createBulkInsert(tableName: string, columns: string, valuesList: string[]): string {
  return `INSERT INTO ${tableName} (${columns}) VALUES\n  (${valuesList.join('),\n  (')})\n;`
}

/**
 * Convert format option to pg_dump format flag
 */
function getFormatFlag(format: 'custom' | 'plain' | 'directory' | 'tar'): string {
  const formatMap = {
    custom: 'c',
    plain: 'p',
    directory: 'd',
    tar: 't',
  }
  return formatMap[format]
}

/**
 * Get appropriate file extension based on backup format
 */
function getFileExtension(format: 'custom' | 'plain' | 'directory' | 'tar'): string {
  const extensionMap = {
    custom: '.dump',
    plain: '.sql',
    directory: '',
    tar: '.tar',
  }
  return extensionMap[format]
}

// Execute the migration if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  ;(async () => {
    try {
      // Parse command line arguments
      const args = process.argv.slice(2)
      const connectionStringArg = args.find((arg) => arg.startsWith('--connection='))?.split('=')[1]
      const backupPathArg = args.find((arg) => arg.startsWith('--path='))?.split('=')[1]
      const formatArg = args
        .find((arg) => arg.startsWith('--format='))
        ?.split('=')[1] as BackupOptions['format']
      const pgDumpPathArg = args.find((arg) => arg.startsWith('--pg-dump-path='))?.split('=')[1]
      const exportFormatArg = args
        .find((arg) => arg.startsWith('--export-format='))
        ?.split('=')[1] as BackupOptions['exportFormat']
      const bulkInsertSizeArg = args
        .find((arg) => arg.startsWith('--bulk-insert-size='))
        ?.split('=')[1]
      const tablesArg = args
        .find((arg) => arg.startsWith('--tables='))
        ?.split('=')[1]
        ?.split(',')
      const excludeTablesArg = args
        .find((arg) => arg.startsWith('--exclude-tables='))
        ?.split('=')[1]
        ?.split(',')
      const isVerbose = args.includes('--verbose')
      const isCompress = args.includes('--compress')
      const useDocker = args.includes('--use-docker')
      const isDataOnly = args.includes('--data-only')
      const isSchemaOnly = args.includes('--schema-only')
      const isDebug = args.includes('--debug')

      // Create backup with provided options
      await createBackup({
        connectionString: connectionStringArg,
        backupPath: backupPathArg,
        format: formatArg,
        verbose: isVerbose,
        compress: isCompress,
        pgDumpPath: pgDumpPathArg,
        useDocker: useDocker,
        dataOnly: isDataOnly,
        schemaOnly: isSchemaOnly,
        tables: tablesArg,
        excludeTables: excludeTablesArg,
        exportFormat: exportFormatArg,
        bulkInsertSize: bulkInsertSizeArg ? parseInt(bulkInsertSizeArg, 10) : undefined,
        debug: isDebug,
      })
    } catch (error: any) {
      console.error('❌ Backup failed:', error.message)
      process.exit(1)
    }
  })()
}
