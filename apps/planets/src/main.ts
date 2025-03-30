import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// --- Configuration ---
const JUPITER_SIZE_SCALE = 0.15 // Increased by 10x (from 0.015 to 0.15) to make Jupiter massive
const JUPITER_ROTATION_SPEED = Math.PI / 60 // Exactly 2π radians in 120 seconds (2 minutes)
const JUPITER_INITIAL_ROTATION_OFFSET = Math.PI * 0.5 // Show Great Red Spot initially
const JUPITER_TEXTURE_PATH = '/textures/jupiter_map.jpg'

// --- Scene Setup ---
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200000)

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg') as HTMLCanvasElement,
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace

// --- Camera Position (Fixed) ---
camera.position.set(0, 0, 0.25) // Positioned to see a portion of Jupiter's surface in detail
camera.lookAt(0, 0, 0) // Look at the center (Jupiter)

// Add orbit controls for interactive viewing
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05

// --- Lighting ---
const pointLight = new THREE.PointLight(0xffffff, 3.0, 0, 1)
pointLight.position.set(1, 0.5, 1) // Light positioned to highlight surface details
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4) // Increased ambient light
scene.add(ambientLight)

// --- Jupiter ---
const jupiterTexture = new THREE.TextureLoader().load(JUPITER_TEXTURE_PATH)
jupiterTexture.colorSpace = THREE.SRGBColorSpace // Important for correct color

const jupiterGeometry = new THREE.SphereGeometry(1 * JUPITER_SIZE_SCALE, 64, 32)
const jupiterMaterial = new THREE.MeshStandardMaterial({
  map: jupiterTexture,
  roughness: 0.6, // Slightly less rough for better light reflection
  metalness: 0.2, // Slightly more metallic for better highlights
})
const jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial)
scene.add(jupiterMesh)

// Jupiter rotation parameters
const jupiterRotationSpeedRadPerSec = JUPITER_ROTATION_SPEED
jupiterMesh.rotation.y = JUPITER_INITIAL_ROTATION_OFFSET // Initial rotation offset

// --- Animation Loop ---
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const delta = clock.getDelta() // Time since last frame in seconds

  // Rotate Jupiter
  jupiterMesh.rotation.y += jupiterRotationSpeedRadPerSec * delta

  // Update controls
  controls.update()

  renderer.render(scene, camera)
}

// --- Handle Window Resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Start animation
animate()
