<!-- components/planet/PlanetModel.vue -->
<script setup lang="ts">
// 1. Imports
import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const { PLANETS } = usePlanet()

// 2. Component Options
defineOptions({
  name: 'PlanetModel',
})

// 3. Props and Emits
const props = defineProps<{
  planetId: string
  autoRotate?: boolean
  scientificMode?: boolean
}>()

const emit = defineEmits<{
  'model-loaded': []
}>()

// 4. Reactive Variables
const containerRef = ref<HTMLDivElement | null>(null)
const isLoading = ref(true)
const hasError = ref(false)
const loadingProgress = ref(0)

// 5. Three.js Variables
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let controls: OrbitControls | null = null
let planet: THREE.Mesh | null = null
let rings: THREE.Mesh | null = null
let animationFrameId: number | null = null
let clock: THREE.Clock | null = null
let textureLoader: THREE.TextureLoader | null = null
let ambientLight: THREE.AmbientLight | null = null
let directionalLight: THREE.DirectionalLight | null = null

// 6. Lifecycle Hooks
onMounted(() => {
  initThreeJs()
})

onBeforeUnmount(() => {
  cleanup()
})

// 7. Watchers
watchEffect(() => {
  if (scene && props.planetId) {
    updatePlanet()
  }

  if (controls && props.autoRotate !== undefined) {
    controls.autoRotate = props.autoRotate
  }
})

// Add watcher to handle planet changes
watchEffect(() => {
  if (scene && props.planetId) {
    // Reset loading state when planet changes
    isLoading.value = true

    // Clear previous planet objects
    cleanup(false) // Don't remove renderer/scene, just planet objects

    // Create new planet with current ID
    createPlanet()
  }
})

// 8. Methods
function initThreeJs() {
  if (!containerRef.value) return

  try {
    // Create clock for animation
    clock = new THREE.Clock()

    // Create texture loader with loading manager
    const loadingManager = new THREE.LoadingManager(
      // onLoad
      () => {
        isLoading.value = false
        emit('model-loaded')
      },
      // onProgress
      (url, itemsLoaded, itemsTotal) => {
        loadingProgress.value = Math.floor((itemsLoaded / itemsTotal) * 100)
      },
      // onError
      (url) => {
        console.error(`Error loading texture: ${url}`)
        hasError.value = true
      },
    )

    textureLoader = new THREE.TextureLoader(loadingManager)

    // Create scene
    scene = new THREE.Scene()
    scene.background = null // Transparent background

    // Create camera
    const aspect = containerRef.value.clientWidth / containerRef.value.clientHeight

    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000)
    camera.position.z = 1.2 // Fixed position

    // Create renderer
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    })
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    containerRef.value.appendChild(renderer.domElement)

    if (camera && renderer) {
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.15
      controls.autoRotate = props.autoRotate ?? true
      controls.autoRotateSpeed = 0.5
      controls.enableZoom = false // Disable zoom to prevent user from zooming in/out
      controls.enablePan = false
      controls.enableRotate = false // Disable rotation to keep planet fixed
    }

    // Setup lighting
    setupLighting()

    // Create the planet
    createPlanet()

    // Add window resize listener
    window.addEventListener('resize', handleResize)

    // Start animation loop
    animate()
  } catch (error) {
    console.error('Error initializing Three.js:', error)
    hasError.value = true
    isLoading.value = false
  }
}

function setupLighting() {
  if (!scene) return

  // Ambient light for base illumination
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // Directional light to create shadows and highlights
  directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 3, 5)
  scene.add(directionalLight)

  // Add a subtle blue-ish background light
  const backLight = new THREE.DirectionalLight(0x6699ff, 0.5)
  backLight.position.set(-5, 2, -5)
  scene.add(backLight)

  // If we're rendering the Sun, add a special glow effect
  const planetConfig = PLANETS[props.planetId]
  if (planetConfig?.isStar) {
    const sunLight = new THREE.PointLight(planetConfig.color, 1.5, 3, 1)
    sunLight.position.set(0, 0, 0)
    scene.add(sunLight)
  }
}

function createPlanet() {
  if (!scene || !textureLoader) return

  const planetConfig = PLANETS[props.planetId]
  if (!planetConfig) {
    console.error(`Planet configuration for "${props.planetId}" not found`)
    hasError.value = true
    return
  }

  if (planet) {
    scene.remove(planet)
    if (planet.geometry) planet.geometry.dispose()
    if (planet.material) {
      const material = planet.material as THREE.MeshStandardMaterial
      if (material.map) material.map.dispose()
      material.dispose()
    }
    planet = null
  }

  if (rings) {
    scene.remove(rings)
    if (rings.geometry) rings.geometry.dispose()
    if (rings.material) {
      const material = rings.material as THREE.MeshStandardMaterial
      if (material.map) material.map.dispose()
      material.dispose()
    }
    rings = null
  }

  // Calculate planet size based on screen size
  const planetSize = 0.45 // Larger size for better visibility

  // Create higher detail geometry for better appearance
  const geometry = new THREE.SphereGeometry(planetSize, 128, 64) // Higher segment count

  if (planetConfig.emissive) {
    // For emissive objects like the sun
    const emissiveMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.3,
      metalness: 0.0,
      color: planetConfig.color,
      emissive: new THREE.Color(planetConfig.color),
      emissiveIntensity: planetConfig.emissiveIntensity ?? 0.7,
    })
    planet = new THREE.Mesh(geometry, emissiveMaterial)
    loadPlanetTexture(emissiveMaterial, planetConfig.texturePath)
  } else {
    // For regular planets, use physical material for better lighting
    const material = new THREE.MeshPhysicalMaterial({
      roughness: 0.5,
      metalness: 0.1,
      color: 0xffffff, // Use white so texture colors show properly
      clearcoat: 0.2, // Subtle clearcoat for atmosphere effect
    })
    planet = new THREE.Mesh(geometry, material)
    loadPlanetTexture(material, planetConfig.texturePath)
  }

  // Set axial tilt
  planet.rotation.z = THREE.MathUtils.degToRad(planetConfig.axialTilt)
  scene.add(planet)

  // Add rings if the planet has them
  if (planetConfig.hasRings && planetConfig.ringsTexturePath) {
    createRings(planetConfig)
  }

  // Add atmosphere effect for Earth
  if (props.planetId === 'earth') {
    createEarthAtmosphere(planetSize)
  }

  // Add subtle glow effect for gas giants
  if (['jupiter', 'saturn', 'uranus', 'neptune'].includes(props.planetId)) {
    createPlanetGlow(planetSize, planetConfig.color)
  }
}

function loadPlanetTexture(material: THREE.Material, texturePath: string) {
  if (!textureLoader) return

  try {
    // Load texture with progress tracking
    textureLoader.load(texturePath, (texture) => {
      // Setup texture
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 16 // Higher anisotropy for sharper textures

      // Apply to material
      if (
        material instanceof THREE.MeshStandardMaterial ||
        material instanceof THREE.MeshPhysicalMaterial
      ) {
        material.map = texture
        material.needsUpdate = true
      }
    })
  } catch (error) {
    console.error('Error loading planet texture:', error)
    hasError.value = true
  }
}

function createRings(config: PlanetConfig) {
  if (!scene || !textureLoader || !renderer) return

  try {
    // Improved rings with better scale and detail
    const innerRadius = 0.55 // Larger inner radius
    const outerRadius = 0.85 // Larger outer radius
    const segments = 128 // More segments for smoother appearance
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments)

    // Use physical material for better light interaction
    const material = new THREE.MeshPhysicalMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      roughness: 0.6,
      metalness: 0.2,
      color: 0xffffff,
      clearcoat: 0.1,
      transmission: 0.2, // Slight transparency
    })

    rings = new THREE.Mesh(geometry, material)

    // Apply the same tilt as the planet
    rings.rotation.z = THREE.MathUtils.degToRad(config.axialTilt)
    rings.rotation.x = Math.PI / 2
    scene.add(rings)

    if (config.ringsTexturePath) {
      textureLoader.load(config.ringsTexturePath, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.generateMipmaps = true
        texture.minFilter = THREE.LinearMipmapLinearFilter
        texture.magFilter = THREE.LinearFilter

        // Set max anisotropy for sharper textures
        if (renderer) {
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
        }

        material.map = texture
        material.alphaMap = texture // Use the same texture for alpha
        material.needsUpdate = true
      })
    }
  } catch (error) {
    console.error('Error creating planetary rings:', error)
  }
}

function createEarthAtmosphere(planetSize: number) {
  if (!scene) return

  try {
    // Create slightly larger sphere for atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(planetSize * 1.025, 128, 64)

    // Use special shader material for atmosphere effect
    const atmosphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x88aaff,
      transparent: true,
      opacity: 0.3,
      roughness: 1,
      metalness: 0,
      transmission: 0.95,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    })

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphere)
  } catch (error) {
    console.error('Error creating Earth atmosphere:', error)
  }
}

function createPlanetGlow(planetSize: number, planetColor: string) {
  if (!scene) return

  try {
    // Convert hex color to RGB for custom glow color
    const color = new THREE.Color(planetColor)

    // Create slightly larger sphere for glow effect
    const glowGeometry = new THREE.SphereGeometry(planetSize * 1.2, 64, 32)

    // Use custom material for glow effect
    const glowMaterial = new THREE.MeshPhysicalMaterial({
      color: color,
      transparent: true,
      opacity: 0.15,
      roughness: 1,
      metalness: 0,
      transmission: 0.98,
      side: THREE.BackSide, // Render on back side only
    })

    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
    scene.add(glowMesh)
  } catch (error) {
    console.error('Error creating planet glow effect:', error)
  }
}

function handleResize() {
  if (!containerRef.value || !camera || !renderer) return

  try {
    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight

    // Update camera aspect ratio
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    // Update renderer size
    renderer.setSize(width, height, false)
  } catch (error) {
    console.error('Error handling resize:', error)
  }
}

function animate() {
  if (!scene || !camera || !renderer || !clock) return

  try {
    animationFrameId = requestAnimationFrame(animate)

    // Skip frames if tab is inactive for performance
    if (document.hidden) return

    const delta = clock.getDelta()

    // Smoothly rotate planet
    if (props.autoRotate && planet) {
      const planetConfig = PLANETS[props.planetId]
      if (planetConfig) {
        // Calculate rotation speed based on the planet's day length
        // Faster rotation for visual appeal
        const rotationSpeed = (0.1 * (Math.PI * 2)) / planetConfig.rotationPeriod
        planet.rotation.y += rotationSpeed * delta * 60
      }
    }

    // Update controls
    if (controls) {
      controls.update()
    }

    // Render the scene
    renderer.render(scene, camera)
  } catch (error) {
    console.error('Error in animation loop:', error)

    // Stop animation on error to prevent console spam
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }
}

function updatePlanet() {
  // Full recreation of the planet with current ID
  createPlanet()
}

// Add a partial cleanup function that preserves the scene/renderer
function cleanup(full = true) {
  // Clear animation frame
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  // Cleanup planet objects
  if (planet) {
    scene?.remove(planet)
    if (planet.geometry) planet.geometry.dispose()
    if (planet.material) {
      const material = planet.material as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial
      if (material.map) material.map.dispose()
      material.dispose()
    }
    planet = null
  }

  // Cleanup rings
  if (rings) {
    scene?.remove(rings)
    if (rings.geometry) rings.geometry.dispose()
    if (rings.material) {
      const material = rings.material as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial
      if (material.map) material.map.dispose()
      material.dispose()
    }
    rings = null
  }

  // Clean up atmosphere and glow (remove all meshes except planet and rings)
  if (scene) {
    const objectsToRemove = []
    for (let i = 0; i < scene.children.length; i++) {
      const object = scene.children[i]
      if (object !== planet && object !== rings && object instanceof THREE.Mesh) {
        objectsToRemove.push(object)
      }
    }

    // Remove collected objects
    for (const object of objectsToRemove) {
      scene.remove(object)
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        const material = object.material as THREE.Material | THREE.Material[]
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose())
        } else {
          material.dispose()
        }
      }
    }
  }

  // Only perform full cleanup when component is unmounting
  if (full && scene) {
    // Remove event listeners
    window.removeEventListener('resize', handleResize)

    // Clean up lights
    if (ambientLight) {
      scene.remove(ambientLight)
      ambientLight = null
    }

    if (directionalLight) {
      scene.remove(directionalLight)
      directionalLight = null
    }

    // Remove all scene objects
    while (scene.children.length > 0) {
      const object = scene.children[0]
      scene.remove(object)
    }

    // Dispose controls
    if (controls) {
      controls.dispose()
      controls = null
    }

    // Dispose renderer
    if (renderer) {
      renderer.renderLists.dispose()
      renderer.dispose()
      if (containerRef.value) {
        const canvas = containerRef.value.querySelector('canvas')
        if (canvas) {
          containerRef.value.removeChild(canvas)
        }
      }
      renderer = null
    }

    // Clear references
    scene = null
    camera = null
    clock = null
    textureLoader = null
  }
}
</script>

<template>
  <div
    class="planet-container w-full max-w-2xl mx-auto aspect-square relative overflow-visible flex justify-center items-center"
  >
    <div
      ref="containerRef"
      class="w-full h-full max-h-[440px] relative"
    ></div>
    <!-- Loading overlay -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex flex-col items-center justify-center z-10 bg-primary-950/70 backdrop-blur-sm rounded-full"
    >
      <div
        class="w-16 h-16 border-4 border-t-transparent border-primary-400 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-primary-400 font-medium">Loading {{ loadingProgress }}%</p>
    </div>

    <!-- Error message -->
    <div
      v-if="hasError"
      class="absolute inset-0 flex flex-col items-center justify-center z-10 bg-primary-950/70 backdrop-blur-sm rounded-lg"
    >
      <div class="text-4xl mb-4">⚠️</div>
      <p class="text-red-400 font-medium mb-2">Failed to load planet model</p>
      <p class="text-gray-300 text-sm">Please refresh the page to try again</p>
    </div>
  </div>
</template>

<style scoped>
/* Add styling to ensure the canvas takes up the full container */
:deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  border-radius: 9999px; /* Make canvas round for planet */
}

/* Add a subtle glow effect to the container - fixed to prevent cutoff */
.planet-container {
  position: relative;
  z-index: 1;
}

.planet-container::after {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(0, 0, 0, 0) 70%);
  z-index: -1;
  pointer-events: none;
}
</style>
