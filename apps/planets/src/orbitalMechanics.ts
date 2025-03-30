// src/orbitalMechanics.ts
import * as THREE from 'three'
import type { MoonData } from './moonData.js'
import { JUPITER_GM, J2000_EPOCH } from './moonData.js'

// Basic iterative solver for Kepler's Equation: M = E - e * sin(E)
// Finds Eccentric Anomaly (E) from Mean Anomaly (M) and eccentricity (e)
function solveKepler(M: number, e: number, maxIter = 100, tolerance = 1e-7): number {
  // Use M as the initial guess for E (good for small e)
  let E = M
  for (let i = 0; i < maxIter; i++) {
    const deltaE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E))
    E -= deltaE
    if (Math.abs(deltaE) < tolerance) {
      break // Converged
    }
  }
  return E
}

// Calculate position vector in 3D space from orbital elements
export function calculateMoonPosition(
  moon: MoonData,
  simulationTimeSeconds: number, // Time elapsed in simulation since J2000
  distanceScale: number, // Factor to scale down orbital distances
): THREE.Vector3 {
  // 1. Convert angles from degrees to radians
  const iRad = THREE.MathUtils.degToRad(moon.i)
  const omegaRad = THREE.MathUtils.degToRad(moon.omega)
  const OmegaRad = THREE.MathUtils.degToRad(moon.Omega)
  const M0Rad = THREE.MathUtils.degToRad(moon.M0)

  // 2. Calculate Mean Motion (n) if not pre-calculated
  // n = sqrt(GM / a^3) in radians per second
  const n = Math.sqrt(JUPITER_GM / Math.pow(moon.a, 3))

  // 3. Calculate Mean Anomaly (M) at the current time
  const M = M0Rad + n * simulationTimeSeconds

  // 4. Solve Kepler's Equation for Eccentric Anomaly (E)
  const E = solveKepler(M, moon.e)

  // 5. Calculate True Anomaly (nu)
  // Using tan(nu/2) = sqrt((1+e)/(1-e)) * tan(E/2)
  const tanNuOver2 = Math.sqrt((1 + moon.e) / (1 - moon.e)) * Math.tan(E / 2)
  const nu = 2 * Math.atan(tanNuOver2)
  // Ensure nu is in the correct quadrant if needed (often handled by atan2)
  // Alternatively, calculate x, y in orbital plane directly from E:
  // x_orb = a * (cos(E) - e)
  // y_orb = a * sqrt(1 - e*e) * sin(E)
  // nu = atan2(y_orb, x_orb)

  // 6. Calculate distance from Jupiter (r)
  const r = moon.a * (1 - moon.e * Math.cos(E))

  // 7. Calculate position in the orbital plane (perifocal frame)
  const x_orb = r * Math.cos(nu)
  const y_orb = r * Math.sin(nu)
  // z_orb is 0 in the orbital plane

  // 8. Rotate to Jupiter's equatorial or inertial frame (J2000)
  // This involves 3 rotations:
  // - Rotate by argument of periapsis (omega) around z-axis
  // - Rotate by inclination (i) around x-axis (new x-axis after first rotation)
  // - Rotate by longitude of ascending node (Omega) around original z-axis
  const cosOmega = Math.cos(omegaRad)
  const sinOmega = Math.sin(omegaRad)
  const cosI = Math.cos(iRad)
  const sinI = Math.sin(iRad)
  const cosBigOmega = Math.cos(OmegaRad)
  const sinBigOmega = Math.sin(OmegaRad)

  // Transformation matrix components (P, Q vectors approach)
  const Px = cosOmega * cosBigOmega - sinOmega * sinBigOmega * cosI
  const Py = cosOmega * sinBigOmega + sinOmega * cosBigOmega * cosI
  const Pz = sinOmega * sinI

  const Qx = -sinOmega * cosBigOmega - cosOmega * sinBigOmega * cosI
  const Qy = -sinOmega * sinBigOmega + cosOmega * cosBigOmega * cosI
  const Qz = cosOmega * sinI

  // Calculate final position vector (relative to Jupiter)
  const x = x_orb * Px + y_orb * Qx
  const y = x_orb * Py + y_orb * Qy
  const z = x_orb * Pz + y_orb * Qz

  // 9. Apply scaling
  // Simple linear scaling for now. Logarithmic could be:
  // const scaleFactor = 10000; // Adjust as needed
  // const logBase = 2;
  // const scaledX = Math.sign(x) * scaleFactor * Math.log(Math.abs(x / SomeMinDistance) + 1) / Math.log(logBase);
  // etc.
  const pos = new THREE.Vector3(x, y, z)
  pos.multiplyScalar(1 / distanceScale) // Scale down the position

  return pos
}
