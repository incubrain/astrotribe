// tools/scanners/component.ts
import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'
import { NuxtConfigScanner } from './nuxt-config'
import type { ComponentScanResult } from './types'

export class ComponentScanner {
  private readonly nuxtConfigScanner: NuxtConfigScanner

  private readonly componentPrefixes = [
    { prefix: 'Prime', source: 'primevue' },
    { prefix: 'Base', source: 'layer', path: 'base' },
    // Add other prefixes
  ]

  constructor() {
    this.nuxtConfigScanner = new NuxtConfigScanner()
  }

  async scanApp(appName: string, appPath: string): Promise<ComponentScanResult> {
    const [filesScan, nuxtConfig] = await Promise.all([
      this.scanFiles(appPath),
      this.nuxtConfigScanner.analyzeConfig(appPath),
    ])

    // Combine results
    return {
      timestamp: new Date().toISOString(),
      appName,
      ...filesScan,
      nuxtConfig,
    }
  }

  private async scanFiles(appPath: string) {
    const primeComponents = new Set<string>()
    const layerComponents = new Set<string>()
    const layersUsed = new Set<string>()

    const files = await glob('**/*.{vue,ts,tsx}', { cwd: appPath })

    for (const file of files) {
      const content = await fs.readFile(path.join(appPath, file), 'utf-8')
      await this.scanContent(content, { primeComponents, layerComponents, layersUsed })
    }

    return {
      primeComponents,
      layerComponents,
      layersUsed,
    }
  }

  private async scanContent(
    content: string,
    collections: {
      primeComponents: Set<string>
      layerComponents: Set<string>
      layersUsed: Set<string>
    },
  ) {
    const { primeComponents, layerComponents, layersUsed } = collections

    for (const { prefix, source, path: sourcePath } of this.componentPrefixes) {
      const componentMatches = content.matchAll(new RegExp(`<${prefix}([A-Z][a-zA-Z]+)`, 'g'))

      for (const match of componentMatches) {
        const componentName = match[1] // Keep original case for PrimeVue

        if (source === 'primevue') {
          primeComponents.add(componentName)
        } else if (source === 'layer' && sourcePath) {
          layerComponents.add(`${sourcePath}/${componentName.toLowerCase()}`)
          layersUsed.add(sourcePath)
        }
      }
    }
  }
}
