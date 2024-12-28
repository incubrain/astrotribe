import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { LogAnalyzer, type LogAnalysisResult } from './log-analyzer'

const DOCKER_EXCLUDE = ['chrome-extension']

function getDateString() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getSubDirectories(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return []
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((dir) => path.join(dirPath, dir.name))
}

async function runDockerBuild(projectPath: string): Promise<void> {
  const projectName = path.basename(projectPath)
  const dateStr = getDateString()

  const logsDir = path.join(__dirname, '..', 'logs', 'docker-build', projectName)
  fs.mkdirSync(logsDir, { recursive: true })

  const dockerLogFile = path.join(logsDir, `docker-${projectName}-${dateStr}.log`)
  fs.writeFileSync(dockerLogFile, '')

  console.log(`\nBuilding Docker image for: ${projectName}...`)

  const dockerProcess = spawn(
    'docker',
    [
      'build',
      '-t',
      projectName.toLowerCase(),
      '-f',
      path.join(projectPath, 'Dockerfile'),
      '.', // Build context is root directory
    ],
    {
      cwd: path.join(__dirname, '..'), // Set working directory to monorepo root
      shell: true,
    },
  )

  const logStream = fs.createWriteStream(dockerLogFile, { flags: 'a' })

  dockerProcess.stdout.on('data', (data: Buffer) => {
    process.stdout.write(data)
    logStream.write(data)
  })

  dockerProcess.stderr.on('data', (data: Buffer) => {
    process.stderr.write(data)
    logStream.write(data)
  })

  return new Promise((resolve, reject) => {
    dockerProcess.on('close', (code) => {
      logStream.end()
      if (code !== 0) {
        reject(new Error(`Docker build failed for ${projectName}`))
      } else {
        resolve()
      }
    })
  })
}

async function mountDockerImage(projectName: string): Promise<void> {
  console.log(`\nMounting Docker image for: ${projectName}...`)
  // Placeholder for future mount implementation
  return Promise.resolve()
}

async function cleanupDockerImage(projectName: string) {
  console.log(`\nCleaning up Docker image: ${projectName}...`)
  try {
    const cleanProcess = spawn('docker', ['rmi', projectName.toLowerCase()], {
      shell: true,
    })

    await new Promise((resolve) => {
      cleanProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`Removed image: ${projectName}`)
        } else {
          console.warn(`Failed to remove image: ${projectName}`)
        }
        resolve(null)
      })
    })
  } catch (err) {
    console.error(`Error cleaning up ${projectName}:`, err)
  }
}

async function main() {
  const rootDir = path.join(__dirname, '..')
  const appsDir = path.join(rootDir, 'apps')
  const targetApp = process.argv[2]

  console.log('Gathering projects to build...')

  let projectPaths = getSubDirectories(appsDir).filter((projectPath) => {
    const projectName = path.basename(projectPath)
    return (
      !DOCKER_EXCLUDE.includes(projectName) && fs.existsSync(path.join(projectPath, 'Dockerfile'))
    )
  })

  if (targetApp) {
    projectPaths = projectPaths.filter((projectPath) => path.basename(projectPath) === targetApp)
    if (projectPaths.length === 0) {
      console.error(`No matching app found: ${targetApp}`)
      process.exit(1)
    }
  }

  const successes: string[] = []
  const failures: string[] = []

  for (const projectPath of projectPaths) {
    const projectName = path.basename(projectPath)
    try {
      await runDockerBuild(projectPath)
      await mountDockerImage(projectName)
      await cleanupDockerImage(projectName)
      successes.push(projectName)
    } catch (err) {
      console.error(`Error building ${projectName}:`, err)
      failures.push(projectName)
    }
  }

  console.log('\n=== BUILD SUMMARY ===')
  console.log(`Successes: ${successes.join(', ') || 'None'}`)
  console.log(`Failures: ${failures.join(', ') || 'None'}`)

  process.exit(failures.length ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
