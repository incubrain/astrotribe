// cli/configs/features/index.ts
import type { FeatureConfig } from '../../types'
import { authConfig } from './auth'
import { bookmarksConfig } from './bookmarks'

if (!authConfig || !bookmarksConfig) {
  throw new Error('Feature configs not properly initialized')
}

export const FEATURE_CONFIGS: Record<string, FeatureConfig> = {
  bookmarks: bookmarksConfig,
  auth: authConfig,
} as const

if (process.env.DEBUG === 'true') {
  console.log('Available features:', Object.keys(FEATURE_CONFIGS))
}

export const getFeatureConfig = (id: string): FeatureConfig | undefined => {
  const config = FEATURE_CONFIGS[id]
  if (process.env.DEBUG === 'true') {
    console.log(`Getting feature config for ${id}:`, config ? 'found' : 'not found')
  }
  return config
}

export const getFeaturesByPattern = (pattern: string): FeatureConfig[] =>
  Object.values(FEATURE_CONFIGS).filter((config) =>
    config.include.some((include) => include.includes(pattern)),
  )

export const getRelatedFeatures = (id: string): FeatureConfig[] => {
  const config = FEATURE_CONFIGS[id]
  return (
    config?.relatedFeatures
      ?.map((id) => FEATURE_CONFIGS[id])
      .filter((c): c is FeatureConfig => !!c) ?? []
  )
}
