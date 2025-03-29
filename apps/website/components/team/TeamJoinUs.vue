<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, nextTick, shallowRef } from 'vue'
import * as THREE from 'three'

// CTA button hover state
const isHovered = ref(false)

// Modal state
const isModalOpen = ref(false)

// Three.js refs
const containerRef = ref(null as HTMLDivElement | null)

const scene = shallowRef<THREE.Scene | null>(null)
const camera = shallowRef<THREE.PerspectiveCamera | null>(null)
const renderer = shallowRef<THREE.WebGLRenderer | null>(null)
const jupiter = shallowRef<THREE.Mesh | null>(null)

const animationFrameId = ref(null as number | null)
const moons = ref(
  [] as { mesh: THREE.Mesh; orbit: THREE.Object3D; data: any; initialAngle: number }[],
)
const isJupiterReady = ref(false)

// Form data
const formData = ref({
  name: '',
  email: '',
  interest: '',
  message: '',
})

// Form handling
const submitForm = () => {
  console.log('Form submitted:', formData.value)
  formData.value = { name: '', email: '', interest: '', message: '' }
  isModalOpen.value = false
}

// Setup the Jupiter system
const setupJupiterSystem = () => {
  try {
    if (
      !containerRef.value ||
      !containerRef.value.clientWidth ||
      !containerRef.value.clientHeight
    ) {
      console.warn('Container not available for Three.js setup')
      return
    }

    const container = containerRef.value
    scene.value = new THREE.Scene()

    const aspectRatio = container.clientWidth / container.clientHeight
    camera.value = new THREE.PerspectiveCamera(55, aspectRatio, 0.1, 1000)
    camera.value.position.set(0, 10, 30)
    camera.value.lookAt(0, 0, 0)

    renderer.value = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.value.setSize(container.clientWidth, container.clientHeight)
    renderer.value.setPixelRatio(window.devicePixelRatio)
    renderer.value.setClearColor(0x000000, 0)

    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }

    container.appendChild(renderer.value.domElement)

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x333333)
    scene.value.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.value.add(directionalLight)

    // Create Jupiter and moons
    createJupiter()
    createMoons()
    isJupiterReady.value = true

    // Start animation loop
    animate()

    // Handle window resize
    window.addEventListener('resize', handleResize)
  } catch (error) {
    console.error('Error setting up Jupiter system:', error)
  }
}

// Create Jupiter with procedural material
const createJupiter = () => {
  try {
    const jupiterGeometry = new THREE.SphereGeometry(5, 64, 64) // Higher segments for smoother appearance

    // Procedural shader for Jupiter's banded appearance
    const jupiterMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        baseColor: { value: new THREE.Color(0xf5a142) }, // Base color (orangish)
        bandColor1: { value: new THREE.Color(0xe08b38) }, // Darker bands
        bandColor2: { value: new THREE.Color(0xffd1a3) }, // Lighter bands
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 baseColor;
        uniform vec3 bandColor1;
        uniform vec3 bandColor2;
        varying vec3 vNormal;
        varying vec2 vUv;

        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        void main() {
          // Create banded effect using UV coordinates
          float bands = sin(vUv.y * 20.0 + noise(vUv * 5.0) * 2.0) * 0.5 + 0.5;
          vec3 color = mix(baseColor, bandColor1, bands);
          color = mix(color, bandColor2, smoothstep(0.4, 0.6, bands));

          // Add some noise for texture
          float n = noise(vUv * 10.0);
          color += n * 0.1;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })

    jupiter.value = new THREE.Mesh(jupiterGeometry, jupiterMaterial)
    scene.value.add(jupiter.value)
  } catch (error) {
    console.error('Error creating Jupiter:', error)
  }
}

// Create Jupiter's moons
const createMoons = () => {
  try {
    const moonData = [
      {
        name: 'Io',
        distance: 10,
        size: 0.5,
        orbitalPeriod: 1.8,
        color: 0xe8c840,
        inclination: 0.05,
        eccentricity: 0.004,
      },
      {
        name: 'Europa',
        distance: 13,
        size: 0.4,
        orbitalPeriod: 3.6,
        color: 0xa09080,
        inclination: 0.1,
        eccentricity: 0.01,
      },
      {
        name: 'Ganymede',
        distance: 17,
        size: 0.6,
        orbitalPeriod: 7.2,
        color: 0xa0a0a0,
        inclination: 0.2,
        eccentricity: 0.001,
      },
      {
        name: 'Callisto',
        distance: 21,
        size: 0.55,
        orbitalPeriod: 16.7,
        color: 0x707070,
        inclination: 0.3,
        eccentricity: 0.007,
      },
    ]

    moonData.forEach((data) => {
      try {
        // Simplified moon geometry (fewer segments)
        const moonGeometry = new THREE.SphereGeometry(data.size, 8, 8)
        const moonMaterial = new THREE.MeshStandardMaterial({
          color: data.color,
          roughness: 0.9,
        })

        const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial)

        // Create orbit path
        const orbitGeometry = new THREE.BufferGeometry()
        const orbitPoints = [] as THREE.Vector3[]
        const segments = 64 // Reduced segments for performance
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2
          const x = data.distance * Math.cos(theta)
          const z = data.distance * Math.sin(theta)
          const y = data.distance * Math.sin(theta) * data.inclination
          orbitPoints.push(new THREE.Vector3(x, y, z))
        }
        orbitGeometry.setFromPoints(orbitPoints)

        const orbitMaterial = new THREE.LineBasicMaterial({
          color: 0x444444,
          transparent: true,
          opacity: 0.3,
        })
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial)
        scene.value.add(orbitLine)

        // Moon container for animation
        const moonOrbit = new THREE.Object3D()
        moonOrbit.add(moonMesh)
        scene.value.add(moonOrbit)

        moonMesh.position.x = data.distance
        moonOrbit.rotation.x = data.inclination

        moons.value.push({
          mesh: moonMesh,
          orbit: moonOrbit,
          data: data,
          initialAngle: Math.random() * Math.PI * 2,
        })
      } catch (error) {
        console.error(`Error creating moon ${data.name}:`, error)
      }
    })
  } catch (error) {
    console.error('Error creating moons:', error)
  }
}

// Animation loop
const animate = () => {
  animationFrameId.value = requestAnimationFrame(animate)

  try {
    if (isJupiterReady.value && jupiter.value) {
      // Rotate Jupiter
      jupiter.value.rotation.y += 0.002

      // Update Jupiter's shader time uniform for animation
      if (jupiter.value.material instanceof THREE.ShaderMaterial) {
        jupiter.value.material.uniforms.time.value += 0.01
      }

      // Animate moons
      moons.value.forEach((moon) => {
        const orbitalSpeed = 0.005 / moon.data.orbitalPeriod
        moon.orbit.rotation.y += orbitalSpeed
        moon.mesh.rotation.y += 0.01
      })
    }

    if (renderer.value && scene.value && camera.value) {
      renderer.value.render(scene.value, camera.value)
    }
  } catch (error) {
    console.error('Error in animation loop:', error)
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value)
    }
  }
}

// Handle window resize
const handleResize = () => {
  try {
    if (!containerRef.value || !camera.value || !renderer.value) return

    const container = containerRef.value
    const width = container.clientWidth
    const height = container.clientHeight

    camera.value.aspect = width / height
    camera.value.updateProjectionMatrix()
    renderer.value.setSize(width, height)
  } catch (error) {
    console.error('Error handling resize:', error)
  }
}

const { stars, isClient, shootingStars } = useStarfield(30, 3)

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    setupJupiterSystem()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
  if (renderer.value) {
    renderer.value.dispose()
  }
  if (jupiter.value) {
    jupiter.value.geometry.dispose()
    if (jupiter.value.material instanceof THREE.ShaderMaterial) {
      jupiter.value.material.dispose()
    }
  }
  moons.value.forEach((moon) => {
    moon.mesh.geometry.dispose()
    moon.mesh.material.dispose()
  })
})
</script>

<template>
  <section class="join-team-cta-section py-20 relative overflow-hidden">
    <!-- Background elements -->
    <div class="absolute inset-0 bg-gradient-to-b from-primary-900 to-primary-950"></div>

    <!-- Animated stars -->
    <div
      v-if="isClient"
      class="absolute inset-0"
    >
      <div
        v-for="star in stars"
        :key="star.id"
        class="absolute rounded-full bg-white"
        :style="star.style"
      />
    </div>

    <!-- Shooting stars -->
    <div
      v-for="shoot in shootingStars"
      :key="'shooting-' + shoot.id"
      class="shooting-star"
      :style="shoot.style"
    />

    <div class="wrapper relative z-10">
      <LandingGlass
        hover-effect="glow"
        glow-color="blue"
        gradient="mixed"
        intensity="medium"
        class="p-8 md:p-12"
      >
        <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <!-- Three.js Jupiter visualization -->
          <div class="md:w-1/3 flex justify-center">
            <div
              ref="containerRef"
              class="jupiter-container w-60 h-60 relative"
            >
              <div
                v-if="!isJupiterReady"
                class="absolute inset-0 flex items-center justify-center"
              >
                <div class="loading-spinner"></div>
              </div>
            </div>
          </div>

          <!-- CTA content -->
          <div class="md:w-2/3 text-center md:text-left">
            <h2 class="text-2xl md:text-3xl font-bold mb-4 text-white">Join Our Celestial Team</h2>
            <p class="text-primary-200 text-lg mb-6">
              Are you passionate about astronomy, education, or technology? Become part of our
              cosmic journey and help us bring the wonders of the universe to people worldwide.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <div
                class="relative inline-block"
                @mouseenter="isHovered = true"
                @mouseleave="isHovered = false"
              >
                <PrimeButton
                  severity="primary"
                  class="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 border-0 px-6 py-3 text-lg transition-all duration-300 cosmic-button"
                  :class="{ 'scale-btn': isHovered }"
                  @click="isModalOpen = true"
                >
                  <div class="flex items-center gap-2">
                    <Icon name="mdi:rocket-launch" />
                    <span>Apply Now</span>
                  </div>
                </PrimeButton>
                <div
                  class="absolute inset-0 bg-blue-500 rounded-lg filter blur-lg transition-opacity duration-300"
                  :class="{ 'opacity-50': isHovered, 'opacity-0': !isHovered }"
                ></div>
              </div>

              <NuxtLink to="/contact">
                <PrimeButton
                  outlined
                  severity="secondary"
                  class="px-6 py-3"
                >
                  <div class="flex items-center gap-2">
                    <Icon name="mdi:email-outline" />
                    <span>Contact Us</span>
                  </div>
                </PrimeButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </LandingGlass>
    </div>

    <!-- Application Modal -->
    <PrimeDialog
      v-model:visible="isModalOpen"
      modal
      header="Join Our Team"
      :style="{ width: '50rem' }"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    >
      <div class="p-4">
        <p class="mb-6 text-primary-200">
          Tell us about yourself and how you'd like to contribute to our mission. We'll get back to
          you soon!
        </p>

        <form
          class="space-y-4"
          @submit.prevent="submitForm"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label
                for="name"
                class="block text-sm font-medium"
                >Your Name</label
              >
              <PrimeInputText
                id="name"
                v-model="formData.name"
                class="w-full"
              />
            </div>
            <div class="space-y-2">
              <label
                for="email"
                class="block text-sm font-medium"
                >Email Address</label
              >
              <PrimeInputText
                id="email"
                v-model="formData.email"
                class="w-full"
              />
            </div>
          </div>
          <div class="space-y-2">
            <label
              for="interest"
              class="block text-sm font-medium"
              >Area of Interest</label
            >
            <PrimeDropdown
              id="interest"
              v-model="formData.interest"
              :options="[
                'Astronomy Education',
                'Technology & Development',
                'Event Planning',
                'Dark Sky Conservation',
                'Content Creation',
                'Other',
              ]"
              placeholder="Select your area of interest"
              class="w-full"
            />
          </div>
          <div class="space-y-2">
            <label
              for="message"
              class="block text-sm font-medium"
              >Tell us about yourself</label
            >
            <PrimeTextarea
              id="message"
              v-model="formData.message"
              rows="5"
              placeholder="Share your experience, skills, and why you'd like to join us"
              class="w-full"
            />
          </div>
          <div class="flex justify-end pt-4">
            <PrimeButton
              type="submit"
              class="bg-primary-600"
              >Submit Application</PrimeButton
            >
          </div>
        </form>
      </div>
    </PrimeDialog>
  </section>
</template>

<style scoped>
.jupiter-container {
  position: relative;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 9999px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(82, 82, 156, 0.15);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: rgba(99, 102, 241, 0.8);
  animation: spin 1s ease-in-out infinite;
}

.cosmic-button {
  position: relative;
  overflow: hidden;
}

.cosmic-button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  transform: rotate(45deg);
  transition: transform 0.6s;
  z-index: -1;
}

.cosmic-button:hover::before {
  transform: rotate(45deg) translate(50%, 50%);
}

.scale-btn {
  transform: scale(1.05);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
