// plugins/dependencies.ts
import depcheck from 'depcheck'
import type {
  ScannerPlugin,
  ScanContext,
  ScanResult,
  PluginReportConfig,
  DependencySummaryMetrics,
} from '../types'

export class DependencyScanner implements ScannerPlugin {
  name = 'dependencies'

  async run(context: ScanContext): Promise<ScanResult> {
    return new Promise((resolve) => {
      depcheck(
        context.projectPath,
        {
          parsers: {
            '**/*.vue': [depcheck.parser.vue],
            '**/*.ts': [depcheck.parser.typescript],
          },
          ignorePatterns: context.globalConfig.excludePaths,
        },
        (unused) => {
          resolve({
            pluginName: this.name,
            success: true,
            data: {
              unused: {
                dependencies: unused.dependencies,
                devDependencies: unused.devDependencies,
              },
            },
          })
        },
      )
    })
  }
}

export const dependenciesConfig: PluginReportConfig = {
  name: 'dependencies',
  weight: 0.2,
  thresholds: {
    critical: 70, // Score below this indicates severe dependency issues
    warning: 85, // Score below this suggests cleanup needed
  },
  scoring: (data: unknown) => {
    const depData = data as {
      unused: {
        dependencies: string[]
        devDependencies: string[]
      }
    }

    if (!depData?.unused) return 100

    let score = 100
    const { dependencies, devDependencies } = depData.unused

    // Production dependencies impact (60% weight)
    const prodDepsImpact = dependencies.length * 5
    score -= Math.min(60, prodDepsImpact)

    // Dev dependencies impact (40% weight)
    const devDepsImpact = devDependencies.length * 2
    score -= Math.min(40, devDepsImpact)

    return Math.max(0, score)
  },
  summarize: (data: unknown) => {
    const depData = data as {
      unused: {
        dependencies: string[]
        devDependencies: string[]
      }
    }

    const { dependencies, devDependencies } = depData.unused
    const unusedDeps = dependencies.length
    const unusedDevDeps = devDependencies.length
    const totalUnused = unusedDeps + unusedDevDeps

    // Consider dependencies that might have high impact if unused
    const highImpactDeps = dependencies.filter(
      (dep) =>
        dep.includes('vue') ||
        dep.includes('nuxt') ||
        dep.includes('core') ||
        dep.includes('runtime'),
    )

    const summary: DependencySummaryMetrics = {
      totalUnused,
      unusedDependencies: unusedDeps,
      unusedDevDependencies: unusedDevDeps,
      unusedPercentage: 0, // Would need total deps count from package.json
      highImpactDependencies: highImpactDeps,
      totalDependencies: 0, // Would need from package.json
    }

    const issues = [] as Array<{ type: string; severity: string; message: string }>

    if (highImpactDeps.length > 0) {
      issues.push({
        type: 'unused-critical-deps',
        severity: 'critical',
        message: `Unused critical dependencies found: ${highImpactDeps.join(', ')}`,
      })
    }

    if (unusedDeps > 0) {
      issues.push({
        type: 'unused-prod-deps',
        severity: 'warning',
        message: `${unusedDeps} unused production dependencies found`,
      })
    }

    if (unusedDevDeps > 5) {
      issues.push({
        type: 'unused-dev-deps',
        severity: 'info',
        message: `${unusedDevDeps} unused development dependencies found`,
      })
    }

    return {
      score: dependenciesConfig.scoring(data),
      issues,
      metrics: summary,
    }
  },
}
