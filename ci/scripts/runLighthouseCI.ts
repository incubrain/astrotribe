import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const execAsync = promisify(exec)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

interface LighthouseRun {
  fetchTime: string
  categories: {
    performance: { score: number }
    accessibility: { score: number }
    'best-practices': { score: number }
    seo: { score: number }
  }
  audits: {
    'first-contentful-paint': { numericValue: number }
    'largest-contentful-paint': { numericValue: number }
    'total-blocking-time': { numericValue: number }
    'cumulative-layout-shift': { numericValue: number }
  }
}

async function readJsonSafely(filePath: string, retries = 3): Promise<LighthouseRun> {
  for (let i = 0; i < retries; i++) {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(content) as LighthouseRun
    } catch (error) {
      if (i === retries - 1) throw error
      await sleep(1000) // Wait for 1 second before retrying
    }
  }
  throw new Error('Failed to read JSON file after multiple attempts')
}

async function cleanupOldReports(reportDir: string) {
  const files = await fs.readdir(reportDir)
  const now = new Date()
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())

  for (const file of files) {
    if (file.startsWith('lighthouse-summary-') && file.endsWith('.json')) {
      const filePath = path.join(reportDir, file)
      const fileStat = await fs.stat(filePath)
      if (fileStat.mtime < threeMonthsAgo) {
        await fs.unlink(filePath)
        console.log(`Deleted old report: ${file}`)
      }
    }
  }
}

async function runLighthouseCI() {
  console.log('Running Lighthouse CI...')
  const configPath = path.join(__dirname, '..', '..', 'lighthouserc.cjs')
  const reportDir = path.join(__dirname, '..', 'reports', 'lighthouse')

  try {
    await fs.mkdir(reportDir, { recursive: true })

    const { stdout, stderr } = await execAsync(`npx lhci autorun --config=${configPath}`)
    console.log('Lighthouse CI stdout:', stdout)
    if (stderr) {
      console.error('Lighthouse CI stderr:', stderr)
    }

    await sleep(2000)

    const files = await fs.readdir(reportDir)
    const jsonFiles = files.filter((file) => file.endsWith('-lighthouse.json'))

    console.log('Lighthouse report files found:', jsonFiles)

    const runs = await Promise.all(
      jsonFiles.map((file) => readJsonSafely(path.join(reportDir, file))),
    )

    const customReport = runs.map((run) => ({
      timestamp: run.fetchTime,
      scores: {
        performance: run.categories.performance.score,
        accessibility: run.categories.accessibility.score,
        bestPractices: run.categories['best-practices'].score,
        seo: run.categories.seo.score,
      },
      metrics: {
        firstContentfulPaint: run.audits['first-contentful-paint'].numericValue,
        largestContentfulPaint: run.audits['largest-contentful-paint'].numericValue,
        totalBlockingTime: run.audits['total-blocking-time'].numericValue,
        cumulativeLayoutShift: run.audits['cumulative-layout-shift'].numericValue,
      },
    }))

    const date = new Date()
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const customReportPath = path.join(reportDir, `lighthouse-summary-${dateString}.json`)
    await fs.writeFile(customReportPath, JSON.stringify(customReport, null, 2))

    // Clean up all JSON files in the directory
    const allJsonFiles = files.filter((file) => file.endsWith('.json'))
    await Promise.all(allJsonFiles.map((file) => fs.unlink(path.join(reportDir, file))))

    console.log('Custom Lighthouse report saved:', customReportPath)

    // Clean up old reports
    await cleanupOldReports(reportDir)
  } catch (error) {
    console.error('Lighthouse CI error:', error)
    process.exit(1)
  }
}

await runLighthouseCI()
