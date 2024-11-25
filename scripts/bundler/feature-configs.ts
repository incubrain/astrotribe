import type { FeatureConfig } from './bundler-types'

export const COMMON_CONFIGS = {
  nuxtApp: {
    includes: ['nuxt.config.ts', 'app.config.ts', 'tailwind.config.ts'],
  },
  stateManagement: {
    includes: ['apps/**/stores/**', 'apps/**/state/**'],
  },
  api: {
    includes: ['apps/**/server/api/**', 'apps/**/server/routes/**'],
  },
  types: {
    includes: ['apps/**/types/**', 'libs/**/types/**'],
    excludes: ['**/*.test.*', '**/*.spec.*'],
  },
  composables: {
    includes: ['apps/**/composables/**', 'libs/**/composables/**'],
  },
}

const BASE_CONFIG = {
  includes: [],
  excludes: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.nuxt/**',
    '**/coverage/**',
    '**/.git/**',
    '**/tmp/**',
    '**/.cache/**',
    '**/logs/**',
    '**/build/**',
    '**/*.test.*',
    '**/*.spec.*',
    '**/*.stories.*',
  ],
}

type ConfigKey = keyof typeof COMMON_CONFIGS
type ConfigProperty = 'includes' | 'excludes'

// configs/feature-builder.ts
export class FeatureConfigBuilder {
  private config: Partial<FeatureConfig> = {}

  description(desc: string) {
    this.config.description = desc
    return this
  }

  patterns(patterns: string[]) {
    this.config.includes = patterns
    return this
  }

  withCommonConfigs(...configs: ConfigKey[]) {
    this.config.includes = this.combinePatterns(this.config.includes || [], configs, 'includes')
    return this
  }

  excludes(patterns: string[]) {
    this.config.excludes = [...BASE_CONFIG.excludes, ...patterns]
    return this
  }

  getConfigValues(configs: ConfigKey[], property: ConfigProperty): string[] {
    return configs.flatMap((key) => COMMON_CONFIGS[key][property] ?? [])
  }

  combinePatterns(
    patterns: string[],
    commonConfigs: ConfigKey[],
    property: ConfigProperty,
  ): string[] {
    return [...patterns, ...this.getConfigValues(commonConfigs, property)]
  }

  relatedTo(...features: string[]) {
    this.config.relatedFeatures = features
    return this
  }

  build(): FeatureConfig {
    if (!this.config.description || !this.config.includes) {
      throw new Error('Feature config must have description and includes')
    }
    return this.config as FeatureConfig
  }
}

// Usage:
export const FEATURE_CONFIGS: Record<string, FeatureConfig> = {
  bookmarks: new FeatureConfigBuilder()
    .description('Bookmark management and related features')
    .patterns([
      'apps/**/bookmarks/**',
      'apps/**/components/**/bookmark*',
      'apps/**/composables/use-bookmark*',
      'apps/**/stores/bookmark*',
      'libs/shared/bookmarks/**',
    ])
    .withCommonConfigs('api', 'types', 'stateManagement')
    .excludes(['**/bookmark.test.*', '**/bookmark.spec.*', '**/bookmark.stories.*'])
    .relatedTo('collections', 'tagging')
    .build(),

  auth: new FeatureConfigBuilder()
    .description('Authentication and authorization features')
    .patterns([
      'apps/**/auth/**',
      'apps/**/middleware/auth*',
      'libs/auth/**',
      'apps/**/composables/use-auth*',
    ])
    .withCommonConfigs('api', 'types', 'stateManagement', 'nuxtApp')
    .excludes(['**/auth.test.*', '**/auth.spec.*', '**/auth.stories.*'])
    .relatedTo('permissions', 'user-management')
    .build(),
}
