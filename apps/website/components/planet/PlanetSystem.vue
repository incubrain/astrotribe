<script setup lang="ts">
// 1. Imports
import { ref, computed } from 'vue'
import type { Planet, Mission, PlanetMoon } from '~/types/solarsystem'

// 2. Component Options
defineOptions({
  name: 'SolarSystemPage',
})

// 3. Reactive Variables
const selectedPlanet = ref('jupiter')

// 4. Planets Data
const planets: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    facts: [
      'Mercury is the smallest planet in our solar system.',
      'Its surface is covered in craters, similar to our Moon.',
      'Mercury has a thin atmosphere called an exosphere.',
      'A day on Mercury lasts 59 Earth days.',
    ],
    resources: [
      { name: 'Overview', url: '#' },
      { name: 'NASA Science', url: 'https://science.nasa.gov/mercury/' },
      { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Mercury_(planet)' },
    ],
    moons: [], // Mercury has no moons
    image: '/images/planets/mercury.jpg',
    missions: {
      previous: [
        { name: 'Mariner 10', year: '1974-1975', description: 'First spacecraft to visit Mercury' },
        { name: 'MESSENGER', year: '2011-2015', description: 'First spacecraft to orbit Mercury' },
      ],
      upcoming: [
        {
          name: 'BepiColombo',
          year: '2025',
          description: 'Joint mission of ESA and JAXA to Mercury',
        },
      ],
    },
    videoId: 'FqvlxZ5lHHU', // YouTube video ID
  },
  {
    id: 'venus',
    name: 'Venus',
    facts: [
      'Venus is the hottest planet in our solar system.',
      'It has a thick atmosphere that traps heat in a runaway greenhouse effect.',
      'Venus rotates in the opposite direction to most planets.',
      'A day on Venus is longer than a year on Venus.',
    ],
    resources: [
      { name: 'Overview', url: '#' },
      { name: 'NASA Science', url: 'https://science.nasa.gov/venus/' },
      { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Venus' },
    ],
    moons: [], // Venus has no moons
    image: '/images/planets/venus.jpg',
    missions: {
      previous: [
        {
          name: 'Venera 7',
          year: '1970',
          description: 'First spacecraft to make a successful landing on Venus',
        },
        {
          name: 'Magellan',
          year: '1990-1994',
          description: 'Mapped the surface of Venus using radar',
        },
      ],
      upcoming: [
        { name: 'DAVINCI', year: '2029', description: "Will study Venus's atmosphere" },
        { name: 'VERITAS', year: '2031', description: "Will map Venus's surface" },
      ],
    },
    videoId: 'ZjWDUxLGdNA', // YouTube video ID
  },
  {
    id: 'earth',
    name: 'Earth',
    facts: [
      'Earth is the only planet known to harbor life.',
      "About 71% of Earth's surface is covered by water.",
      'Earth has a strong magnetic field that protects us from solar radiation.',
      'Earth has one natural satellite, the Moon.',
    ],
    resources: [
      { name: 'Overview', url: '#' },
      { name: 'NASA Science', url: 'https://science.nasa.gov/earth/' },
      { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Earth' },
    ],
    moons: [
      {
        id: 'moon',
        name: 'Moon',
        image: '/images/moons/moon.jpg',
        description:
          "The Moon is Earth's only natural satellite and the fifth largest moon in the solar system.",
      },
    ],
    image: '/images/planets/earth.jpg',
    missions: {
      previous: [
        {
          name: 'Apollo Program',
          year: '1969-1972',
          description: 'First human missions to the Moon',
        },
        {
          name: 'International Space Station',
          year: '1998-Present',
          description: 'Continuously inhabited orbiting laboratory',
        },
      ],
      upcoming: [
        {
          name: 'Artemis Program',
          year: '2025+',
          description: "NASA's program to return humans to the Moon",
        },
      ],
    },
    videoId: 'HCDVN7DCzYE', // YouTube video ID
  },
  {
    id: 'mars',
    name: 'Mars',
    facts: [
      'Mars is known as the Red Planet due to iron oxide (rust) on its surface.',
      'Mars has the largest volcano in the solar system, Olympus Mons.',
      'Mars has two small moons, Phobos and Deimos.',
      'Mars has polar ice caps made of water and carbon dioxide ice.',
    ],
    resources: [
      { name: 'Overview', url: '#' },
      { name: 'NASA Science', url: 'https://science.nasa.gov/mars/' },
      { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Mars' },
    ],
    moons: [
      {
        id: 'phobos',
        name: 'Phobos',
        image: '/images/moons/phobos.jpg',
        description:
          "The larger and closer of Mars' two moons, Phobos is slowly spiraling toward Mars.",
      },
      {
        id: 'deimos',
        name: 'Deimos',
        image: '/images/moons/deimos.jpg',
        description: "The smaller and more distant of Mars' two moons, with an irregular shape.",
      },
    ],
    image: '/images/planets/mars.jpg',
    missions: {
      previous: [
        { name: 'Viking 1 & 2', year: '1976', description: 'First successful landing on Mars' },
        {
          name: 'Curiosity Rover',
          year: '2012-Present',
          description: 'Studying Martian climate and geology',
        },
        {
          name: 'Perseverance Rover',
          year: '2021-Present',
          description: 'Seeking signs of ancient life',
        },
      ],
      upcoming: [
        {
          name: 'Mars Sample Return',
          year: '2033',
          description: 'Will return samples collected by Perseverance',
        },
      ],
    },
    videoId: 'D8pnmwOXhoY', // YouTube video ID
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    facts: [
      "Jupiter's atmosphere is composed mainly of hydrogen and helium.",
      'It has the most massive atmospheric vortex in the solar system, the Great Red Spot.',
      'Jupiter has a strong magnetic field and numerous faint rings.',
      'Jupiter has at least 95 moons, with four large moons discovered by Galileo.',
    ],
    resources: [
      { name: 'Overview', url: '#' },
      { name: 'NASA Science', url: 'https://science.nasa.gov/jupiter/' },
      { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Jupiter' },
    ],
    moons: [
      {
        id: 'io',
        name: 'Io',
        image: '/images/moons/io.jpg',
        description: 'The most volcanically active body in the solar system',
      },
      {
        id: 'europa',
        name: 'Europa',
        image: '/images/moons/europa.jpg',
        description: 'Covered by a layer of ice, with a subsurface ocean',
      },
      {
        id: 'ganymede',
        name: 'Ganymede',
        image: '/images/moons/ganymede.jpg',
        description: 'The largest moon in the solar system',
      },
      {
        id: 'callisto',
        name: 'Callisto',
        image: '/images/moons/callisto.jpg',
        description: 'A heavily cratered moon with a very old surface',
      },
    ],
    image: '/images/planets/jupiter.jpg',
    missions: {
      previous: [
        {
          name: 'Pioneer 10 & 11',
          year: '1973-1974',
          description: 'First spacecraft to visit Jupiter',
        },
        {
          name: 'Voyager 1 & 2',
          year: '1979',
          description: 'Detailed studies of Jupiter and its moons',
        },
        { name: 'Galileo', year: '1995-2003', description: 'First spacecraft to orbit Jupiter' },
        {
          name: 'Juno',
          year: '2016-Present',
          description: "Studying Jupiter's composition, magnetic field, and weather",
        },
      ],
      upcoming: [
        { name: 'Europa Clipper', year: '2030', description: "Will study Jupiter's moon Europa" },
        { name: 'JUICE', year: '2031', description: 'ESA mission to study Jupiter and its moons' },
      ],
    },
    videoId: 'PtkqwslnLY8', // YouTube video ID
  },
  {
    id: 'saturn',
    name: 'Saturn',
    facts: [
      'Saturn is known for its spectacular ring system.',
      'Like Jupiter, Saturn is primarily composed of hydrogen and helium.',
      'Saturn has at least 146 moons, including Titan, which has a thick atmosphere.',
      'Saturn is the least dense planet in the solar system - it would float in water.',
    ],
    resources: [
      { name: 'Overview', url: '#' },
      { name: 'NASA Science', url: 'https://science.nasa.gov/saturn/' },
      { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Saturn' },
    ],
    moons: [
      {
        id: 'titan',
        name: 'Titan',
        image: '/images/moons/titan.jpg',
        description: 'The only moon with a substantial atmosphere, and lakes of liquid methane',
      },
      {
        id: 'enceladus',
        name: 'Enceladus',
        image: '/images/moons/enceladus.jpg',
        description: 'Has water ice geysers erupting from its south pole',
      },
      {
        id: 'mimas',
        name: 'Mimas',
        image: '/images/moons/mimas.jpg',
        description: 'Has a large crater that makes it resemble the Death Star from Star Wars',
      },
    ],
    image: '/images/planets/saturn.jpg',
    missions: {
      previous: [
        { name: 'Pioneer 11', year: '1979', description: 'First spacecraft to visit Saturn' },
        {
          name: 'Voyager 1 & 2',
          year: '1980-1981',
          description: 'Detailed studies of Saturn and its moons',
        },
        {
          name: 'Cassini-Huygens',
          year: '2004-2017',
          description: 'Orbited Saturn and landed a probe on Titan',
        },
      ],
      upcoming: [
        { name: 'Dragonfly', year: '2028-2034', description: 'Rotorcraft lander mission to Titan' },
      ],
    },
    videoId: 'epZdZaEQhS0', // YouTube video ID
  },
  {
    id: 'uranus',
    name: 'Uranus',
    facts: [
      'Uranus rotates on its side, with its axis pointing nearly toward the Sun.',
      'It is an ice giant, composed mainly of ices and rocks.',
      'Uranus has 13 faint rings and 27 known moons.',
      'It appears blue-green due to methane in its atmosphere.',
    ],
    resources: [
      { name: 'Overview', url: '#' },
      { name: 'NASA Science', url: 'https://science.nasa.gov/uranus/' },
      { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Uranus' },
    ],
    moons: [
      {
        id: 'titania',
        name: 'Titania',
        image: '/images/moons/titania.jpg',
        description: 'The largest moon of Uranus',
      },
      {
        id: 'oberon',
        name: 'Oberon',
        image: '/images/moons/oberon.jpg',
        description: 'The second largest moon of Uranus',
      },
      {
        id: 'miranda',
        name: 'Miranda',
        image: '/images/moons/miranda.jpg',
        description: 'Has one of the most extreme and varied topographies in the solar system',
      },
    ],
    image: '/images/planets/uranus.jpg',
    missions: {
      previous: [
        { name: 'Voyager 2', year: '1986', description: 'Only spacecraft to visit Uranus' },
      ],
      upcoming: [
        {
          name: 'Uranus Orbiter and Probe',
          year: '2030s',
          description: 'Proposed NASA mission to orbit Uranus',
        },
      ],
    },
    videoId: 'EnY8l0eFy6k', // YouTube video ID
  },
  {
    id: 'neptune',
    name: 'Neptune',
    facts: [
      'Neptune is the windiest planet, with winds reaching 2,100 km/h.',
      'Like Uranus, Neptune is an ice giant composed mainly of ices and rocks.',
      'It has 14 known moons, Triton being the largest.',
      'Neptune was the first planet located through mathematical predictions.',
    ],
    resources: [
      { name: 'Overview', url: '#' },
      { name: 'NASA Science', url: 'https://science.nasa.gov/neptune/' },
      { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Neptune' },
    ],
    moons: [
      {
        id: 'triton',
        name: 'Triton',
        image: '/images/moons/triton.jpg',
        description: 'The largest moon of Neptune, with active nitrogen geysers',
      },
      {
        id: 'nereid',
        name: 'Nereid',
        image: '/images/moons/nereid.jpg',
        description: 'Has one of the most eccentric orbits of any moon in the solar system',
      },
    ],
    image: '/images/planets/neptune.jpg',
    missions: {
      previous: [
        { name: 'Voyager 2', year: '1989', description: 'Only spacecraft to visit Neptune' },
      ],
      upcoming: [
        {
          name: 'Neptune Odyssey',
          year: '2030s',
          description: 'Proposed NASA mission to study Neptune and Triton',
        },
      ],
    },
    videoId: 'NStnBPJr1-4', // YouTube video ID
  },
]

// 5. Computed Properties
const currentPlanet = computed(
  () => planets.find((planet) => planet.id === selectedPlanet.value) || planets[4],
) // Default to Jupiter
</script>

<template>
  <div class="min-h-screen bg-primary-950 text-white">
    <!-- Planet Navigation Tabs -->
    <div class="wrapper py-4 border-b border-primary-800">
      <div class="flex justify-center space-x-4 md:space-x-8 overflow-x-auto no-scrollbar">
        <button
          v-for="planet in planets"
          :key="planet.id"
          class="px-4 py-2 text-sm md:text-base transition-all duration-300"
          :class="
            selectedPlanet === planet.id
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-gray-400 hover:text-primary-300'
          "
          @click="selectedPlanet = planet.id"
        >
          {{ planet.name }}
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="wrapper py-8">
      <!-- Planet Name and 3D Render -->
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-7xl font-bold mb-12">{{ currentPlanet.name }}</h1>
        <div
          class="mx-auto max-w-2xl bg-black rounded-full overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.2)]"
        >
          <!-- Placeholder for ThreeJS render -->
          <img
            :src="currentPlanet.image"
            :alt="currentPlanet.name"
            class="w-full h-auto"
          />
        </div>
      </div>

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

      <!-- Missions Section -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold mb-8">Missions</h2>

        <!-- Previous Missions -->
        <h3 class="text-2xl font-semibold mb-4 text-primary-400">Previous Missions</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div
            v-for="mission in currentPlanet.missions.previous"
            :key="mission.name"
            class="bg-primary-900/30 backdrop-blur-sm p-4 rounded-lg border border-primary-800/30"
          >
            <h4 class="font-bold text-lg">{{ mission.name }}</h4>
            <p class="text-primary-300 text-sm mb-2">{{ mission.year }}</p>
            <p class="text-gray-300 text-sm">{{ mission.description }}</p>
          </div>
        </div>

        <!-- Upcoming Missions -->
        <h3 class="text-2xl font-semibold mb-4 text-primary-400">Upcoming Missions</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="mission in currentPlanet.missions.upcoming"
            :key="mission.name"
            class="bg-primary-800/30 backdrop-blur-sm p-4 rounded-lg border border-primary-700/30"
          >
            <h4 class="font-bold text-lg">{{ mission.name }}</h4>
            <p class="text-primary-300 text-sm mb-2">{{ mission.year }}</p>
            <p class="text-gray-300 text-sm">{{ mission.description }}</p>
          </div>
        </div>
      </div>

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
