import { spawn } from 'child_process'
import { createWriteStream } from 'fs'
import { join, dirname } from 'path'
import { mkdir } from 'fs/promises'

// Get the API project root directory
const API_ROOT = join(process.cwd())
const LOG_FILE = join(API_ROOT, 'logs', 'build-debug.log')

async function createLogDir() {
  const logDir = dirname(LOG_FILE)
  try {
    await mkdir(logDir, { recursive: true })
    console.log(`Created log directory: ${logDir}`)
  } catch (err) {
    console.warn(`Warning: Could not create log directory: ${err}`)
  }
}

async function runBuildWithLogs() {
  await createLogDir()

  const logStream = createWriteStream(LOG_FILE, { flags: 'w' })
  const timestamp = new Date().toISOString()

  logStream.write(`Build started at ${timestamp}\n`)
  logStream.write('Environment:\n')
  logStream.write(`CWD: ${process.cwd()}\n`)
  logStream.write(`NODE_ENV: ${process.env.NODE_ENV}\n`)
  logStream.write('----------------------------------------\n\n')

  const buildProcess = spawn('nx', ['build', '@astronera/api', '--verbose'], {
    env: {
      ...process.env,
      NODE_DEBUG: 'module',
      FORCE_COLOR: 'true',
    },
    stdio: ['inherit', 'pipe', 'pipe'],
  })

  // Pipe process output to both console and log file
  buildProcess.stdout?.on('data', (data) => {
    process.stdout.write(data)
    logStream.write(data)
  })

  buildProcess.stderr?.on('data', (data) => {
    process.stderr.write(data)
    logStream.write(data)
  })

  return new Promise<void>((resolve, reject) => {
    buildProcess.on('exit', (code) => {
      const endTimestamp = new Date().toISOString()
      logStream.write(`\n----------------------------------------\n`)
      logStream.write(`Build finished at ${endTimestamp}\n`)
      logStream.write(`Exit code: ${code}\n`)
      logStream.end()

      if (code === 0) {
        console.log(`\nBuild succeeded. Logs saved to ${LOG_FILE}`)
        resolve()
      } else {
        const error = new Error(`Build process exited with code ${code}`)
        console.error(`\nBuild failed. Logs saved to ${LOG_FILE}`)
        reject(error)
      }
    })

    buildProcess.on('error', (error) => {
      logStream.write(`\nBuild process error: ${error.message}\n`)
      logStream.end()
      reject(error)
    })
  })
}

// Run the build logger
runBuildWithLogs().catch((error) => {
  console.error('Build failed:', error.message)
  process.exit(1)
})
