// tools/scanners/nuxt-config.ts
import fs from 'fs/promises'
import path from 'path'
import type { NuxtConfigAnalysis } from './types'

export class NuxtConfigScanner {
  async analyzeConfig(appPath: string): Promise<NuxtConfigAnalysis> {
    const configPath = path.join(appPath, 'nuxt.config.ts')
    const content = await fs.readFile(configPath, 'utf-8')

    // Extract layers from extends array
    const layersMatch = content.match(/extends:\s*\[([\s\S]*?)\]/)?.[1] || ''
    const layers = layersMatch
      .split(',')
      .map((layer) => layer.trim())
      .filter((layer) => layer.includes('layers/'))
      .map((layer) => layer.replace(/['"`]/g, '').split('layers/')[1])
      .filter(Boolean)

    // Extract modules array
    const modulesMatch = content.match(/modules:\s*\[([\s\S]*?)\]/)?.[1] || ''
    const modules = modulesMatch
      .split(',')
      .map((module) => module.trim())
      .filter(Boolean)
      .map((module) => module.replace(/['"`]/g, ''))

    // Extract PrimeVue config if present
    const primevueConfig = this.extractPrimeVueConfig(content)

    return {
      layers,
      modules,
      components: primevueConfig,
    }
  }

  private extractPrimeVueConfig(
    content: string,
  ): { prefix?: string; include?: string | string[]; exclude?: string[] } | undefined {
    const primevueMatch = content.match(/primevue:\s*{([\s\S]*?)}/)?.[1]
    if (!primevueMatch) return undefined

    const config: { prefix?: string; include?: string | string[]; exclude?: string[] } = {}

    // Extract components config
    const componentsMatch = primevueMatch.match(/components:\s*{([\s\S]*?)}/)?.[1]
    if (componentsMatch) {
      const prefix = componentsMatch.match(/prefix:\s*['"]([^'"]+)['"]/)?.[1]
      const include = componentsMatch.match(/include:\s*['"]([^'"]+)['"]/)?.[1]
      const excludeMatch = componentsMatch.match(/exclude:\s*\[([\s\S]*?)\]/)

      if (prefix) config.prefix = prefix
      if (include) config.include = include
      if (excludeMatch) {
        config.exclude = excludeMatch[1]
          .split(',')
          .map((item) => item.trim().replace(/['"`]/g, ''))
          .filter(Boolean)
      }
    }

    return config
  }
}
