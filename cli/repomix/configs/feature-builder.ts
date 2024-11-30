import pluralize from 'pluralize' // You'll need to install this package
import type { FeatureConfig, OutputConfig } from '../types/configs'
import { COMMON_CONFIGS, BASE_CONFIG } from './base-config'

type ConfigKey = keyof typeof COMMON_CONFIGS
type ConfigProperty = 'include' | 'ignore'

// configs/feature-builder.ts
export class FeatureConfigBuilder {
  private config: Partial<FeatureConfig> = {
    include: [],
    ignore: {
      useGitignore: true,
      useDefaultPatterns: true,
      customPatterns: [...BASE_CONFIG.ignore.customPatterns],
    },
  }

  constructor() {
    this.config = {
      include: [],
      ignore: {
        useGitignore: true,
        useDefaultPatterns: true,
        customPatterns: [...BASE_CONFIG.ignore.customPatterns],
      },
    }
  }

  setId(id: string) {
    this.config.id = id
    return this
  }

  setName(name: string) {
    this.config.name = name
    return this
  }

  description(desc: string) {
    this.config.description = desc
    return this
  }

  patterns(patterns: string[]) {
    // Add both singular and plural versions of patterns
    const expandedPatterns = patterns.flatMap((pattern) => {
      const parts = pattern.split('/')
      const lastPart = parts[parts.length - 1]

      // If the last part contains a wildcard, don't pluralize
      if (lastPart.includes('*')) {
        return [pattern]
      }

      const singularPart = pluralize.singular(lastPart)
      const pluralPart = pluralize.plural(lastPart)

      if (singularPart === pluralPart) {
        return [pattern]
      }

      parts[parts.length - 1] = `{${singularPart},${pluralPart}}`
      return [pattern, parts.join('/')]
    })

    this.config.include = expandedPatterns
    return this
  }

  withCommonConfigs(...configs: ConfigKey[]) {
    console.log('Before merging, include:', this.config.include)
    this.config.include = this.combinePatterns(this.config.include || [], configs, 'include')
    console.log('After merging, include:', this.config.include)

    console.log('Before merging, customPatterns:', this.config.ignore.customPatterns)
    this.config.ignore.customPatterns = this.combinePatterns(
      this.config.ignore.customPatterns || [],
      configs,
      'ignore',
    )
    console.log('After merging, customPatterns:', this.config.ignore.customPatterns)

    return this
  }

  ignore(patterns: string[]) {
    this.config.ignore.customPatterns = [...this.config.ignore?.customPatterns, ...patterns]
    return this
  }

  private getConfigValues(configs: ConfigKey[], property: ConfigProperty): string[] {
    return configs.flatMap((key) => {
      const configValue = COMMON_CONFIGS[key][property]
      if (
        property === 'ignore' &&
        typeof configValue === 'object' &&
        'customPatterns' in configValue
      ) {
        return configValue.customPatterns
      }
      return configValue ?? []
    })
  }

  private combinePatterns(
    patterns: string[],
    commonConfigs: ConfigKey[],
    property: ConfigProperty,
  ): string[] {
    const configValues = this.getConfigValues(commonConfigs, property)
    const uniquePatterns = new Set([...patterns, ...configValues])
    return Array.from(uniquePatterns)
  }

  relatedTo(...features: string[]) {
    this.config.relatedFeatures = features
    return this
  }

  setOutput(outputConfig: Partial<OutputConfig>) {
    this.config.outputConfig = {
      directory: outputConfig.directory || 'ai-context',
      filename: outputConfig.filename || this.config.id || '',
      extension: outputConfig.extension || 'txt',
    }
    return this
  }

  build(): FeatureConfig {
    if (!this.config.id || !this.config.name || !this.config.description || !this.config.include) {
      throw new Error('Feature config must have id, name, description and include')
    }
    if (!this.config.outputConfig) {
      // Default output path if not set
      this.config.outputConfig = {
        directory: 'ai-context',
        filename: `${this.config.id}`,
        extension: 'txt',
      }
    }
    return this.config as FeatureConfig
  }
}
