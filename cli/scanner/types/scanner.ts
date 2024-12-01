import { ESLint } from 'eslint'
import { IClone } from '@jscpd/core'
import type { ProjectConfiguration } from '@nx/devkit'

export interface ScannerPlugin {
  name: string
  run(context: ScanContext): Promise<ScanResult>
  validateConfig?(config: unknown): boolean
}

export interface ScanContext {
  projectPath: string
  projectType: 'nuxt' | 'node'
  projectConfig: ProjectConfiguration
  globalConfig: CodeScannerConfig
}

export interface ScanResult {
  pluginName: string
  success: boolean
  data: unknown
  errors?: string[]
}

export interface CodeScannerConfig {
  workspaceRoot: string
  enabledPlugins: string[]
  projectPatterns: {
    nuxt: string[]
    node: string[]
  }
  thresholds: {
    complexity: number
    maintainability: number
    duplication: number
  }
  excludePaths: string[]
  pluginConfigs: Record<string, unknown>
}
