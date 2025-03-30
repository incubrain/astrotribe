// src/moonData.ts

export interface MoonData {
  name: string
  a: number // Semi-major axis (km)
  e: number // Eccentricity (dimensionless)
  i: number // Inclination (degrees - will convert to radians)
  omega: number // Argument of periapsis (degrees)
  Omega: number // Longitude of ascending node (degrees)
  M0: number // Mean anomaly at epoch J2000 (degrees)
  diameter: number // Diameter (km) - Use 0 or small value if unknown
  color: string | number // Hex color for the mesh material
  // Optional: Add discovery info, group etc. for legend
  discoveryInfo?: string
}

// === IMPORTANT ===
// This is data for the Galilean moons and some additional significant moons.
// You can populate this array with data for all 95 moons
// from a reliable source (e.g., NASA HORIZONS, PDS).
// Ensure units are consistent (km, degrees for angles initially).
// =================

export const moons: MoonData[] = [
  // --- GALILEAN MOONS (Example Data - Verify with precise sources) ---
  {
    name: 'Io',
    a: 421700, // km
    e: 0.0041,
    i: 0.05, // degrees
    omega: 84.2, // degrees (Argument of Perihelion)
    Omega: 43.8, // degrees (Longitude of Ascending Node)
    M0: 193.2, // degrees (Mean Anomaly at J2000)
    diameter: 3643, // km
    color: 0xffff00, // Yellowish
    discoveryInfo: 'Galileo Galilei, 1610',
  },
  {
    name: 'Europa',
    a: 671034,
    e: 0.0094,
    i: 0.471,
    omega: 137.7,
    Omega: 80.4,
    M0: 70.8,
    diameter: 3122,
    color: 0xadd8e6, // Light Blue
    discoveryInfo: 'Galileo Galilei, 1610',
  },
  {
    name: 'Ganymede',
    a: 1070412,
    e: 0.0013,
    i: 0.204,
    omega: 184.7,
    Omega: 270.8,
    M0: 198.9,
    diameter: 5268,
    color: 0xd2b48c, // Tan / Brownish
    discoveryInfo: 'Galileo Galilei, 1610',
  },
  {
    name: 'Callisto',
    a: 1882709,
    e: 0.0074,
    i: 0.205, // Note: Inclination often given relative to Jupiter's equator or Laplace plane. Ensure consistency.
    omega: 262.3,
    Omega: 185.9,
    M0: 311.1,
    diameter: 4821,
    color: 0xa9a9a9, // Dark Grey
    discoveryInfo: 'Galileo Galilei, 1610',
  },

  // --- INNER MOONS (Amalthea Group) ---
  {
    name: 'Amalthea',
    a: 181366,
    e: 0.0032,
    i: 0.374,
    omega: 275.6, // Often highly variable or poorly defined for inner moons
    Omega: 29.5,
    M0: 210.5, // Example M0
    diameter: 167, // Mean diameter (irregular shape)
    color: 0xff4500, // Reddish-Orange
    discoveryInfo: 'E. E. Barnard, 1892',
  },
  {
    name: 'Thebe',
    a: 221889,
    e: 0.0175,
    i: 1.076,
    omega: 240.0, // Example
    Omega: 300.0, // Example
    M0: 150.0, // Example M0
    diameter: 99, // Mean diameter
    color: 0x8b4513, // Saddle Brown
    discoveryInfo: 'S. Synnott (Voyager 1), 1979',
  },

  // --- LARGER IRREGULAR MOONS ---
  {
    name: 'Himalia', // Prograde irregular
    a: 11461000, // Note the much larger distance!
    e: 0.1623,
    i: 27.5, // High inclination
    omega: 20.9,
    Omega: 312.7,
    M0: 115.3,
    diameter: 170, // Approx diameter
    color: 0x808080, // Grey
    discoveryInfo: 'C. D. Perrine, 1904',
  },
  // Add more moons as needed
]

// --- Constants ---
export const JUPITER_RADIUS_KM = 69911 // Mean radius
export const JUPITER_GM = 1.26686534e8 // km^3/s^2 (Gravitational Parameter)
export const JUPITER_ROTATION_PERIOD_HOURS = 9.925
export const J2000_EPOCH = Date.UTC(2000, 0, 1, 12, 0, 0) // Milliseconds since Unix epoch
