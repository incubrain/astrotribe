<!-- pages/solar-system.vue -->
<script setup lang="ts">
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import type { Planet } from '../types/solarsystem'
import { PLANETS } from '../data/planets'

// 2. Component Options
defineOptions({
  name: 'SolarSystemPage',
})

// 3. Props and Emits
// None for page component

// 4. Core Nuxt Composables
// (None used in this example)

// 5. Reactive Variables
const selectedPlanet = ref('jupiter')
const isChanging = ref(false)
const isModelLoaded = ref(false)

// 6. Planets Data (simplified version with just the required properties for navigation)
interface SimplePlanet {
  id: string
  name: string
  image: string
  color: string
}

const planets: SimplePlanet[] = [
  { id: 'mercury', name: 'Mercury', image: '/images/planets/mercury.jpg', color: '#A5A5A5' },
  { id: 'venus', name: 'Venus', image: '/images/planets/venus.jpg', color: '#E6C073' },
  { id: 'earth', name: 'Earth', image: '/images/planets/earth.jpg', color: '#3D85C6' },
  { id: 'mars', name: 'Mars', image: '/images/planets/mars.jpg', color: '#CC4125' },
  { id: 'jupiter', name: 'Jupiter', image: '/images/planets/jupiter.jpg', color: '#E07E38' },
  { id: 'saturn', name: 'Saturn', image: '/images/planets/saturn.jpg', color: '#D4B46A' },
  { id: 'uranus', name: 'Uranus', image: '/images/planets/uranus.jpg', color: '#5CACCE' },
  { id: 'neptune', name: 'Neptune', image: '/images/planets/neptune.jpg', color: '#3953A4' },
]

// Actual Jupiter facts instead of placeholder content
const jupiterFacts = [
  "Jupiter is the largest planet in our solar system - it's so big that all other planets could fit inside it.",
  "The Great Red Spot is a giant storm that has been raging for at least 400 years, and it's shrinking.",
  "Jupiter has a strong magnetic field that's about 20,000 times stronger than Earth's.",
  'A day on Jupiter is the shortest in the solar system - just under 10 hours.',
  'Jupiter has at least 95 moons, with the four largest (Io, Europa, Ganymede, and Callisto) discovered by Galileo in 1610.',
]

const jupiterDidYouKnow = [
  "Jupiter's mass is 2.5 times greater than all the other planets in our solar system combined.",
  'If Jupiter had been about 80 times more massive, it would have become a star rather than a planet.',
  "Jupiter's moon Ganymede is the largest moon in our solar system, even larger than the planet Mercury.",
  'The Great Red Spot has winds that reach speeds of about 270 mph (430 km/h).',
  "Jupiter's rings are much fainter than Saturn's and were only discovered in 1979 by the Voyager 1 spacecraft.",
]

const jupiterResources = [
  { name: 'NASA Science - Jupiter', url: 'https://science.nasa.gov/jupiter/' },
  { name: 'Juno Mission', url: 'https://www.nasa.gov/mission_pages/juno/main/index.html' },
  { name: 'Wikipedia - Jupiter', url: 'https://en.wikipedia.org/wiki/Jupiter' },
  {
    name: 'Hubble Images of Jupiter',
    url: 'https://hubblesite.org/contents/media/images/2020/42/4690-Image',
  },
]

const jupiterMoons = [
  {
    id: 'io',
    name: 'Io',
    image: '/images/moons/io.jpg',
    description:
      'The most volcanically active body in our solar system with hundreds of active volcanoes due to strong tidal forces from Jupiter.',
  },
  {
    id: 'europa',
    name: 'Europa',
    image: '/images/moons/europa.jpg',
    description:
      'Covered in a shell of ice with a subsurface ocean of liquid water, making it a prime candidate in the search for extraterrestrial life.',
  },
  {
    id: 'ganymede',
    name: 'Ganymede',
    image: '/images/moons/ganymede.jpg',
    description:
      "The largest moon in our solar system with its own magnetic field. It's larger than the planet Mercury and has a subsurface ocean.",
  },
  {
    id: 'callisto',
    name: 'Callisto',
    image: '/images/moons/callisto.jpg',
    description:
      'The most heavily cratered object in our solar system. It is thought to have a subsurface ocean and is the outermost of the Galilean moons.',
  },
]

const jupiterMythology = {
  name: 'Jupiter (Zeus)',
  origin: 'Roman/Greek',
  description:
    'Jupiter was the king of the gods in Roman mythology, equivalent to Zeus in Greek mythology. He was the god of sky and thunder, ruling as the king of the gods on Mount Olympus.',
  significance:
    'As the most powerful of the gods, Jupiter was the central figure in Roman religion and was thought to oversee all aspects of life, especially law, order, and the state.',
}

const jupiterTimeline = [
  { year: '1610', event: 'Galileo Galilei discovers the four largest moons of Jupiter' },
  { year: '1973', event: 'Pioneer 10 becomes the first spacecraft to visit Jupiter' },
  { year: '1979', event: 'Voyager 1 and 2 fly by Jupiter, discovering its rings' },
  { year: '1995', event: 'Galileo spacecraft becomes the first to orbit Jupiter' },
  { year: '2016', event: 'Juno spacecraft enters orbit around Jupiter' },
]

const jupiterPreviousMissions = [
  {
    name: 'Pioneer 10 & 11',
    year: '1973-1974',
    description: 'First spacecraft to visit Jupiter and take close-up images',
  },
  {
    name: 'Voyager 1 & 2',
    year: '1979',
    description: 'Detailed studies of Jupiter, its moons, and discovery of its rings',
  },
  {
    name: 'Galileo',
    year: '1995-2003',
    description: 'First spacecraft to orbit Jupiter and deploy a probe into its atmosphere',
  },
  {
    name: 'Juno',
    year: '2016-Present',
    description:
      "Currently studying Jupiter's composition, gravity, magnetic field, and polar magnetosphere",
  },
]

const jupiterUpcomingMissions = [
  {
    name: 'Europa Clipper',
    year: '2024-2030',
    description: "NASA mission to study Jupiter's moon Europa and its potential for hosting life",
  },
  {
    name: 'JUICE (Jupiter Icy Moons Explorer)',
    year: '2023-2031',
    description: 'ESA mission to study Jupiter and its icy moons Ganymede, Callisto, and Europa',
  },
]

// 7. Computed Properties
const currentPlanet = computed<Planet>(() => {
  // Return Jupiter data (in a real app, we would fetch data based on selectedPlanet.value)
  return {
    id: selectedPlanet.value,
    name: planets.find((p) => p.id === selectedPlanet.value)?.name || 'Jupiter',
    image:
      planets.find((p) => p.id === selectedPlanet.value)?.image || '/images/planets/jupiter.jpg',
    facts: jupiterFacts,
    resources: jupiterResources,
    mythology: jupiterMythology,
    timeline: jupiterTimeline,
    didYouKnow: jupiterDidYouKnow,
    missions: {
      previous: jupiterPreviousMissions,
      upcoming: jupiterUpcomingMissions,
    },
    moons: jupiterMoons,
    videoId: 'PtkqwslnLY8',
  }
})

const planetColor = computed(() => {
  return planets.find((p) => p.id === selectedPlanet.value)?.color || '#E07E38'
})

// 8. Methods
const changePlanet = (planetId: string) => {
  if (planetId === selectedPlanet.value) return

  isChanging.value = true
  setTimeout(() => {
    selectedPlanet.value = planetId
    setTimeout(() => {
      isChanging.value = false
    }, 500)
  }, 300)
}

const handleModelLoaded = () => {
  isModelLoaded.value = true
}

// 9. Lifecycle Hooks
onMounted(() => {
  // Add animation class to body when component mounts
  document.body.classList.add('stars-background')

  // Simulate model loading in 1 second
  setTimeout(() => {
    isModelLoaded.value = true
  }, 1000)
})
</script>

<template>
  <div class="min-h-screen text-white">
    <!-- Hero Section with enhanced styles -->
    <div class="relative overflow-hidden">
      <div
        class="hero-section bg-cover bg-center h-screen flex items-center justify-center relative"
        style="background-image: url('/images/solar-system-hero.jpg')"
      >
        <div class="container mx-auto px-4 relative z-10 text-center">
          <h1 class="text-5xl md:text-7xl font-bold mb-6 text-white">Our Solar System</h1>
          <p class="max-w-2xl mx-auto text-lg text-white mb-8">
            Explore the planets, moons, and other celestial bodies that make up our cosmic
            neighborhood
          </p>

          <!-- Call to action buttons with improved styles -->
          <div class="mt-6 flex flex-wrap gap-4 justify-center">
            <button
              class="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center"
            >
              <span class="mr-2">🔭</span>
              Start Exploring
            </button>

            <button
              class="bg-transparent border border-primary-400 text-primary-400 hover:bg-primary-900/30 px-6 py-3 rounded-lg transition-all duration-300 flex items-center"
            >
              <span class="mr-2">🚀</span>
              Latest Discoveries
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Planet Navigation Tabs with enhanced styling -->
    <div
      class="sticky top-[40px] lg:top-[65px] z-50 bg-primary-950/80 backdrop-blur-sm border-b border-primary-800"
    >
      <div class="container mx-auto px-4">
        <div class="flex justify-center space-x-2 md:space-x-6 overflow-x-auto py-4 no-scrollbar">
          <button
            v-for="planet in planets"
            :key="planet.id"
            class="px-4 py-2 text-sm md:text-base transition-all duration-300 rounded-lg"
            :class="[
              selectedPlanet === planet.id
                ? `text-white bg-primary-900/60 border-b-2`
                : 'text-gray-400 hover:text-primary-300 hover:bg-primary-900/30',
              selectedPlanet === planet.id ? `border-[${planet.color}]` : '',
            ]"
            @click="changePlanet(planet.id)"
          >
            {{ planet.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content with improved spacing and animations -->
    <div class="container mx-auto px-4 py-16">
      <!-- Planet Name and 3D Render with Animation -->
      <div class="text-center mb-32">
        <h1
          class="text-5xl md:text-7xl font-bold mb-16 transition-all duration-500"
          :class="
            isChanging
              ? 'opacity-0 transform -translate-y-10'
              : 'opacity-100 transform translate-y-0'
          "
          :style="`color: ${planetColor}`"
        >
          {{ currentPlanet.name }}
        </h1>

        <div class="overflow-visible w-full max-w-2xl mx-auto">
          <PlanetModel
            :planet-id="selectedPlanet"
            :auto-rotate="true"
            @model-loaded="handleModelLoaded"
          />
        </div>
      </div>

      <PlanetSizeComparison
        :planet-id="currentPlanet.id"
        :planet-name="currentPlanet.name"
      />

      <PlanetGravityComparison
        :planet-id="currentPlanet.id"
        :planet-name="currentPlanet.name"
      />

      <PlanetDidYouKnow
        :facts="currentPlanet.didYouKnow"
        :auto-rotate="true"
        :rotation-interval="8000"
      />

      <!-- Two Column Layout for Facts and Resources with improved styling -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <!-- Facts Column -->
        <div
          class="bg-primary-900/30 backdrop-blur-sm rounded-lg p-8 border border-primary-800/30 shadow-lg h-full"
        >
          <h2 class="text-2xl font-bold mb-6 text-primary-400">Key Facts</h2>
          <ul class="space-y-6">
            <li
              v-for="(fact, index) in currentPlanet.facts"
              :key="index"
              class="flex items-start group"
            >
              <span
                class="inline-block w-3 h-3 mt-2 mr-4 bg-primary-400 rounded-full group-hover:scale-125 transition-transform duration-300"
              ></span>
              <span class="text-lg leading-relaxed">{{ fact }}</span>
            </li>
          </ul>
        </div>

        <!-- Resources Column -->
        <div
          class="bg-primary-900/30 backdrop-blur-sm rounded-lg p-8 border border-primary-800/30 shadow-lg h-full"
        >
          <h2 class="text-2xl font-bold mb-6 text-primary-400">Resources</h2>
          <ul class="space-y-6">
            <li
              v-for="resource in currentPlanet.resources"
              :key="resource.name"
              class="transition-all duration-300 hover:translate-x-2"
            >
              <a
                :href="resource.url"
                class="text-lg flex items-center text-primary-400 hover:text-primary-300 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="mr-3">→</span>
                {{ resource.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <PlanetMythology :mythology="currentPlanet.mythology" />

      <PlanetDiscoveryTimeline :events="currentPlanet.timeline" />

      <!-- Moons Section with improved styling - Fixed placement -->
      <div class="mb-24">
        <h2 class="text-3xl font-bold mb-12">Moons of Jupiter</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="moon in jupiterMoons"
            :key="moon.id"
            class="bg-primary-900/30 backdrop-blur-sm rounded-lg overflow-hidden border border-primary-800/30 transition-all duration-500 hover:border-primary-600 hover:shadow-lg hover:shadow-primary-900/20 group"
          >
            <div class="h-48 overflow-hidden relative">
              <img
                :src="moon.image"
                :alt="moon.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-primary-950 to-transparent opacity-70"
              ></div>
              <h3 class="text-xl font-bold absolute bottom-4 left-4 text-white">{{ moon.name }}</h3>
            </div>
            <div class="p-6">
              <p class="text-gray-300 text-base leading-relaxed">{{ moon.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <PlanetMissionsTimeline
        :previous-missions="currentPlanet.missions.previous"
        :upcoming-missions="currentPlanet.missions.upcoming"
      />

      <!-- Video Section with enhanced styling and fallback -->
      <div class="mb-24">
        <h2 class="text-3xl font-bold mb-12 text-center">Learn More About Jupiter</h2>
        <div
          class="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl border border-primary-800/50 bg-black/50"
        >
          <!-- Video with proper fallback -->
          <div class="relative w-full h-full">
            <iframe
              src="https://www.youtube.com/embed/PtkqwslnLY8"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="w-full h-full"
            ></iframe>

            <!-- Fallback content in case video fails to load -->
            <div
              class="absolute inset-0 bg-primary-950/80 backdrop-blur-sm flex items-center justify-center hidden"
            >
              <div class="text-center p-6">
                <div class="text-5xl mb-4">📺</div>
                <h3 class="text-xl font-bold mb-3">Video Unavailable</h3>
                <p class="text-gray-300"
                  >The video content could not be loaded. Please try again later or check out NASA's
                  Jupiter mission page for videos.</p
                >
                <a
                  href="https://www.nasa.gov/mission_pages/juno/main/index.html"
                  target="_blank"
                  class="mt-4 inline-block bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg transition-all duration-300"
                >
                  Visit NASA Juno Mission
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional video resources -->
        <div class="mt-8 text-center">
          <h3 class="text-xl font-semibold mb-4">More Jupiter Videos</h3>
          <div class="flex flex-wrap gap-4 justify-center">
            <a
              href="https://www.youtube.com/watch?v=G5NoXKWJu6A"
              target="_blank"
              class="text-primary-400 hover:text-primary-300 transition-colors duration-300"
            >
              Jupiter in 4K
            </a>

            <a
              href="https://www.youtube.com/watch?v=sjbHdZHkUjU"
              target="_blank"
              class="text-primary-400 hover:text-primary-300 transition-colors duration-300"
            >
              Juno Mission Highlights
            </a>
            <a
              href="https://www.youtube.com/watch?v=6SzHAAmJ-UM"
              target="_blank"
              class="text-primary-400 hover:text-primary-300 transition-colors duration-300"
            >
              Great Red Spot Footage
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar styling */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Animated background */
@keyframes twinkling {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.3;
  }
}

/* Planet rotation animation */
@keyframes slow-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-slow-rotate {
  animation: slow-rotate 120s linear infinite;
}

/* Hero section styling */
.hero-section {
  height: 80vh;
  min-height: 600px;
}
</style>
