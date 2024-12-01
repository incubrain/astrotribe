// plugins/complexity.ts
import { ESLint } from 'eslint'
import type { PluginReportConfig } from '../types/report'

import type { ScannerPlugin, ScanContext, ScanResult } from '../types'

export interface ComplexityResult {
  filePath: string
  line: number
  complexity: number
}

export class ComplexityScanner implements ScannerPlugin {
  name = 'complexity'

  private async initializeESLint(threshold: number) {
    return new ESLint({
      baseConfig: {
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint'],
        rules: {
          complexity: ['error', { max: threshold }],
        },
      },
      useEslintrc: true,
    })
  }

  async run(context: ScanContext): Promise<ScanResult> {
    try {
      const eslint = await this.initializeESLint(context.globalConfig.thresholds.complexity)
      const results = await eslint.lintFiles([`${context.projectPath}/**/*.{ts,tsx,vue}`])

      const complexityIssues = results.flatMap((result) =>
        result.messages
          .filter((message) => message.ruleId === 'complexity')
          .map((message) => ({
            filePath: result.filePath,
            line: message.line,
            complexity: parseInt(message.message.match(/complexity of (\d+)/)?.[1] || '0'),
          })),
      )

      return {
        pluginName: this.name,
        success: true,
        data: complexityIssues,
      }
    } catch (error) {
      return {
        pluginName: this.name,
        success: false,
        data: [],
        errors: [(error as Error).message],
      }
    }
  }
}

// plugin-configs/complexity.config.ts

export interface ComplexitySummaryMetrics {
  averageComplexity: number
  maxComplexity: number
  filesOverThreshold: number
  totalFiles: number
  complexityDistribution: {
    low: number // 1-5
    medium: number // 6-10
    high: number // 11-15
    severe: number // 16+
  }
}

export const complexityConfig: PluginReportConfig = {
  name: 'complexity',
  weight: 0.3,
  thresholds: {
    critical: 65, // Score below this indicates dangerous complexity levels
    warning: 85, // Score below this suggests need for refactoring
  },
  scoring: (data: unknown) => {
    const results = data as ComplexityResult[]
    if (!results?.length) return 100

    let score = 100
    const threshold = 10 // Matching ESLint config

    // Calculate complexity distribution
    const distribution = {
      low: 0,
      medium: 0,
      high: 0,
      severe: 0,
    }

    results.forEach((result) => {
      if (result.complexity <= 5) distribution.low++
      else if (result.complexity <= 10) distribution.medium++
      else if (result.complexity <= 15) distribution.high++
      else distribution.severe++
    })

    // Severe complexity impacts (40% weight)
    const severeRatio = distribution.severe / results.length
    score -= severeRatio * 40

    // High complexity impacts (30% weight)
    const highRatio = distribution.high / results.length
    score -= highRatio * 30

    // Medium complexity impacts (20% weight)
    const mediumRatio = distribution.medium / results.length
    score -= mediumRatio * 20

    return Math.max(0, Math.round(score))
  },
  summarize: (data: unknown) => {
    const results = data as ComplexityResult[]
    const issues = [] as Array<{ type: string; severity: 'critical' | 'warning'; message: string }>

    const summary: ComplexitySummaryMetrics = {
      averageComplexity: results.reduce((sum, r) => sum + r.complexity, 0) / results.length,
      maxComplexity: Math.max(...results.map((r) => r.complexity)),
      filesOverThreshold: results.filter((r) => r.complexity > 10).length,
      totalFiles: results.length,
      complexityDistribution: {
        low: results.filter((r) => r.complexity <= 5).length,
        medium: results.filter((r) => r.complexity > 5 && r.complexity <= 10).length,
        high: results.filter((r) => r.complexity > 10 && r.complexity <= 15).length,
        severe: results.filter((r) => r.complexity > 15).length,
      },
    }

    // Generate issues based on complexity findings
    if (summary.maxComplexity > 15) {
      issues.push({
        type: 'complexity',
        severity: 'critical',
        message: `Maximum complexity of ${summary.maxComplexity} detected. Consider breaking down complex functions.`,
      })
    }

    if (summary.complexityDistribution.severe > 0) {
      issues.push({
        type: 'complexity',
        severity: 'critical',
        message: `${summary.complexityDistribution.severe} functions with severe complexity (>15) found.`,
      })
    }

    if (summary.averageComplexity > 10) {
      issues.push({
        type: 'complexity',
        severity: 'warning',
        message: `Average complexity of ${summary.averageComplexity.toFixed(1)} is above recommended threshold.`,
      })
    }

    return {
      score: complexityConfig.scoring(data),
      issues,
      metrics: summary,
    }
  },
}
