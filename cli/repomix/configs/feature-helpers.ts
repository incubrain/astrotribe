// cli/configs/feature-utils.ts

import pluralize from 'pluralize'
import type { FeatureConfig } from '../types/configs'
import { FEATURE_CONFIGS } from './features'

export const findFeatureByTerm = (term: string): FeatureConfig | undefined => {
  const searchTerms = [
    term.toLowerCase(),
    pluralize.singular(term.toLowerCase()),
    pluralize.plural(term.toLowerCase()),
  ]

  return Object.values(FEATURE_CONFIGS).find((config) =>
    searchTerms.some(
      (searchTerm) =>
        config.id === searchTerm ||
        config.name.toLowerCase() === searchTerm ||
        config.include.some((pattern) => pattern.toLowerCase().includes(searchTerm)),
    ),
  )
}
