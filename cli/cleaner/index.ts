import * as fs from 'fs'
import { analyzeCyclomaticComplexity } from './code-smell'
import { detectDuplicateCode } from './duplicate-code-detection'
import { computeMaintainabilityIndex } from './maintainability'
import { analyzeDependencies } from './unused-dependencies'
import { readConfig } from './config'

async function generateReport() {
  const config = readConfig()

  const complexityData = await analyzeCyclomaticComplexity()
  const maintainabilityData = await computeMaintainabilityIndex()
  const duplicateData = await detectDuplicateCode()
  const unusedDependencies = await analyzeDependencies()

  const report = {
    cyclomaticComplexity: complexityData,
    maintainabilityIndex: maintainabilityData,
    duplicateCode: duplicateData,
    unusedDependencies: unusedDependencies,
  }

  fs.writeFileSync('report.json', JSON.stringify(report, null, 2))
}

generateReport()
