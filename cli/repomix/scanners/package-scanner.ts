// tools/scanners/package.ts
import path from 'path'
import fs from 'fs/promises'
import type { PackageScanResult, ScannerOptions } from '../types'

export class PackageScanner {
  private async getRootPackageJson() {
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    return JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
  }

  private async getNxProjectConfig(appName: string, options: ScannerOptions = {}) {
    try {
      // First try project.json
      const projectConfigPath = path.join(process.cwd(), 'apps', appName, 'project.json')
      return JSON.parse(await fs.readFile(projectConfigPath, 'utf-8'))
    } catch {
      // Fallback to workspace.json
      try {
        const workspaceConfigPath = path.join(process.cwd(), 'workspace.json')
        const workspace = JSON.parse(await fs.readFile(workspaceConfigPath, 'utf-8'))
        return workspace.projects[`apps/${appName}`] || workspace.projects[appName]
      } catch {
        if (options?.debug) {
          console.warn(`No project configuration found for ${appName}`)
        }
        return null
      }
    }
  }

  async scan(appPath: string, options: ScannerOptions = {}): Promise<PackageScanResult> {
    const appName = path.basename(appPath)
    const rootPackageJson = await this.getRootPackageJson()
    const projectConfig = await this.getNxProjectConfig(appName, options)

    // Get project-specific dependencies if they exist in the project config
    const projectDeps = new Set<string>()
    const projectDevDeps = new Set<string>()

    if (projectConfig?.dependencies) {
      Object.keys(projectConfig.dependencies).forEach((dep) => projectDeps.add(dep))
    }

    // Get relevant dependencies from root package.json
    // You might want to customize this logic based on your needs
    const relevantDeps = new Set<string>([
      // Always include these dependencies for Nuxt projects
      '@nuxt/kit',
      '@nuxt/schema',
      '@nuxt/test-utils',
      '@pinia/nuxt',
      '@primevue/nuxt-module',
      'nuxt',
      'vue',
      'primevue',
      ...projectDeps,
    ])

    // Filter root dependencies based on what's actually used
    const dependencies = new Set(
      Object.keys(rootPackageJson.dependencies || {}).filter((dep) => {
        if (options.searchTerm) {
          return dep.toLowerCase().includes(options.searchTerm.toLowerCase())
        }
        return (
          relevantDeps.has(dep) ||
          dep.startsWith('@nuxt/') ||
          dep.startsWith('@vue/') ||
          dep.startsWith('vue-')
        )
      }),
    )

    const devDependencies = new Set(
      Object.keys(rootPackageJson.devDependencies || {}).filter((dep) => {
        if (options.searchTerm) {
          return dep.toLowerCase().includes(options.searchTerm.toLowerCase())
        }
        return (
          projectDevDeps.has(dep) ||
          dep.startsWith('@nuxt/') ||
          dep.startsWith('@vue/') ||
          dep.startsWith('vue-')
        )
      }),
    )

    return {
      timestamp: new Date().toISOString(),
      appName,
      dependencies,
      devDependencies,
    }
  }
}
