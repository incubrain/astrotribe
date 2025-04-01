import type { ConfigOverrides, PlanetConfig } from '../data/planets'

/**
 * Applies configuration overrides to the default planet configuration
 * This allows for scientific mode without implementing it yet
 */
export function applyOverrides(config: PlanetConfig, overrides?: ConfigOverrides): PlanetConfig {
  if (!overrides) {
    return { ...config }
  }

  return {
    ...config,
    ...overrides,
  }
}

/**
 * Global configuration state
 */
export const globalConfig = {
  scientificMode: false,
  // Add more global configuration options as needed
}
