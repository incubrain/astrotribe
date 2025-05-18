<template>
  <div
    class="relative w-full h-screen overflow-hidden bg-slate-950 text-slate-200 flex flex-col font-sans"
  >
    <div
      ref="rendererContainer"
      class="flex-grow w-full h-full min-h-0"
    ></div>

    <div
      class="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent"
    >
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 items-end">
        <div class="md:col-span-2 bg-slate-800/70 backdrop-blur-sm p-3 rounded-lg shadow-xl">
          <h2
            class="text-xl md:text-2xl font-bold text-amber-400 mb-1 truncate"
            :title="store.currentStage.name"
          >
            {{ store.currentStage.name }}
          </h2>
          <p
            class="text-xs md:text-sm text-slate-300 leading-relaxed max-h-20 md:max-h-24 overflow-y-auto custom-scrollbar pr-2"
          >
            {{ store.currentStage.description }}
          </p>
          <div class="mt-2 pt-2 border-t border-slate-700">
            <h3 class="text-sm font-semibold text-sky-400 mb-0.5">Key Learning Point:</h3>
            <p class="text-xs md:text-sm text-slate-300 leading-relaxed">{{
              store.currentStage.keyLearningPoint
            }}</p>
          </div>
          <div class="mt-1 text-xs text-slate-400">
            <p
              ><strong class="text-slate-200">Characteristics:</strong>
              {{ store.currentStage.characteristics }}</p
            >
            <p
              ><strong class="text-slate-200">Phase Duration:</strong>
              {{ store.currentStage.duration }}</p
            >
          </div>
        </div>

        <div class="md:col-span-1 flex flex-col gap-2 items-center md:items-stretch">
          <div class="w-full bg-slate-800/70 backdrop-blur-sm p-2.5 rounded-lg shadow-xl">
            <p class="text-xs text-center text-slate-400 mb-1.5">SELECT STAGE:</p>
            <div class="flex flex-wrap justify-center gap-1.5">
              <button
                v-for="(stage, index) in store.stages"
                :key="stage.id"
                :title="stage.name"
                :class="[
                  'px-2.5 py-1 text-xs rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-75',
                  store.currentStageIndex === index
                    ? 'bg-amber-500 text-slate-900 font-semibold shadow-md'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200',
                ]"
                @click="store.goToStage(index)"
              >
                {{ stage.shortName }}
              </button>
            </div>
          </div>
          <div
            class="flex items-center justify-center gap-3 bg-slate-800/70 backdrop-blur-sm p-2 rounded-lg shadow-xl"
          >
            <button
              title="Previous Stage"
              class="p-2 rounded-full bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              @click="store.prevStage()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 md:h-5 md:w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <span class="text-sm text-slate-300 font-medium tabular-nums">
              {{ store.currentStageIndex + 1 }} / {{ store.totalStages }}
            </span>
            <button
              title="Next Stage"
              class="p-2 rounded-full bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              @click="store.nextStage()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 md:h-5 md:w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, shallowRef } from 'vue'
import { useWindowSize, useRafFn } from '@vueuse/core'
import {
  useStarLifecycleStore,
  type StageThreeJSParams,
  type StarStage,
} from '~/stores/starLifecycleStore'

// Dynamically import Three.js only on the client
let THREE: typeof import('three')

const store = useStarLifecycleStore()
const rendererContainer = ref<HTMLDivElement | null>(null)

// Three.js essentials (using shallowRef for non-reactive Three.js objects)
const scene = shallowRef<import('three').Scene | null>(null)
const camera = shallowRef<import('three').PerspectiveCamera | null>(null)
const renderer = shallowRef<import('three').WebGLRenderer | null>(null)
const currentVisualGroup = shallowRef<import('three').Group | null>(null) // A group to hold all stage elements
const ambientLight = shallowRef<import('three').AmbientLight | null>(null)
const directionalLight = shallowRef<import('three').DirectionalLight | null>(null) // Using directional for better definition

// --- VueUse ---
// Using rendererContainer's size for Three.js canvas, not full window, to respect UI overlay
const { width: containerWidth, height: containerHeight } = useElementSize(rendererContainer)

const initThree = async () => {
  if (!import.meta.client || !rendererContainer.value) return

  THREE = await import('three')

  const currentParams = store.currentStage.threeJSParams

  scene.value = new THREE.Scene()
  scene.value.background = new THREE.Color(0x050810) // Very dark blue/black

  camera.value = new THREE.PerspectiveCamera(
    60,
    containerWidth.value / containerHeight.value,
    0.1,
    3000,
  )
  camera.value.position.set(
    currentParams.cameraPosition.x,
    currentParams.cameraPosition.y,
    currentParams.cameraPosition.z,
  )
  camera.value.lookAt(0, 0, 0)

  ambientLight.value = new THREE.AmbientLight(0xffffff, 0.4) // Slightly brighter ambient
  scene.value.add(ambientLight.value)

  directionalLight.value = new THREE.DirectionalLight(0xffffff, currentParams.lightIntensity)
  directionalLight.value.position.set(1, 1, 2).normalize() // Consistent light direction
  scene.value.add(directionalLight.value)

  renderer.value = new THREE.WebGLRenderer({ antialias: true })
  renderer.value.setSize(containerWidth.value, containerHeight.value)
  renderer.value.setPixelRatio(window.devicePixelRatio)
  rendererContainer.value.appendChild(renderer.value.domElement)

  updateSceneForStage(store.currentStage, true) // Pass the whole stage object
  resumeAnimation() // Start the animation loop
}

const { pause: pauseAnimation, resume: resumeAnimation } = useRafFn(
  (args) => {
    if (!renderer.value || !scene.value || !camera.value) return

    if (currentVisualGroup.value && currentVisualGroup.value.userData.animate) {
      currentVisualGroup.value.userData.animate(args.delta / 1000) // deltaTime in seconds
    }
    renderer.value.render(scene.value, camera.value)
  },
  { immediate: false },
) // Start paused

const updateSceneForStage = (stageData: StarStage, isInitial = false) => {
  if (!scene.value || !camera.value || !THREE || !directionalLight.value) return

  const params = stageData.threeJSParams

  // Camera position - can be animated with TWEEN.js later if desired
  camera.value.position.set(
    params.cameraPosition.x,
    params.cameraPosition.y,
    params.cameraPosition.z,
  )
  camera.value.lookAt(0, 0, 0)

  directionalLight.value.intensity = params.lightIntensity

  if (currentVisualGroup.value) {
    scene.value.remove(currentVisualGroup.value)
    disposeThreeGroup(currentVisualGroup.value)
  }

  currentVisualGroup.value = createVisualForStage(stageData)
  if (currentVisualGroup.value) {
    scene.value.add(currentVisualGroup.value)
  }
}

// --- Visual Creation Functions (Simplified for Education) ---
const createVisualForStage = (stageData: StarStage): import('three').Group => {
  if (!THREE) throw new Error('THREE is not loaded')

  const group = new THREE.Group()
  const params = stageData.threeJSParams
  let mainObject: import('three').Mesh | import('three').Points | null = null

  // Default animation: slow rotation
  group.userData.animate = (deltaTime: number) => {
    group.rotation.y += 0.05 * deltaTime
  }

  // Common material properties
  const standardMaterialProps = {
    color: params.surfaceColor || params.coreColor || 0xffffff,
    emissive: params.emissiveColor || 0x000000,
    emissiveIntensity: params.emissiveIntensity || 0,
    roughness: 0.8, // Less shiny for celestial bodies
    metalness: 0.1,
  }

  if (stageData.id === 'nebula') {
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const colors = []
    const pColors = (params.particleColors || [0xffffff]).map((c) => new THREE.Color(c))

    for (let i = 0; i < (params.particleCount || 1000); i++) {
      positions.push(
        (Math.random() - 0.5) * 2, // Normalized spread, scaled by group
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
      )
      const color = pColors[Math.floor(Math.random() * pColors.length)]
      colors.push(color.r, color.g, color.b)
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    const material = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    mainObject = new THREE.Points(geometry, material)
    group.userData.animate = (deltaTime: number) => {
      // Slower, more ethereal rotation for nebula
      if (mainObject) mainObject.rotation.y += 0.02 * deltaTime
    }
  } else if (stageData.id === 'planetary_nebula') {
    // Central Star
    const centralStarGeo = new THREE.SphereGeometry(0.02, 16, 16) // Tiny relative to overall scale
    const centralStarMat = new THREE.MeshBasicMaterial({
      color: params.coreColor,
      emissive: params.emissiveColor,
      emissiveIntensity: params.emissiveIntensity,
    })
    const centralStar = new THREE.Mesh(centralStarGeo, centralStarMat)
    group.add(centralStar)

    // Nebula Shells (Sprites)
    const shellColors = (params.particleColors || [0xff00aa, 0x00ffdd]).map(
      (c) => new THREE.Color(c),
    )
    for (let i = 0; i < shellColors.length; i++) {
      const shellTexture = createGlowCanvasTexture(shellColors[i], 0.4, true)
      const shellMat = new THREE.SpriteMaterial({
        map: shellTexture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.5 + Math.random() * 0.2,
        rotation: Math.random() * Math.PI,
      })
      const shellSprite = new THREE.Sprite(shellMat)
      const scale = 0.5 + i * 0.3 + Math.random() * 0.2 // Relative scale for sprite
      shellSprite.scale.set(scale, scale, 1)
      group.add(shellSprite)
    }
    group.userData.animate = (deltaTime: number) => {
      // Gentle rotation for nebula
      group.rotation.y += 0.01 * deltaTime
      group.rotation.x += 0.005 * deltaTime
    }
  } else {
    // Sphere-based objects (Protostar, Main Sequence, Giants, White Dwarf)
    const geometry = new THREE.SphereGeometry(0.5, 32, 32) // Base radius 0.5, scaled by group
    const material = new THREE.MeshStandardMaterial(standardMaterialProps)
    mainObject = new THREE.Mesh(geometry, material)

    if (params.showAccretionDisk && stageData.id === 'protostar') {
      const diskGeo = new THREE.RingGeometry(0.7, 1.5, 32) // Relative to sphere radius 0.5
      const diskMat = new THREE.MeshStandardMaterial({
        color: 0x886644,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
        roughness: 0.9,
      })
      const disk = new THREE.Mesh(diskGeo, diskMat)
      disk.rotation.x = Math.PI / 2.5
      group.add(disk)
      group.userData.animate = (deltaTime: number) => {
        // Animate disk and star separately
        disk.rotation.z += 0.1 * deltaTime
        if (mainObject) mainObject.rotation.y += 0.05 * deltaTime
      }
    }
    if (stageData.id === 'agb_star' && params.particleCount) {
      // Simple mass loss representation
      const lossMaterial = new THREE.PointsMaterial({
        color: (params.particleColors && params.particleColors[0]) || 0xffcc66,
        size: 0.015,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      })
      const lossPositions = []
      for (let i = 0; i < params.particleCount; i++) {
        const r = 0.6 + Math.random() * 0.4 // Eject from just outside the star's surface
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(Math.random() * 2 - 1)
        lossPositions.push(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        )
      }
      const lossGeo = new THREE.BufferGeometry()
      lossGeo.setAttribute('position', new THREE.Float32BufferAttribute(lossPositions, 3))
      const lossPoints = new THREE.Points(lossGeo, lossMaterial)
      group.add(lossPoints)
    }
  }

  if (mainObject) group.add(mainObject)
  group.scale.setScalar(params.objectScale) // Apply uniform scaling
  return group
}

// Helper to create canvas-based textures for glows/sprites
const createGlowCanvasTexture = (
  color: import('three').Color,
  coreOpacity = 0.5,
  isNebulaShell = false,
): import('three').CanvasTexture => {
  if (!THREE) throw new Error('THREE is not loaded for texture creation')
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')! // Non-null assertion, THREE is checked
  canvas.width = 128
  canvas.height = 128
  const centerX = canvas.width / 2,
    centerY = canvas.height / 2,
    radius = canvas.width / 2
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
  const r = color.r * 255,
    g = color.g * 255,
    b = color.b * 255

  if (isNebulaShell) {
    gradient.addColorStop(0, `rgba(${r},${g},${b}, ${coreOpacity})`)
    gradient.addColorStop(0.3, `rgba(${r},${g},${b}, ${coreOpacity * 0.5})`)
    gradient.addColorStop(1, `rgba(${r},${g},${b}, 0)`)
  } else {
    // Standard glow
    gradient.addColorStop(0, `rgba(${r},${g},${b}, ${coreOpacity})`)
    gradient.addColorStop(0.5, `rgba(${r},${g},${b}, ${coreOpacity * 0.3})`)
    gradient.addColorStop(1, `rgba(${r},${g},${b}, 0)`)
  }
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// Cleanup utility
const disposeThreeGroup = (group: import('three').Group) => {
  if (!group) return
  group.traverse((child) => {
    const mesh = child as import('three').Mesh
    if (mesh.geometry) mesh.geometry.dispose()
    if (mesh.material) {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      materials.forEach((material) => {
        if (material.map) material.map.dispose()
        // Dispose other textures if used (normalMap, emissiveMap, etc.)
        material.dispose()
      })
    }
    const sprite = child as import('three').Sprite
    if (sprite.material && sprite.material.map) {
      sprite.material.map.dispose()
      sprite.material.dispose()
    }
  })
  // Remove all children from group, though scene.remove(group) should handle this
  while (group.children.length > 0) {
    group.remove(group.children[0])
  }
}

// --- Watchers ---
watch(
  () => store.currentStageIndex,
  (newIndex, oldIndex) => {
    if (newIndex !== oldIndex && scene.value) {
      updateSceneForStage(store.stages[newIndex])
    }
  },
)

// Resize handler using useElementSize for responsive canvas
watch([containerWidth, containerHeight], () => {
  if (camera.value && renderer.value && rendererContainer.value) {
    const newWidth = containerWidth.value
    const newHeight = containerHeight.value
    if (newWidth > 0 && newHeight > 0) {
      // Ensure valid dimensions
      camera.value.aspect = newWidth / newHeight
      camera.value.updateProjectionMatrix()
      renderer.value.setSize(newWidth, newHeight)
    }
  }
})

// --- Lifecycle Hooks ---
onMounted(async () => {
  if (import.meta.client) {
    await initThree() // initThree now calls resumeAnimation
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    pauseAnimation()
    if (renderer.value) {
      renderer.value.dispose()
      if (renderer.value.domElement && renderer.value.domElement.parentElement) {
        renderer.value.domElement.parentElement.removeChild(renderer.value.domElement)
      }
    }
    if (currentVisualGroup.value) {
      disposeThreeGroup(currentVisualGroup.value) // Ensure current group is disposed
    }
    if (scene.value) {
      // Scene itself doesn't need complex disposal like a group of meshes
      scene.value = null // Allow GC
    }
    // Nullify refs
    camera.value = null
    renderer.value = null
    currentVisualGroup.value = null
    ambientLight.value = null
    directionalLight.value = null
  }
})
</script>

<style>
/* Custom scrollbar for description (Tailwind doesn't directly style scrollbars easily) */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(100, 116, 139, 0.5); /* slate-500 with opacity */
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(71, 85, 105, 0.7); /* slate-600 with opacity */
}

/* Ensure body/html don't introduce unwanted scroll or margins */
body,
html {
  margin: 0;
  padding: 0;
  overflow: hidden; /* Prevent page scroll if simulator is full screen */
  height: 100%; /* Ensure html and body take full height */
  background-color: #020617; /* slate-950, match with component bg */
}
</style>
