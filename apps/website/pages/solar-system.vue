<script setup lang="ts">
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import type { Planet } from '../types/solarsystem'

// 2. Component Options
defineOptions({
  name: 'SolarSystemPage',
})

// 3. Reactive Variables
const selectedPlanet = ref('jupiter')
const isChanging = ref(false)

// 4. Planets Data (simplified version with just the required properties for navigation)
interface SimplePlanet {
  id: string
  name: string
  image: string
}

const planets: SimplePlanet[] = [
  { id: 'mercury', name: 'Mercury', image: '/images/planets/mercury.jpg' },
  { id: 'venus', name: 'Venus', image: '/images/planets/venus.jpg' },
  { id: 'earth', name: 'Earth', image: '/images/planets/earth.jpg' },
  { id: 'mars', name: 'Mars', image: '/images/planets/mars.jpg' },
  { id: 'jupiter', name: 'Jupiter', image: '/images/planets/jupiter.jpg' },
  { id: 'saturn', name: 'Saturn', image: '/images/planets/saturn.jpg' },
  { id: 'uranus', name: 'Uranus', image: '/images/planets/uranus.jpg' },
  { id: 'neptune', name: 'Neptune', image: '/images/planets/neptune.jpg' },
]

// 5. Computed Properties
const currentPlanet = computed<Planet>(() => {
  // In a real application, this would fetch the full planet data based on selectedPlanet.value
  // For this example, we're just returning a placeholder with the essential properties
  return {
    id: selectedPlanet.value,
    name: planets.find((p) => p.id === selectedPlanet.value)?.name || 'Jupiter',
    image:
      planets.find((p) => p.id === selectedPlanet.value)?.image || '/images/planets/jupiter.jpg',
    facts: [
      'This is a placeholder fact about the planet.',
      'Another fact about the planet would go here.',
      'In a real application, these would be loaded from a database or API.',
    ],
    resources: [
      { name: 'Overview', url: '#' },
      { name: 'NASA Science', url: `https://science.nasa.gov/${selectedPlanet.value}/` },
      { name: 'Wikipedia', url: `https://en.wikipedia.org/wiki/${selectedPlanet.value}` },
    ],
    mythology: {
      name: planets.find((p) => p.id === selectedPlanet.value)?.name || 'Jupiter',
      origin: 'Roman',
      description: 'This is a placeholder for the mythology description.',
      significance: 'This is a placeholder for the cultural significance.',
    },
    timeline: [
      { year: '1610', event: 'First telescopic observation' },
      { year: '1979', event: 'First spacecraft flyby' },
      { year: '2010s', event: 'Modern exploration missions' },
    ],
    didYouKnow: [
      'This is an interesting fact about the planet that many people might not know.',
      'Here is another surprising fact about the planet.',
      'A third fascinating fact would go here in a real application.',
    ],
    missions: {
      previous: [
        { name: 'Example Mission 1', year: '1979', description: 'First mission to the planet' },
        { name: 'Example Mission 2', year: '2000s', description: 'Detailed study mission' },
      ],
      upcoming: [
        { name: 'Future Mission', year: '2030', description: 'Planned exploration mission' },
      ],
    },
    moons: [],
    videoId: 'PtkqwslnLY8', // Placeholder YouTube video ID
  }
})

// 6. Methods
const changePlanet = (planetId) => {
  if (planetId === selectedPlanet.value) return

  isChanging.value = true
  setTimeout(() => {
    selectedPlanet.value = planetId
    setTimeout(() => {
      isChanging.value = false
    }, 300)
  }, 300)
}
</script>

<template>
  <div class="min-h-screen text-white">
    <!-- Hero Section -->
    <CommonHero
      :img="{
        src: '/images/solar-system-hero.jpg',
        alt: 'Our Solar System',
      }"
      :title="{
        main: 'Our Solar System',
        subtitle:
          'Explore the planets, moons, and other celestial bodies that make up our cosmic neighborhood',
      }"
      position="center"
    >
      <p class="max-w-xl text-lg text-white bg-black/30 backdrop-blur-sm p-4 rounded-lg">
        Our solar system consists of the Sun, eight planets, countless smaller bodies like asteroids
        and comets, and the vast space between them. Join us on a journey through our cosmic
        backyard.
      </p>

      <!-- Call to action buttons -->
      <div class="mt-6 flex flex-wrap gap-4 justify-center">
        <PrimeButton
          severity="primary"
          class="bg-primary-600 hover:bg-primary-500"
        >
          <Icon
            name="mdi:telescope"
            class="mr-2"
          />
          Start Exploring
        </PrimeButton>

        <PrimeButton
          severity="secondary"
          outlined
        >
          <Icon
            name="mdi:rocket-launch-outline"
            class="mr-2"
          />
          Latest Discoveries
        </PrimeButton>
      </div>
    </CommonHero>

    <!-- Planet Navigation Tabs -->
    <PlanetTabs
      :planets="planets"
      :selected-planet="selectedPlanet"
      @update:selected-planet="selectedPlanet = $event"
    />

    <!-- Main Content -->
    <div class="wrapper py-8">
      <!-- Planet Name and 3D Render with Animation -->
      <div class="text-center mb-16">
        <h1
          class="text-5xl md:text-7xl font-bold mb-12 transition-opacity duration-300"
          :class="isChanging ? 'opacity-0' : 'opacity-100'"
        >
          {{ currentPlanet.name }}
        </h1>
        <div
          class="mx-auto max-w-2xl overflow-visible transition-all duration-500"
          :class="isChanging ? 'opacity-0 scale-90' : 'opacity-100 scale-100'"
        >
          <!-- Using PlanetModel component -->
          <LazyPlanetModel
            :key="selectedPlanet"
            hydrate-on-visible
            :planet-id="selectedPlanet"
            :auto-rotate="true"
          />
        </div>
      </div>

      <!-- Size Comparison Component -->
      <LazyPlanetSizeComparison
        hydrate-on-visible
        :planet-id="currentPlanet.id"
        :planet-name="currentPlanet.name"
      />

      <!-- Gravity Comparison Component - Lazy loaded -->
      <LazyPlanetGravityComparison
        hydrate-on-visible
        :planet-id="currentPlanet.id"
        :planet-name="currentPlanet.name"
      />

      <!-- Lazy load less important components -->
      <LazyPlanetDidYouKnow
        hydrate-on-visible
        :facts="currentPlanet.didYouKnow"
        :auto-rotate="true"
        :rotation-interval="8000"
      />

      <!-- Two Column Layout for Facts and Resources -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <!-- Facts Column -->
        <div>
          <h2 class="text-3xl font-bold mb-6">Facts</h2>
          <ul class="space-y-4">
            <li
              v-for="(fact, index) in currentPlanet.facts"
              :key="index"
              class="flex items-start"
            >
              <span class="inline-block w-2 h-2 mt-2 mr-3 bg-primary-400 rounded-full"></span>
              <span>{{ fact }}</span>
            </li>
          </ul>
        </div>

        <!-- Resources Column -->
        <div>
          <h2 class="text-3xl font-bold mb-6">Resources</h2>
          <ul class="space-y-4">
            <li
              v-for="resource in currentPlanet.resources"
              :key="resource.name"
            >
              <a
                :href="resource.url"
                class="text-primary-400 hover:text-primary-300 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ resource.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Mythology Section Component -->
      <PlanetMythology :mythology="currentPlanet.mythology" />

      <!-- Discovery Timeline Component -->
      <PlanetDiscoveryTimeline :events="currentPlanet.timeline" />

      <!-- Moons Section -->
      <div
        v-if="currentPlanet.moons && currentPlanet.moons.length > 0"
        class="mb-16"
      >
        <h2 class="text-3xl font-bold mb-8">Moons</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="moon in currentPlanet.moons"
            :key="moon.id"
            class="bg-primary-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-primary-800/50 transition-all duration-300 hover:border-primary-700"
          >
            <div class="h-48 overflow-hidden">
              <img
                :src="moon.image"
                :alt="moon.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-4">
              <h3 class="text-xl font-bold mb-2">{{ moon.name }}</h3>
              <p class="text-gray-300 text-sm">{{ moon.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="mb-16"
      >
        <h2 class="text-3xl font-bold mb-4">Moons</h2>
        <p class="text-gray-300">{{ currentPlanet.name }} has no known moons.</p>
      </div>

      <!-- Missions Timeline Component -->
      <PlanetMissionsTimeline
        :previous-missions="currentPlanet.missions.previous"
        :upcoming-missions="currentPlanet.missions.upcoming"
      />

      <!-- Video Section -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold mb-8">Learn More About {{ currentPlanet.name }}</h2>
        <div class="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
          <iframe
            :src="`https://www.youtube.com/embed/${currentPlanet.videoId}`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
