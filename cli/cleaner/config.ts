import * as fs from 'fs'

interface Config {
  analyzers: {
    cyclomaticComplexity: boolean
    maintainabilityIndex: boolean
    duplicateCode: boolean
    unusedDependencies: boolean
  }
  complexityThreshold: number
  maintainabilityThreshold: number
  excludePaths: string[]
}

export function readConfig(): Config {
  try {
    const configContent = fs.readFileSync('config.json', 'utf-8')
    return JSON.parse(configContent)
  } catch (error) {
    console.error('Error reading config file:', error)
    // Return default configuration
    return {
      analyzers: {
        cyclomaticComplexity: true,
        maintainabilityIndex: true,
        duplicateCode: true,
        unusedDependencies: true,
      },
      complexityThreshold: 10,
      maintainabilityThreshold: 70,
      excludePaths: ['node_modules', 'dist'],
    }
  }
}
