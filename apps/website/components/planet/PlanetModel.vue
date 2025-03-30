<script setup lang="ts">
// 1. Imports
import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Note: For simplicity, this component is using a placeholder implementation since
// Three.js requires additional setup and actual model files. In production,
// you'd want to use proper 3D models, textures, and lighting effects.

// 2. Component Options
defineOptions({
  name: 'PlanetModel',
})

// 3. Props and Emits
const props = defineProps<{
  planetId: string
  autoRotate?: boolean
}>()

// 4. Reactive Variables
const containerRef = ref<HTMLDivElement | null>(null)
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let controls: OrbitControls | null = null
let planet: THREE.Mesh | null = null
let animationFrameId: number | null = null

// 5. Lifecycle Hooks
onMounted(() => {
  initThreeJs()
})

onBeforeUnmount(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }

  if (renderer) {
    renderer.dispose()
  }

  // Remove any event listeners
  window.removeEventListener('resize', handleResize)
})

// 6. Methods
function initThreeJs() {
  if (!containerRef.value) return

  // Create scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  // Create camera
  const aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
  camera.position.z = 5

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  containerRef.value.appendChild(renderer.domElement)

  // Add orbit controls
  if (camera && renderer) {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = props.autoRotate || false
    controls.autoRotateSpeed = 1.0
  }

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 2)
  scene.add(ambientLight)

  // Add directional light (like the sun)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 3, 5)
  scene.add(directionalLight)

  // Create the planet (placeholder sphere)
  createPlanet()

  // Add window resize listener
  window.addEventListener('resize', handleResize)

  // Start animation loop
  animate()
}

function createPlanet() {
  if (!scene) return

  // Remove existing planet if any
  if (planet) {
    scene.remove(planet)
  }

  // Load texture based on planetId
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(
    `/images/planets/${props.planetId}_texture.jpg`,
    undefined,
    undefined,
    (error) => {
      console.error('Error loading planet texture:', error)
      // Load a default texture if the planet texture fails
      return textureLoader.load('/images/planets/default_texture.jpg')
    },
  )

  // Create geometry and material
  const geometry = new THREE.SphereGeometry(2, 64, 64)
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.7,
    metalness: 0.0,
  })

  // Create mesh
  planet = new THREE.Mesh(geometry, material)
  scene?.add(planet)

  // Add planet-specific features (rings for Saturn, etc.)
  addPlanetFeatures()
}

function addPlanetFeatures() {
  if (!scene || !planet) return

  // Add planet-specific features
  if (props.planetId === 'saturn') {
    // Add rings for Saturn
    const ringGeometry = new THREE.RingGeometry(2.5, 4, 64)
    const ringTexture = new THREE.TextureLoader().load('/images/planets/saturn_rings.jpg')
    const ringMaterial = new THREE.MeshStandardMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    })
    const rings = new THREE.Mesh(ringGeometry, ringMaterial)
    rings.rotation.x = Math.PI / 2
    planet.add(rings)
  }

  if (props.planetId === 'jupiter') {
    // Add Great Red Spot effect
    // This is a simplified approach - in a real implementation,
    // this would be better handled with a custom shader
    const spotGeometry = new THREE.SphereGeometry(0.3, 32, 32)
    const spotMaterial = new THREE.MeshStandardMaterial({ color: 0xcc3311 })
    const redSpot = new THREE.Mesh(spotGeometry, spotMaterial)
    redSpot.position.set(1.9, 0.3, 0.5)
    planet.add(redSpot)
  }
}

function handleResize() {
  if (!containerRef.value || !camera || !renderer) return

  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
}

function animate() {
  animationFrameId = requestAnimationFrame(animate)

  if (controls) {
    controls.update()
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

// 7. Watch for prop changes
watchEffect(() => {
  if (scene && props.planetId) {
    createPlanet()
  }

  if (controls && props.autoRotate !== undefined) {
    controls.autoRotate = props.autoRotate
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="planet-model-container w-full h-full min-h-[400px] rounded-full overflow-hidden"
  >
    <!-- Three.js will render in this container -->
    <!-- Fallback display if Three.js initialization fails -->
    <div
      v-if="!scene"
      class="flex items-center justify-center h-full w-full bg-black"
    >
      <p class="text-gray-400">Loading {{ planetId }} model...</p>
    </div>
  </div>
</template>

<style scoped>
.planet-model-container {
  position: relative;
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
}

.planet-model-container canvas {
  display: block;
}
</style>
