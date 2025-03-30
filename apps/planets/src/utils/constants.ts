// Shared constants for all planets
export interface PlanetConfig {
  id: string
  name: string
  texturePath: string
  rotationPeriod: number // In seconds for one full rotation
  axialTilt: number // Degrees
  color: string // Accent color for UI
  hasRings?: boolean // For Saturn
  ringsTexturePath?: string
}

export interface ConfigOverrides {
  size?: number // For scientific mode
  rotationPeriod?: number // For scientific mode
  // Other potential overrides
}

export const DEFAULT_SIZE = 0.15 // Same size for all planets
export const DEFAULT_ROTATION_PERIOD = 120 // 2 minutes for all planets by default

export const PLANETS: Record<string, PlanetConfig> = {
  mercury: {
    id: 'mercury',
    name: 'Mercury',
    texturePath: '/textures/mercury_map.jpg',
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    axialTilt: 0.03,
    color: '#A5A5A5',
  },
  venus: {
    id: 'venus',
    name: 'Venus',
    texturePath: '/textures/venus_map.jpg',
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    axialTilt: 177.3,
    color: '#E6C073',
  },
  earth: {
    id: 'earth',
    name: 'Earth',
    texturePath: '/textures/earth_map.jpg',
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    axialTilt: 23.4,
    color: '#3D85C6',
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    texturePath: '/textures/mars_map.jpg',
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    axialTilt: 25.2,
    color: '#CC4125',
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    texturePath: '/textures/jupiter_map.jpg',
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    axialTilt: 3.1,
    color: '#E07E38',
  },
  saturn: {
    id: 'saturn',
    name: 'Saturn',
    texturePath: '/textures/saturn_map.jpg',
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    axialTilt: 26.7,
    color: '#D4B46A',
    hasRings: true,
    ringsTexturePath: '/textures/saturn_rings.png',
  },
  uranus: {
    id: 'uranus',
    name: 'Uranus',
    texturePath: '/textures/uranus_map.jpg',
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    axialTilt: 97.8,
    color: '#5CACCE',
  },
  neptune: {
    id: 'neptune',
    name: 'Neptune',
    texturePath: '/textures/neptune_map.jpg',
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    axialTilt: 28.3,
    color: '#3953A4',
  },
}
