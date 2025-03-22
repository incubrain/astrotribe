import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { LogAnalyzer, type LogAnalysisResult } from './log-analyzer'

// ──────────────────────────────────────────────────────────
// Helpers to get today's date in YYYY-MM-DD format
// ──────────────────────────────────────────────────────────
function getDateString() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ──────────────────────────────────────────────────────────
// 1) Recursively list subdirectories in a folder
// ──────────────────────────────────────────────────────────
function getSubDirectories(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return []
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((dir) => path.join(dirPath, dir.name))
}

// ──────────────────────────────────────────────────────────
// 2) Build a single project, capturing logs
// ──────────────────────────────────────────────────────────
async function runBuildWithLogs(projectPath: string): Promise<void> {
  const projectName = path.basename(projectPath) // e.g. "admin", "api", etc.
  console.log(`\nBuilding project: ${projectName} ...`)

  const buildStartTs = Date.now()

  // Make a logs/<projectName>/ subdir for today
  const dateStr = getDateString()
  const logsDir = path.join(__dirname, '..', 'logs', 'build', projectName)
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
  }

  // Log files: "<projectName>-YYYY-MM-DD.*.txt"
  const errorLogFile = path.join(logsDir, `${projectName}-${dateStr}.errors.txt`)
  const fullLogFile = path.join(logsDir, `${projectName}-${dateStr}.log`)

  // Clear old logs (optional)
  fs.writeFileSync(errorLogFile, '')
  fs.writeFileSync(fullLogFile, '')

  const libNames = ['testing', 'logger', 'cache', 'core', 'helpers']

  let projectPrefix = '@astronera'

  if (libNames.includes(projectName)) {
    projectPrefix = '@ib'
  }

  const fullProjectName = `${projectPrefix}/${projectName}`

  console.log(`Running build for ${fullProjectName}...`)
  const buildProcess = spawn('pnpm', ['turbo', 'run', 'build', `--filter=${fullProjectName}`], {
    cwd: path.join(__dirname, '..'),
    shell: true, // helpful on Windows
  })

  // Stream logs
  const fullLogStream = fs.createWriteStream(fullLogFile, { flags: 'a' })

  buildProcess.stdout.on('data', (data: Buffer) => {
    process.stdout.write(data)
    fullLogStream.write(data)
  })

  buildProcess.stderr.on('data', (data: Buffer) => {
    process.stderr.write(data)
    fullLogStream.write(data)
    fs.appendFileSync(errorLogFile, data)
  })

  return new Promise((resolve, reject) => {
    buildProcess.on('close', (code) => {
      fullLogStream.end()

      const buildEndTs = Date.now()

      if (code !== 0) {
        console.error(`❌ Build failed for ${projectName} (exit code: ${code}).`)
        reject(new Error(`Build failed for ${projectName}`))
      } else {
        console.log(`✅ Build succeeded for ${projectName}`) // Use LogAnalyzer
        const analyzer = new LogAnalyzer()
        const analysis: LogAnalysisResult = analyzer.analyzeLogs(
          projectName,
          dateStr,
          logsDir,
          buildStartTs,
          buildEndTs,
          code ?? 0, // exit code
        )

        // Save analysis
        const analysisJsonPath = path.join(logsDir, `${projectName}-${dateStr}.analysis.json`)
        fs.writeFileSync(analysisJsonPath, JSON.stringify(analysis, null, 2))
        console.log(`Analysis stored at: ${analysisJsonPath}`)

        resolve()
      }
    })
  })
}

// ──────────────────────────────────────────────────────────
// 3) Main function that picks subfolders from apps/libs/layers
//    Builds only the *first* project for testing, then exits
// ──────────────────────────────────────────────────────────
async function main() {
  const rootDir = path.join(__dirname, '..')
  const appsDir = path.join(rootDir, 'apps')
  const libsDir = path.join(rootDir, 'libs')
  const layersDir = path.join(rootDir, 'layers')

  console.log('Gathering projects to build...')

  // Gather all potential project directories
  const allProjectPaths = [
    ...getSubDirectories(appsDir),
    ...getSubDirectories(libsDir),
    ...getSubDirectories(layersDir),
  ]

  // If no subprojects found, just exit
  if (!allProjectPaths.length) {
    console.error('No subproject directories found.')
    process.exit(0)
  }

  // Track successes/failures
  const successes: string[] = []
  const failures: string[] = []

  for (const projectPath of allProjectPaths) {
    const projectName = path.basename(projectPath)
    try {
      await runBuildWithLogs(projectPath)
      successes.push(projectName)
    } catch (err) {
      console.error(`Captured fatal error for ${projectName}:`, err)
      failures.push(projectName)
    }
  }

  console.log('\n=== BUILD SUMMARY ===')
  console.log(`Successes: ${successes.join(', ') || 'None'}`)
  console.log(`Failures:  ${failures.join(', ') || 'None'}`)

  process.exit(0)
}

// ──────────────────────────────────────────────────────────
// 4) Invoke main
// ──────────────────────────────────────────────────────────
main().catch((err) => {
  console.error(err)
  process.exit(1)
})
