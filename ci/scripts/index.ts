import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const runScript = (scriptName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log(`Running ${scriptName}...`)
    const child = spawn('tsx', [path.join(__dirname, scriptName)], { stdio: 'inherit' })

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${scriptName} failed with exit code ${code}`))
      } else {
        resolve()
      }
    })
  })
}

async function runCI() {
  try {
    await runScript('trackBundleSize.ts')
    console.log('All CI scripts completed successfully')
  } catch (error: any) {
    console.error('CI failed:', error)
    process.exit(1)
  }
}

runCI()
