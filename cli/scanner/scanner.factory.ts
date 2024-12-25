// scanner.ts
import * as fs from 'fs'
import * as path from 'path'
import { getProjects, readProjectConfiguration, type Tree, workspaceRoot } from '@nx/devkit'
import type { CodeScannerConfig, ScannerPlugin, ScanContext, ScanResult } from './types'
import { ComplexityScanner, complexityConfig } from './plugins/complexity'
import { DuplicationScanner, duplicationConfig } from './plugins/duplication'
import { DependencyScanner, dependenciesConfig } from './plugins/dependencies'
import { TypeSafetyPlugin, typeSafetyConfig } from './plugins/type-safety'
import { BundleAnalyzerPlugin, bundleAnalyzerConfig } from './plugins/bundle-analyzer'
import { ReportGenerator } from './report-generator'
import { createNxTree } from './utils/nx-tree'

interface ProjectSummary {
  totalIssues: number
  criticalIssues: number
  typeScore: number
  bundleScore: number
  unusedDependencies: number
  duplicateCode: number
  complexity: {
    max: number
    avg: number
    filesOverThreshold: number
  }
}

interface ScanSummary {
  totalProjects: number
  projectTypes: {
    nuxt: number
    node: number
  }
  overallHealth: {
    score: number
    trend?: 'improving' | 'declining' | 'stable'
  }
  criticalIssues: {
    total: number
    byType: Record<string, number>
  }
  projectHealthScores: Record<string, number>
  recommendations: Array<{
    type: string
    message: string
    priority: 'high' | 'medium' | 'low'
  }>
}

export class CodeScanner {
  private plugins: Map<string, ScannerPlugin> = new Map()
  private config: CodeScannerConfig
  private tree = createNxTree()

  constructor(configPath?: string) {
    this.config = this.loadConfig(configPath)
    this.registerDefaultPlugins()
  }

  private async getProjectPaths(): Promise<Map<string, 'nuxt' | 'node'>> {
    const projects = new Map<string, 'nuxt' | 'node'>()
    const allProjects = getProjects(this.tree)

    for (const [projectName, project] of allProjects) {
      const config = readProjectConfiguration(this.tree, projectName)
      const hasNuxtConfig = fs.existsSync(path.join(config.root, 'nuxt.config.ts'))
      projects.set(projectName, hasNuxtConfig ? 'nuxt' : 'node')
    }

    return projects
  }

  async scanWorkspace(): Promise<Record<string, ScanResult[]>> {
    const projects = await this.getProjectPaths()
    const results: Record<string, ScanResult[]> = {}

    for (const [projectName] of projects) {
      try {
        results[projectName] = await this.scanProject(projectName)
      } catch (error: any) {
        console.error(`Error scanning project ${projectName}:`, error)
      }
    }

    return results
  }

  private loadConfig(configPath?: string): CodeScannerConfig {
    const defaultConfig: CodeScannerConfig = {
      workspaceRoot: process.cwd(),
      enabledPlugins: ['complexity', 'duplication', 'dependencies'],
      projectPatterns: {
        nuxt: ['apps/*', 'packages/*'],
        node: ['tools/*', 'services/*'],
      },
      thresholds: {
        complexity: 10,
        maintainability: 70,
        duplication: 5,
      },
      excludePaths: ['node_modules', 'dist', '.nuxt', '.output'],
      pluginConfigs: {},
    }

    if (configPath && fs.existsSync(configPath)) {
      const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      return { ...defaultConfig, ...userConfig }
    }

    return defaultConfig
  }

  private registerDefaultPlugins(): void {
    this.registerPlugin(new ComplexityScanner())
    this.registerPlugin(new DuplicationScanner())
    this.registerPlugin(new DependencyScanner())
    this.registerPlugin(new TypeSafetyPlugin())
    this.registerPlugin(new BundleAnalyzerPlugin())
  }

  public registerPlugin(plugin: ScannerPlugin): void {
    this.plugins.set(plugin.name, plugin)
  }

  public async scanProject(projectName: string): Promise<ScanResult[]> {
    const projects = await this.getProjectPaths()
    const projectType = projects.get(projectName)

    if (!projectType) {
      throw new Error(`Project ${projectName} not found in workspace`)
    }

    const projectConfig = readProjectConfiguration(this.tree, projectName)
    const context: ScanContext = {
      projectPath: projectConfig.root,
      projectType,
      projectConfig,
      globalConfig: this.config,
    }

    const results: ScanResult[] = []

    for (const pluginName of this.config.enabledPlugins) {
      const plugin = this.plugins.get(pluginName)
      if (plugin) {
        const result = await plugin.run(context)
        results.push(result)
      }
    }

    return results
  }

  private async generateReport(results: Record<string, ScanResult[]>): Promise<void> {
    const pluginConfigs = [
      typeSafetyConfig,
      bundleAnalyzerConfig,
      complexityConfig,
      dependenciesConfig,
      duplicationConfig,
    ]

    const reportGenerator = new ReportGenerator(pluginConfigs)
    const report = await reportGenerator.generateWorkspaceReport(results)

    fs.writeFileSync('code-scanner-report.json', JSON.stringify(report, null, 2))
  }
}
