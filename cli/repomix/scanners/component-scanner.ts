// cli/scanners/component-scanner.ts

import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'
import type { ComponentScanResult, ScannerOptions } from '../types/scanners'
import { NuxtConfigScanner } from './nuxt-config-scanner'

export class ComponentScanner {
  private readonly nuxtConfigScanner: NuxtConfigScanner
  private readonly componentPrefixes = [
    { prefix: 'Prime', source: 'primevue' },
    { prefix: 'Base', source: 'layer', path: 'base' },
  ]

  constructor() {
    this.nuxtConfigScanner = new NuxtConfigScanner()
  }

  async scan(appPath: string, options: ScannerOptions = {}): Promise<ComponentScanResult> {
    const appName = path.basename(appPath)
    const [filesScan, nuxtConfig] = await Promise.all([
      this.scanFiles(appPath, options),
      await this.isNuxtApp(appPath) ? this.nuxtConfigScanner.scan(appPath, options) : null,
    ])

    return {
      timestamp: new Date().toISOString(),
      appName,
      ...filesScan,
      nuxtConfig,
    }
  }

  private async isNuxtApp(appPath: string): Promise<boolean> {
    try {
      await fs.access(path.join(appPath, 'nuxt.config.ts'))
      return true
    } catch {
      return false
    }
  }

  private async scanFiles(appPath: string, options: ScannerOptions) {
    const collections = {
      primeComponents: new Set<string>(),
      layerComponents: new Set<string>(),
      layersUsed: new Set<string>(),
      customComponents: new Set<string>(),
      fileMatches: new Set<string>(),
    }

    try {
      // Check both src and root directories
      const srcDir = path.join(appPath, 'src')
      const basePath = (await this.directoryExists(srcDir)) ? srcDir : appPath

      const files = await glob('**/*.{vue,ts,tsx}', {
        cwd: basePath,
        ignore: [
          '**/node_modules/**',
          '**/.nuxt/**',
          '**/dist/**',
          '**/build/**',
          '**/coverage/**',
          '**/*.test.*',
          '**/*.spec.*',
          '**/*.stories.*',
        ],
      })

      if (options.debug) {
        console.log(`Scanning ${files.length} files in ${basePath}`)
      }

      for (const file of files) {
        const fullPath = path.join(basePath, file)
        const content = await fs.readFile(fullPath, 'utf-8')

        // Pass the current file to scanContent
        await this.scanContent(content, collections, {
          ...options,
          currentFile: file,
        })

        if (options.debug && collections.customComponents.size > 0) {
          console.log(`Found in ${file}:`, {
            custom: [...collections.customComponents],
            prime: [...collections.primeComponents],
            layer: [...collections.layerComponents],
          })
        }
      }
    } catch (error) {
      if (options.debug) {
        console.error(`Error scanning files in ${appPath}:`, error)
      }
    }

    return collections
  }

  private async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(dirPath)
      return stats.isDirectory()
    } catch {
      return false
    }
  }

  private async scanContent(
    content: string,
    collections: {
      primeComponents: Set<string>
      layerComponents: Set<string>
      layersUsed: Set<string>
      customComponents: Set<string>
      fileMatches: Set<string>
    },
    options: ScannerOptions,
  ) {
    const searchTerm = options.searchTerm?.toLowerCase() || ''

    // Scan for framework components
    for (const { prefix, source, path: sourcePath } of this.componentPrefixes) {
      const componentMatches = content.matchAll(new RegExp(`<${prefix}([A-Z][a-zA-Z]+)`, 'g'))
      for (const match of Array.from(componentMatches)) {
        const componentName = match[1]
        if (source === 'primevue') {
          collections.primeComponents.add(componentName)
        } else if (source === 'layer' && sourcePath) {
          collections.layerComponents.add(`${sourcePath}/${componentName.toLowerCase()}`)
          collections.layersUsed.add(sourcePath)
        }
      }
    }

    // Scan for component definitions
    const componentPatterns = [
      // defineComponent with name property
      /export\s+default\s+defineComponent\(\s*\{\s*name:\s*['"]([^'"]+)['"]/g,
      // @Component decorator
      /@Component\(\s*\{\s*name:\s*['"]([^'"]+)['"]/g,
      // Vue 2 style component definition
      /export\s+default\s*\{\s*name:\s*['"]([^'"]+)['"]/g,
      // defineComponent with variable
      /const\s+(\w+)\s*=\s*defineComponent\(/g,
      // exported defineComponent
      /export\s+const\s+(\w+)\s*=\s*defineComponent\(/g,
      // Vue component name in template
      /<template>\s*<!--\s*@component\s+(\w+)/g,
      // SFC filename (assuming filename is component name)
      /\bexport\s+default\s+defineComponent<(\w+)/g,
    ]

    for (const pattern of componentPatterns) {
      const matches = Array.from(content.matchAll(pattern))
      for (const match of matches) {
        const componentName = match[1]
        if (componentName?.toLowerCase().includes(searchTerm)) {
          collections.customComponents.add(componentName)
        }
      }
    }

    const importMatches = content.matchAll(/import\s+(?:{([^}]+)}|\s*(\w+))\s+from/g)
    for (const match of Array.from(importMatches)) {
      const components =
        (match[1] || match[2])
          ?.split(',')
          .map((c) => c.trim())
          .filter((c) => /^[A-Z]/.test(c)) || []

      for (const component of components) {
        if (component.toLowerCase().includes(searchTerm)) {
          collections.customComponents.add(component)
        }
      }
    }

    // Scan for component usage in template
    const templateComponentPattern = /<([A-Z]\w+)(?:\s+[^>]*)?>/g
    const templateMatches = Array.from(content.matchAll(templateComponentPattern))
    for (const match of templateMatches) {
      const componentName = match[1]
      if (componentName?.toLowerCase().includes(searchTerm)) {
        collections.customComponents.add(componentName)
      }
    }

    // Check for files that might contain the search term
    if (content.toLowerCase().includes(searchTerm)) {
      collections.fileMatches.add(options.currentFile || '')
    }
  }
}
