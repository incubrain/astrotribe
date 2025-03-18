<template>
  <div
    ref="container"
    class="fixed top-0 left-0 w-screen h-screen bg-black z-0"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as THREE from 'three'

defineOptions({ name: 'StarfieldBackground' })

const container = ref<HTMLDivElement | null>(null)
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let stars: THREE.Points | null = null
let animationFrameId: number | null = null

const STAR_COUNT = 1000
// Updated colors: white, warm white, bluish white, reddish white
const COLORS = [0xffffff, 0xffffea, 0xddddff, 0xffcccc]

function createCircleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const context = canvas.getContext('2d')
  if (!context) return null
  const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.9)')
  gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.4)')
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.1)')
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.05)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 64, 64)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function isMobileDevice() {
  return false
}

function init() {
  if (isMobileDevice()) return
  if (!container.value) return

  const width = container.value.clientWidth
  const height = container.value.clientHeight
  if (width === 0 || height === 0) return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 50

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.domElement)

  // Create geometry and attributes
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(STAR_COUNT * 3)
  const colors = new Float32Array(STAR_COUNT * 3)
  const sizes = new Float32Array(STAR_COUNT) // This will be updated every frame
  const baseSizes = new Float32Array(STAR_COUNT) // Constant per-star size

  for (let i = 0; i < STAR_COUNT; i++) {
    const i3 = i * 3
    const radius = 150 + Math.random() * 50
    // Distribute stars over the full sphere
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.cos(phi) - 30 // vertical offset
    positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    const color = new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)])
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b

    // Increase the base star size range slightly
    baseSizes[i] = 0.7 + Math.random() * 2.8
    // Initialize the size attribute to the base size
    sizes[i] = baseSizes[i]
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('baseSize', new THREE.BufferAttribute(baseSizes, 1))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const starTexture = createCircleTexture()

  // Use a custom shader to allow per-vertex sizes
  const material = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: starTexture },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // Adjust size based on distance
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      void main() {
        vec4 texColor = texture2D(pointTexture, gl_PointCoord);
        gl_FragColor = vec4(vColor, 1.0) * texColor;
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  stars = new THREE.Points(geometry, material)
  scene.add(stars)
  window.addEventListener('resize', onResize)
}

function animate(time: number) {
  if (!scene || !camera || !renderer || !stars) return
  const positions = stars.geometry.attributes.position.array as Float32Array
  const sizes = stars.geometry.attributes.size.array as Float32Array
  const baseSizes = stars.geometry.attributes.baseSize.array as Float32Array
  const rotationSpeed = 0.00002 // Slowed down and reversed

  for (let i = 0; i < STAR_COUNT; i++) {
    const i3 = i * 3
    // Update arc movement
    const x = positions[i3]
    const z = positions[i3 + 2]
    const radius = Math.sqrt(x * x + z * z)
    const angle = Math.atan2(z, x) - rotationSpeed
    positions[i3] = radius * Math.cos(angle)
    positions[i3 + 2] = radius * Math.sin(angle)

    // Update the size with pulsation
    sizes[i] = baseSizes[i] * (Math.abs(Math.sin(time * 0.0005 + i)) * 2.5 + 1)
  }

  stars.geometry.attributes.position.needsUpdate = true
  stars.geometry.attributes.size.needsUpdate = true
  renderer.render(scene, camera)
  animationFrameId = requestAnimationFrame(animate)
}

function onResize() {
  if (!camera || !renderer || !container.value) return
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(async () => {
  if (isMobileDevice()) return
  await nextTick()
  init()
  animate(0)
})

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', onResize)
  if (container.value && renderer?.domElement) {
    container.value.removeChild(renderer.domElement)
  }
  renderer?.dispose()
  scene?.clear()
  scene = null
  camera = null
  renderer = null
  stars = null
  animationFrameId = null
})
</script>
