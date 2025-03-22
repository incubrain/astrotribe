// scanner.ts (Updated version)
import * as fs from 'fs'
import * as path from 'path'
import type { CodeScannerConfig, ScannerPlugin, ScanContext, ScanResult } from './types'
import { ComplexityScanner, complexityConfig } from './plugins/complexity'
import { DuplicationScanner, duplicationConfig } from './plugins/duplication'
import { DependencyScanner, dependenciesConfig } from './plugins/dependencies'
import { TypeSafetyPlugin, typeSafetyConfig } from './plugins/type-safety'
import { BundleAnalyzerPlugin, bundleAnalyzerConfig } from './plugins/bundle-analyzer'
import { ReportGenerator } from './report-generator'

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
  private workspaceRoot: string

  constructor(configPath?: string) {
    this.workspaceRoot = process.cwd()
    this.config = this.loadConfig(configPath)
    this.registerDefaultPlugins()
  }

  private async getProjectPaths(): Promise<Map<string, 'nuxt' | 'node'>> {
    const projects = new Map<string, 'nuxt' | 'node'>()

    // Scan apps directory
    const appsDir = path.join(this.workspaceRoot, 'apps')
    if (fs.existsSync(appsDir)) {
      const appDirs = fs
        .readdirSync(appsDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)

      for (const app of appDirs) {
        const appPath = path.join(appsDir, app)
        const hasNuxtConfig =
          fs.existsSync(path.join(appPath, 'nuxt.config.ts')) ||
          fs.existsSync(path.join(appPath, 'nuxt.config.js'))
        projects.set(`@astronera/${app}`, hasNuxtConfig ? 'nuxt' : 'node')
      }
    }

    // Scan libs directory
    const libsDir = path.join(this.workspaceRoot, 'libs')
    if (fs.existsSync(libsDir)) {
      const libDirs = fs
        .readdirSync(libsDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)

      for (const lib of libDirs) {
        const libPath = path.join(libsDir, lib)
        const isIbLib = ['logger', 'cache', 'core', 'testing'].includes(lib)
        projects.set(isIbLib ? `@ib/${lib}` : `@astronera/${lib}`, 'node')
      }
    }

    // Scan layers directory
    const layersDir = path.join(this.workspaceRoot, 'layers')
    if (fs.existsSync(layersDir)) {
      const layerDirs = fs
        .readdirSync(layersDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)

      for (const layer of layerDirs) {
        const layerPath = path.join(layersDir, layer)
        projects.set(`@astronera/${layer}`, 'nuxt')
      }
    }

    return projects
  }

  async scanWorkspace(): Promise<Record<string, ScanResult[]>> {
    const projects = await this.getProjectPaths()
    const results: Record<string, ScanResult[]> = {}

    for (const [projectName, projectType] of projects) {
      try {
        results[projectName] = await this.scanProject(projectName, projectType)
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

  public async scanProject(
    projectName: string,
    projectType: 'nuxt' | 'node',
  ): Promise<ScanResult[]> {
    let projectPath: string | undefined

    if (projectName.startsWith('@astronera/')) {
      const name = projectName.replace('@astronera/', '')
      // Check in apps
      let potentialPath = path.join(this.workspaceRoot, 'apps', name)
      if (fs.existsSync(potentialPath)) {
        projectPath = potentialPath
      } else {
        // Check in layers
        potentialPath = path.join(this.workspaceRoot, 'layers', name)
        if (fs.existsSync(potentialPath)) {
          projectPath = potentialPath
        }
      }
    } else if (projectName.startsWith('@ib/')) {
      const name = projectName.replace('@ib/', '')
      projectPath = path.join(this.workspaceRoot, 'libs', name)
    }

    if (!projectPath || !fs.existsSync(projectPath)) {
      throw new Error(`Project path for ${projectName} not found`)
    }

    const packageJsonPath = path.join(projectPath, 'package.json')
    const packageJson = fs.existsSync(packageJsonPath)
      ? JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      : {}

    const projectConfig = {
      root: projectPath,
      sourceRoot: projectPath,
      projectType: projectType === 'nuxt' ? 'application' : 'library',
      targets: packageJson.scripts || {},
    }

    const context: ScanContext = {
      projectPath,
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
