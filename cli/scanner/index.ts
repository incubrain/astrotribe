// index.ts
import * as fs from 'fs'
import * as path from 'path'
import { CodeScanner } from './scanner.factory'
import { bundleAnalyzerConfig } from './plugins/bundle-analyzer'
import { complexityConfig } from './plugins/complexity'
import { dependenciesConfig } from './plugins/dependencies'
import { duplicationConfig } from './plugins/duplication'
import type { CodeScannerConfig } from './types'

export { CodeScanner }
export * from './types'

export async function createScanner(configPath?: string) {
  const scanner = new CodeScanner(configPath)
  return scanner
}

export async function runScan(options: {
  configPath?: string
  project?: string
  reportPath?: string
  format?: 'json' | 'html'
}) {
  const scanner = await createScanner(options.configPath)

  try {
    let results
    if (options.project) {
      results = { [options.project]: await scanner.scanProject(options.project) }
    } else {
      results = await scanner.scanWorkspace()
    }

    const reportPath = options.reportPath || 'code-scanner-report'

    if (options.format === 'html') {
      // Generate HTML report
      await generateHtmlReport(results, `${reportPath}.html`)
    } else {
      // Generate JSON report
      fs.writeFileSync(`${reportPath}.json`, JSON.stringify(results, null, 2))
    }

    return results
  } catch (error: any) {
    console.error('Scan failed:', error)
    throw error
  }
}

async function generateHtmlReport(results: any, outputPath: string) {
  // HTML report generation logic
  // Implementation omitted for brevity
}
