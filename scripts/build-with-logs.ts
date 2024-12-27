import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface BuildOptions {
  project: string
  logDir?: string
}

const runDockerBuildWithLogs = async (options: BuildOptions): Promise<void> => {
  const { project, logDir = 'debug' } = options

  const logDirPath = path.join(__dirname, '..', logDir)
  if (!fs.existsSync(logDirPath)) {
    fs.mkdirSync(logDirPath, { recursive: true })
  }

  const logFile = path.join(logDirPath, `${project}-docker-build-errors.log`)
  const fullLogFile = path.join(logDirPath, `${project}-docker-full-build.log`)

  fs.writeFileSync(logFile, '')
  fs.writeFileSync(fullLogFile, '')

  console.log(`Starting Docker build for ${project}...`)

  // Define the paths
  const dockerfilePath = path.join('apps', project, 'Dockerfile')

  // Load environment variables from .env file
  const envFilePath = path.join(__dirname, '..', '.env')
  const envConfig = dotenv.parse(fs.readFileSync(envFilePath))

  // Prepare build arguments from environment variables
  const buildArgs = []
  const envVarsSerialized = []

  for (const [key, value] of Object.entries(envConfig)) {
    buildArgs.push('--build-arg', `${key}=${value}`)
    envVarsSerialized.push(`${key}=${value}`)
  }

  // Serialize environment variables into a single string
  const envVarsString = envVarsSerialized.join(';')
  buildArgs.push('--build-arg', `ENV_VARS=${envVarsString}`)

  // Build the Docker image with the project name as a build argument
  const dockerBuildProcess = spawn(
    'docker',
    [
      'build',
      '-t',
      `${project}-image`,
      '--build-arg',
      `PROJECT_NAME=${project}`,
      ...buildArgs,
      '-f',
      dockerfilePath,
      '.',
    ],
    {
      cwd: path.join(__dirname, '..'),
      stdio: ['inherit', 'pipe', 'pipe'],
    },
  )

  const logStream = fs.createWriteStream(fullLogFile, { flags: 'a' })

  dockerBuildProcess.stdout.on('data', (data: Buffer) => {
    process.stdout.write(data)
    logStream.write(data)
  })

  dockerBuildProcess.stderr.on('data', (data: Buffer) => {
    process.stderr.write(data)
    fs.appendFileSync(logFile, data)
    logStream.write(data)
  })

  return new Promise((resolve, reject) => {
    dockerBuildProcess.on('close', (code: number) => {
      console.log(`Docker build process for ${project} exited with code ${code}`)
      if (code !== 0) {
        console.log(`Errors have been logged to ${logFile}`)
        console.log(`Full Docker build log available at ${fullLogFile}`)
        logStream.end()
        reject(new Error(`Docker build failed with code ${code}`))
      } else {
        logStream.end()
        resolve()
      }
    })
  })
}

const runDockerContainerWithEnv = async (options: BuildOptions): Promise<void> => {
  const { project } = options

  console.log(`Starting Docker container for ${project} with .env mounted...`)

  // Get the absolute path to the .env file
  const envFileHostPath = path.resolve(path.join(__dirname, '..', '.env'))

  // Check if the .env file exists
  if (!fs.existsSync(envFileHostPath)) {
    console.error(`.env file not found at ${envFileHostPath}`)
    process.exit(1)
  }

  // Run the Docker container with the .env file mounted
  const dockerRunProcess = spawn(
    'docker',
    [
      'run',
      '-p',
      '3000:8080', // Adjust ports if needed
      '-v',
      `${envFileHostPath}:/app/.env`, // Mount the .env file into the container
      `${project}-image`,
    ],
    {
      stdio: 'inherit',
    },
  )

  return new Promise((resolve, reject) => {
    dockerRunProcess.on('close', (code: number) => {
      console.log(`Docker run process for ${project} exited with code ${code}`)
      if (code !== 0) {
        reject(new Error(`Docker run failed with code ${code}`))
      } else {
        resolve()
      }
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
      'Please specify a project name. Usage: npm run build:docker -- --project your-project-name',
    )
    process.exit(1)
  }

  try {
    await runDockerBuildWithLogs({ project })
    await runDockerContainerWithEnv({ project })
  } catch (error: any) {
    console.error(error)
    process.exit(1)
  }
}

main().catch(console.error)
