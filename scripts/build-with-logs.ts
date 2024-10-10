import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface BuildOptions {
  project: string
  logDir?: string
}

const runBuildWithLogs = async (options: BuildOptions): Promise<void> => {
  const { project, logDir = 'debug' } = options

  const logDirPath = path.join(__dirname, '..', logDir)
  if (!fs.existsSync(logDirPath)) {
    fs.mkdirSync(logDirPath, { recursive: true })
  }

  const logFile = path.join(logDirPath, `${project}-build-errors.log`)
  const fullLogFile = path.join(logDirPath, `${project}-full-build.log`)

  fs.writeFileSync(logFile, '')
  fs.writeFileSync(fullLogFile, '')

  console.log(`Starting build for ${project}...`)

  const buildProcess = spawn('npx', ['nx', 'build', project, '--verbose --debug'], {
    env: { ...process.env, NITRO_DEBUG: '1', DEBUG: 'nuxt:*' },
    stdio: ['inherit', 'pipe', 'pipe'],
  })

  const logStream = fs.createWriteStream(fullLogFile, { flags: 'a' })

  buildProcess.stdout.on('data', (data: Buffer) => {
    process.stdout.write(data)
    logStream.write(data)
  })

  buildProcess.stderr.on('data', (data: Buffer) => {
    process.stderr.write(data)
    fs.appendFileSync(logFile, data)
    logStream.write(data)
  })

  return new Promise((resolve) => {
    buildProcess.on('close', (code: number) => {
      console.log(`Build process for ${project} exited with code ${code}`)
      if (code !== 0) {
        console.log(`Errors have been logged to ${logFile}`)
        console.log(`Full build log available at ${fullLogFile}`)
      }
      logStream.end()
      resolve()
    })
  })
}

const parseArguments = (): string | undefined => {
  const args = process.argv.slice(2)
  const projectIndex = args.findIndex((arg) => arg === '--project')

  if (projectIndex !== -1 && projectIndex + 1 < args.length) {
    return args[projectIndex + 1]
  }

  return undefined
}

const main = async () => {
  const project = parseArguments()

  if (!project) {
    console.error(
      'Please specify a project name. Usage: npm run build:debug -- --project your-project-name',
    )
    process.exit(1)
  }

  await runBuildWithLogs({ project })
}

main().catch(console.error)
