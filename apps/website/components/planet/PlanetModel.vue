<script setup lang="ts">
// 1. Imports
import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PLANETS, type PlanetConfig, DEFAULT_SIZE } from '../../data/planets'
import { applyOverrides } from '../../utils/planetConfig'

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

// 4. Reactive Variables
const containerRef = ref<HTMLDivElement | null>(null)
const isLoading = ref(true)
const hasError = ref(false)

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
const texturesLoaded = false

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

// 8. Methods
function initThreeJs() {
  if (!containerRef.value) return

  try {
    // Create clock for animation
    clock = new THREE.Clock()
    // Create texture loader
    textureLoader = new THREE.TextureLoader()

    // Create scene
    scene = new THREE.Scene()
    // Set transparent background (THREE.Color only accepts RGB values, not alpha)
    scene.background = null

    // Create camera
    const aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000)
    camera.position.z = 0.75 // Move camera farther away to make planet appear smaller

    // Create renderer
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    }) // Enable alpha for transparency
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    containerRef.value.appendChild(renderer.domElement)

    // Add orbit controls
    if (camera && renderer) {
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.15
      controls.autoRotate = props.autoRotate ?? false
      controls.autoRotateSpeed = 0.4
      controls.enableZoom = false
      controls.enablePan = false
      controls.enableRotate = false
    }

    // Setup lighting
    setupLighting()

    // Create the planet
    createPlanet()

    // Add window resize listener
    window.addEventListener('resize', handleResize)

    // Start animation loop
    animate()
    isLoading.value = false
  } catch (error) {
    console.error('Error initializing Three.js:', error)
    hasError.value = true
    isLoading.value = false
  }
}

function setupLighting() {
  if (!scene) return

  // Use only ambient light for completely even illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
  scene.add(ambientLight)

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

  let config = planetConfig
  if (props.scientificMode) {
    config = applyOverrides(planetConfig, {
      // Add scientific mode overrides here
    })
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

  // Calculate planet size to be 90% of the canvas height
  const containerHeight = containerRef.value?.clientHeight || 480
  const planetSize = 0.25 // Reduced size to fit within canvas

  const geometry = new THREE.SphereGeometry(planetSize, 64, 32)

  const material = new THREE.MeshBasicMaterial({
    color: config.color,
  })

  if (config.emissive) {
    // For emissive objects like the sun, keep using MeshStandardMaterial
    const emissiveMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.3,
      metalness: 0.0,
      color: config.color,
      emissive: new THREE.Color(config.color),
      emissiveIntensity: config.emissiveIntensity ?? 0.5,
    })
    planet = new THREE.Mesh(geometry, emissiveMaterial)
    loadPlanetTexture(emissiveMaterial, config.texturePath)
  } else {
    // For regular planets, use MeshBasicMaterial for even lighting
    planet = new THREE.Mesh(geometry, material)
    loadPlanetTexture(material, config.texturePath)
  }

  planet.rotation.z = THREE.MathUtils.degToRad(config.axialTilt)
  scene.add(planet)

  if (config.hasRings && config.ringsTexturePath) {
    createRings(config)
  }
}

// In PlanetModel.vue
const textureCache = {} as Record<string, THREE.Texture>

function loadPlanetTexture(material: THREE.Material, texturePath: string) {
  if (textureCache[texturePath]) {
    // Use cached texture
    if (
      material instanceof THREE.MeshStandardMaterial ||
      material instanceof THREE.MeshBasicMaterial
    ) {
      material.map = textureCache[texturePath]
      material.needsUpdate = true
    }
    return
  }

  // Load new texture
  textureLoader?.load(texturePath, (texture) => {
    // Setup texture
    texture.colorSpace = THREE.SRGBColorSpace
    // Cache texture
    textureCache[texturePath] = texture

    // Apply to material
    if (
      material instanceof THREE.MeshStandardMaterial ||
      material instanceof THREE.MeshBasicMaterial
    ) {
      material.map = texture
      material.needsUpdate = true
    }
  })
}

function createRings(config: PlanetConfig) {
  if (!scene || !textureLoader || !renderer) return

  // Scale rings to match the planet size
  const innerRadius = 0.3
  const outerRadius = 0.5
  const segments = 64
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments)

  const material = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    roughness: 0.8,
    metalness: 0.1,
    color: 0xffffff,
  })

  rings = new THREE.Mesh(geometry, material)
  rings.rotation.z = THREE.MathUtils.degToRad(config.axialTilt)
  rings.rotation.x = Math.PI / 2
  scene.add(rings)

  if (config.ringsTexturePath) {
    textureLoader.load(
      config.ringsTexturePath,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.generateMipmaps = true
        texture.minFilter = THREE.LinearMipmapLinearFilter
        texture.magFilter = THREE.LinearFilter
        if (renderer) {
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
        }

        material.map = texture
        material.needsUpdate = true
      },
      undefined,
      (error) => {
        console.error('Error loading rings texture:', error)
      },
    )
  }
}

function handleResize() {
  if (!containerRef.value || !camera || !renderer) return

  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height, false)
}

// In PlanetModel.vue
function animate() {
  if (!scene || !camera || !renderer || !clock || !planet) return

  animationFrameId = requestAnimationFrame(animate)

  // Skip frames if tab is inactive
  if (document.hidden) return

  const delta = clock.getDelta()

  // Only rotate if autoRotate is enabled
  if (props.autoRotate && planet) {
    const planetConfig = PLANETS[props.planetId]
    if (planetConfig) {
      const rotationSpeed = (Math.PI * 2) / planetConfig.rotationPeriod
      planet.rotation.y += rotationSpeed * delta
    }
  }

  if (controls) {
    controls.update()
  }

  // Only render when needed
  renderer.render(scene, camera)
}

function updatePlanet() {
  createPlanet()
}

watch(
  () => props.planetId,
  (newPlanetId, oldPlanetId) => {
    console.log(`Planet changing from ${oldPlanetId} to ${newPlanetId}`)
    if (scene) {
      // Force a complete recreation of the planet
      cleanup(false) // Don't remove renderer/scene, just planet objects
      createPlanet()
    }
  },
  { immediate: false },
)

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
      const material = planet.material as THREE.MeshStandardMaterial | THREE.MeshBasicMaterial
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
      const material = rings.material as THREE.MeshStandardMaterial
      if (material.map) material.map.dispose()
      material.dispose()
    }
    rings = null
  }

  // Only perform full cleanup when component is unmounting
  if (full && scene) {
    // Remove event listeners
    window.removeEventListener('resize', handleResize)

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
    ref="containerRef"
    class="w-full h-full min-h-[480px] relative z-[1000] overflow-visible"
  >
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
}
</style>
