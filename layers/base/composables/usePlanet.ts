// Planet data with scientific corrections based on fact check
export interface PlanetConfig {
  id: string
  name: string
  diameter: number // in km
  gravity: number // relative to Earth
  rotationPeriod: number // in seconds for one full rotation
  orbitalPeriod: number // in Earth days
  axialTilt: number // in degrees
  moons: number // count of confirmed moons
  hasRings: boolean
  texturePath: string
  ringsTexturePath?: string
  color: string // UI accent color
  isStar?: boolean
  emissive?: boolean
  emissiveIntensity?: number
}

export interface ConfigOverrides {
  size?: number
  rotationPeriod?: number
}

// Default values for consistent visualization
export const DEFAULT_SIZE = 0.5 // Same size for all planets
export const DEFAULT_ROTATION_PERIOD = 120 // 2 minutes for all planets by default

export const PLANETS: Record<string, PlanetConfig> = {
  sun: {
    id: 'sun',
    name: 'Sun',
    diameter: 1392700,
    gravity: 27.94, // Relative to Earth
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    orbitalPeriod: 0, // The Sun doesn't orbit
    axialTilt: 7.25,
    moons: 0,
    hasRings: false,
    texturePath: '/textures/sun-map.jpg',
    color: '#FDB813',
    isStar: true,
    emissive: true,
    emissiveIntensity: 0.8,
  },
  mercury: {
    id: 'mercury',
    name: 'Mercury',
    diameter: 4879,
    gravity: 0.38,
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    orbitalPeriod: 88,
    axialTilt: 0.03,
    moons: 0,
    hasRings: false,
    texturePath: '/textures/mercury-map.jpg',
    color: '#A5A5A5',
  },
  venus: {
    id: 'venus',
    name: 'Venus',
    diameter: 12104,
    gravity: 0.91,
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    orbitalPeriod: 225,
    axialTilt: 177.3,
    moons: 0,
    hasRings: false,
    texturePath: '/textures/venus-map.jpg',
    color: '#E6C073',
  },
  earth: {
    id: 'earth',
    name: 'Earth',
    diameter: 12742, // Updated from 12756km
    gravity: 1.0,
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    orbitalPeriod: 365.25,
    axialTilt: 23.4,
    moons: 1,
    hasRings: false,
    texturePath: '/textures/earth-map.jpg',
    color: '#3D85C6',
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    diameter: 6792,
    gravity: 0.38,
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    orbitalPeriod: 687,
    axialTilt: 25.2,
    moons: 2,
    hasRings: false,
    texturePath: '/textures/mars-map.jpg',
    color: '#CC4125',
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    diameter: 142984,
    gravity: 2.53, // Updated from 2.34g
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    orbitalPeriod: 4333,
    axialTilt: 3.1,
    moons: 95, // Updated from previous count
    hasRings: true, // Jupiter has faint rings
    texturePath: '/textures/jupiter-map.jpg',
    color: '#E07E38',
  },
  saturn: {
    id: 'saturn',
    name: 'Saturn',
    diameter: 120536,
    gravity: 1.06, // Updated from 0.93g
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    orbitalPeriod: 10759,
    axialTilt: 26.7,
    moons: 145, // 145 named, 270+ confirmed
    hasRings: true,
    texturePath: '/textures/saturn-map.jpg',
    ringsTexturePath: '/textures/saturn-rings.png',
    color: '#D4B46A',
  },
  uranus: {
    id: 'uranus',
    name: 'Uranus',
    diameter: 51118,
    gravity: 0.89,
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    orbitalPeriod: 30687,
    axialTilt: 97.8, // Extreme tilt
    moons: 28, // Updated from 27
    hasRings: true, // Uranus has faint rings
    texturePath: '/textures/uranus-map.jpg',
    color: '#5CACCE',
  },
  neptune: {
    id: 'neptune',
    name: 'Neptune',
    diameter: 49528,
    gravity: 1.14, // Updated from 1.12g
    rotationPeriod: DEFAULT_ROTATION_PERIOD,
    orbitalPeriod: 60190,
    axialTilt: 28.3,
    moons: 16, // Updated from 14
    hasRings: true, // Neptune has faint rings
    texturePath: '/textures/neptune-map.jpg',
    color: '#3953A4',
  },
}

export default function usePlanet() {
  const getPlanet = (planetId: string, overrides: ConfigOverrides = {}) => {
    const planet = PLANETS[planetId]
    if (!planet) {
      throw new Error(`Planet with ID ${planetId} not found`)
    }

    return {
      ...planet,
      size: overrides.size || DEFAULT_SIZE,
      rotationPeriod: overrides.rotationPeriod || DEFAULT_ROTATION_PERIOD,
    }
  }

  return { getPlanet, PLANETS }
}
