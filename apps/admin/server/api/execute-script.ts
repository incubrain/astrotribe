import { execFile } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execFileAsync = promisify(execFile)

type ScriptName = 'build-all' | 'db-setup' | 'generate-lazy-routes' | 'clean-packages'

const scriptConfigs = {
  'build-all': { type: 'sh', file: 'build-all.sh' },
  'db-setup': { type: 'ts', file: 'db-setup.ts' },
  'generate-lazy-routes': { type: 'ts', file: 'generate-lazy-routes.ts' },
  'clean-packages': { type: 'sh', file: 'clean-packages.sh' },
  // Add more scripts as needed
}

export default defineEventHandler(async (event) => {
  const { scriptName } = (await readBody(event)) as { scriptName: ScriptName }

  if (!scriptConfigs[scriptName]) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid script name',
    })
  }

  const { type, file } = scriptConfigs[scriptName]

  const baseDir = process.cwd()
  const scriptPath = path.join('/app', 'scripts', file)

  console.log(`Current working directory: ${process.cwd()}`)
  console.log(`Script path: ${scriptPath}`)
  console.log('Files in current directory:', fs.readdirSync(process.cwd()))
  console.log('Files in /app/scripts:', fs.readdirSync('/app/scripts'))
  console.log(`Current working directory: ${baseDir}`)
  console.log(`Attempting to execute script: ${scriptPath}`)

  // Check if the script file exists
  if (!fs.existsSync(scriptPath)) {
    console.error(`Script file not found: ${scriptPath}`)
    throw createError({
      statusCode: 500,
      statusMessage: 'Script file not found',
    })
  }

  try {
    let output
    if (type === 'sh') {
      const { stdout, stderr } = await execFileAsync('sh', [scriptPath], { cwd: baseDir })
      output = stdout + stderr
    } else if (type === 'ts') {
      const { stdout, stderr } = await execFileAsync('npx', ['tsx', scriptPath], { cwd: baseDir })
      output = stdout + stderr
    } else {
      throw new Error('Unsupported script type')
    }

    console.log(`Script execution completed: ${scriptName}`)
    return { output }
  } catch (error: any) {
    console.error(`Error executing script ${scriptName}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error executing script',
    })
  }
})
