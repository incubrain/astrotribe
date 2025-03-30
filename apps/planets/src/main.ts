import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PlanetRenderer } from './components/PlanetRenderer'
import { TabNavigation } from './components/TabNavigation'
import { PLANETS } from './utils/constants'
import { globalConfig } from './utils/config'

// Get canvas element
const canvas = document.querySelector('#bg') as HTMLCanvasElement
if (!canvas) {
  throw new Error('Canvas element not found')
}

// Initialize variables
let currentPlanetId = 'sun' // Default to Sun
let planetRenderer: PlanetRenderer | null = null

// Create tab navigation
const tabNavigation = new TabNavigation('tab-container', currentPlanetId, (planetId) => {
  // Handle tab change
  if (planetId !== currentPlanetId) {
    currentPlanetId = planetId
    loadPlanet(planetId)
  }
})

// Function to load a planet
function loadPlanet(planetId: string): void {
  // Clean up existing renderer if it exists
  if (planetRenderer) {
    planetRenderer.dispose()
    planetRenderer = null
  }

  // Get planet configuration
  const planetConfig = PLANETS[planetId]
  if (!planetConfig) {
    console.error(`Planet configuration for "${planetId}" not found`)
    return
  }

  // Create new planet renderer
  planetRenderer = new PlanetRenderer(planetConfig, canvas)
  // Start animation
  planetRenderer.animate()
}
// Load initial planet
loadPlanet(currentPlanetId)

// Handle window resize
window.addEventListener('resize', () => {
  if (planetRenderer) {
    // Resize is handled internally by the PlanetRenderer
  }
})
