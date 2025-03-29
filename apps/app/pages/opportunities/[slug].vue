<script setup lang="ts">
import { parseJobDescription, calculateDaysToDeadline, formatSalary } from '~/utils/jobFormatters'
import type { Job } from '~/types/jobs'

// Route parameters and job data loading
const route = useRoute()
const jobId = computed(() => route.params.slug as string)
const loading = ref(true)
const error = ref(null)
const job = ref<Job | null>(null)

// Format job salary
const formattedSalary = computed(() => {
  if (!job.value?.salary) return ''
  return formatSalary(job.value.salary, 'EUR')
})

// Formatted publication date
const formattedDate = computed(() => {
  if (!job.value?.published_at) return ''
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(job.value.published_at))
})

// Parse job description
const parsedDescription = computed(() => {
  if (!job.value?.description) return null
  return parseJobDescription(job.value.description)
})

// Deadline status
const daysToDeadline = computed(() => {
  if (!job.value?.expires_at) return null
  return calculateDaysToDeadline(job.value.expires_at)
})

// Cache for coordinates
const coordinatesCache = new Map()

// Loading state for map and geocoding
const isMapLoading = ref(true)
const isGeocodingLoading = ref(false)
const isLoading = computed(() => isMapLoading.value || isGeocodingLoading.value || loading.value)

// Function to convert address to coordinates with cache
const getCoordinates = async (address: string) => {
  // Check cache first
  if (coordinatesCache.has(address)) {
    return coordinatesCache.get(address)
  }

  isGeocodingLoading.value = true
  try {
    // Add delay to respect rate limit
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
      {
        headers: {
          'User-Agent': 'JobBoard/1.0', // Identifying for the API
        },
      },
    )
    const data = await response.json()

    if (data && data[0]) {
      const coordinates = [parseFloat(data[0].lat), parseFloat(data[0].lon)]
      // Cache the result
      coordinatesCache.set(address, coordinates)
      return coordinates
    }
    return [48.8566, 2.3522] // Paris default
  } catch (error) {
    console.error('Geocoding error:', error)
    return [48.8566, 2.3522] // Paris default
  } finally {
    isGeocodingLoading.value = false
  }
}

// Reactive coordinates based on job location
const mapCenter = ref([48.8566, 2.3522]) // Note: Leaflet uses [lat, lng]

// Extract tags from job description
const extractedTags = computed(() => {
  if (!job.value?.description) return []
  // This is a simple extraction - ideally you'd use a more sophisticated approach
  const commonKeywords = [
    'JavaScript',
    'Python',
    'React',
    'Vue',
    'Angular',
    'Node',
    'Java',
    'C#',
    'PHP',
    'HTML',
    'CSS',
    'TypeScript',
    'SQL',
    'AWS',
    'Docker',
    'DevOps',
    'Front-end',
    'Back-end',
    'Full-stack',
    'UI/UX',
    'Agile',
    'Scrum',
    'Machine Learning',
    'Data Science',
    'API',
  ]

  const tags: string[] = []
  if (job.value.description) {
    commonKeywords.forEach((keyword) => {
      if (job.value?.description?.toLowerCase().includes(keyword.toLowerCase())) {
        tags.push(keyword)
      }
    })
  }

  return tags.slice(0, 6) // Limit to 6 tags
})

// Similar jobs (placeholder - in a real implementation, you'd fetch related jobs from API)
const similarJobs = ref([])

// Fetch job data
const fetchJob = async () => {
  loading.value = true
  error.value = null

  try {
    // In a real implementation, you'd fetch this from your API
    // For this example, we're using dummy data
    const response = await $fetch(`/api/jobs/${jobId.value}`)

    job.value = response

    // Once we have job data, update coordinates based on location
    if (job.value && job.value.location) {
      const coords = await getCoordinates(job.value.location)
      mapCenter.value = coords
    }

    // Fetch similar jobs
    // This would be a real API call in your implementation
    // similarJobs.value = await $fetch(`/api/jobs/similar/${jobId.value}`);
  } catch (e) {
    console.error('Error fetching job:', e)
    error.value = e
  } finally {
    loading.value = false
  }
}

// Update job data when route changes
watch(() => route.params.slug, fetchJob, { immediate: true })

// Map configuration
const zoom = ref(13)
const tileLayer = {
  url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  attribution: '',
}

// Handle map loading
const handleMapReady = () => {
  setTimeout(() => {
    isMapLoading.value = false
  }, 500)
}

// Track viewed jobs in localStorage
onMounted(() => {
  if (import.meta.client) {
    const { addToRecentlyViewedJobs } = useJobStore()
    if (jobId.value) {
      addToRecentlyViewedJobs(jobId.value)
    }
  }
})
</script>

<template>
  <div class="min-h-screen container mx-auto mt-6 md:mt-12">
    <!-- Loading skeleton -->
    <JobDetailSkeleton v-if="isLoading" />

    <!-- Error state -->
    <div
      v-else-if="error"
      class="p-8 bg-red-500/10 rounded-lg border border-red-500/20 text-center"
    >
      <h2 class="text-xl font-semibold mb-2">Error loading job</h2>
      <p class="text-gray-400">Unable to load job details. Please try again later.</p>
      <NuxtLink
        to="/opportunities"
        class="inline-block mt-4 px-4 py-2 bg-primary-700 rounded-lg"
      >
        Back to Jobs
      </NuxtLink>
    </div>

    <!-- Job details when data is loaded -->
    <div
      v-else-if="job"
      class="relative"
    >
      <!-- Job header with subtle gradient -->
      <div class="relative h-[400px] rounded-t-lg overflow-hidden">
        <!-- Map background -->
        <client-only>
          <div class="absolute inset-0 z-0">
            <l-map
              style="height: 100%; width: 100%"
              :zoom="zoom"
              :center="mapCenter"
              :zoom-control="false"
              :dragging="false"
              :double-click-zoom="false"
              :scroll-wheel-zoom="false"
              :touch-zoom="false"
              @ready="handleMapReady"
            >
              <l-tile-layer
                :url="tileLayer.url"
                :attribution="tileLayer.attribution"
              />
              <l-marker :lat-lng="mapCenter" />
            </l-map>
          </div>
        </client-only>

        <!-- Overlay gradient -->
        <div
          class="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70 z-10"
        ></div>

        <!-- Content -->
        <div class="relative max-w-6xl mx-auto px-4 py-12 z-20">
          <!-- Breadcrumb -->
          <div
            class="flex items-center gap-2 text-sm text-gray-300 mb-8 backdrop-blur-sm p-2 rounded-lg"
          >
            <NuxtLink
              to="/"
              class="hover:text-primary-400 transition-colors"
              >Home</NuxtLink
            >
            <Icon
              name="heroicons:chevron-right"
              class="w-4 h-4"
            />
            <NuxtLink
              to="/opportunities"
              class="hover:text-primary-400 transition-colors"
              >Jobs</NuxtLink
            >
            <Icon
              name="heroicons:chevron-right"
              class="w-4 h-4"
            />
            <span class="text-white">{{ job.title }}</span>
          </div>

          <div class="grid lg:grid-cols-2 gap-12 items-start">
            <!-- Left column -->
            <div class="space-y-6">
              <div class="flex flex-wrap items-center gap-3">
                <span
                  class="px-3 backdrop-blur-sm py-1 bg-primary-900/50 border border-primary-700/30 text-primary-400 rounded-full text-sm font-medium"
                >
                  {{ job.location }}
                </span>

                <!-- Deadline indicator for application -->
                <DeadlineIndicator
                  v-if="job.expires_at"
                  :deadline="job.expires_at"
                  size="md"
                />

                <!-- Employment type badge -->
                <span
                  v-if="job.employmentType"
                  class="px-3 backdrop-blur-sm py-1 bg-primary-900/50 border border-primary-700/30 text-gray-300 rounded-full text-sm font-medium"
                >
                  {{ job.employmentType }}
                </span>
              </div>

              <h1 class="text-4xl font-bold text-white leading-tight">
                {{ job.title }}
              </h1>

              <div class="flex flex-wrap items-center gap-6 text-gray-300">
                <div
                  class="flex items-center gap-3 bg-primary-900/50 border border-primary-800/30 px-4 py-2 rounded-xl backdrop-blur-sm"
                >
                  <Icon
                    name="heroicons:building-office-2"
                    class="w-5 h-5 text-primary-400"
                  />
                  <span class="font-medium">{{ job.company }}</span>
                </div>
                <div
                  v-if="job.salary"
                  class="flex items-center gap-3 bg-primary-900/50 border border-primary-800/30 px-4 py-2 rounded-xl backdrop-blur-sm"
                >
                  <Icon
                    name="heroicons:currency-euro"
                    class="w-5 h-5 text-green-400"
                  />
                  <span class="font-medium text-white">{{ formattedSalary }}/year</span>
                </div>
              </div>

              <!-- Posted date display -->
              <div class="flex items-center gap-2 text-gray-400 text-sm">
                <Icon
                  name="heroicons:calendar"
                  class="w-4 h-4"
                />
                <span>Posted <TimeAgo :date="job.published_at" /></span>
              </div>
            </div>

            <!-- Right column -->
            <div class="lg:text-right space-y-6">
              <div class="flex lg:justify-end gap-3">
                <button
                  class="group relative px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/20"
                >
                  <span class="relative z-10 flex items-center gap-2">
                    <span>Apply Now</span>
                    <Icon
                      name="heroicons:arrow-right"
                      class="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </button>
                <button
                  class="p-4 text-gray-400 hover:text-primary-400 rounded-xl border border-primary-800/30 hover:border-primary-700/30 transition-all hover:shadow-lg hover:shadow-primary-600/5 bg-primary-900/50"
                >
                  <Icon
                    name="heroicons:bookmark"
                    class="w-5 h-5"
                  />
                </button>
              </div>

              <p class="text-sm text-gray-400">
                Average response time:
                <span class="text-gray-300 font-medium">48 hours</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="max-w-6xl mx-auto px-4 py-12">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Job description -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-6">
              <span
                v-for="tag in extractedTags"
                :key="tag"
                class="px-3 py-1 bg-primary-900/50 border border-primary-800/30 text-primary-400 rounded-full text-sm"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Content (parsed description) -->
            <div
              v-if="parsedDescription"
              class="prose prose-lg prose-invert max-w-none space-y-8"
            >
              <!-- Overview -->
              <div
                v-if="parsedDescription.overview"
                class="bg-primary-900/20 border border-primary-800/30 rounded-2xl p-8"
              >
                <h2 class="text-2xl font-semibold mb-4">Overview</h2>
                <p>{{ parsedDescription.overview }}</p>
              </div>

              <!-- Responsibilities -->
              <div
                v-if="parsedDescription.responsibilities.length"
                class="bg-primary-900/20 border border-primary-800/30 rounded-2xl p-8"
              >
                <h2 class="text-2xl font-semibold mb-4">Responsibilities</h2>
                <ul>
                  <li
                    v-for="(item, index) in parsedDescription.responsibilities"
                    :key="`resp-${index}`"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>

              <!-- Requirements -->
              <div
                v-if="parsedDescription.requirements.length"
                class="bg-primary-900/20 border border-primary-800/30 rounded-2xl p-8"
              >
                <h2 class="text-2xl font-semibold mb-4">Requirements</h2>
                <ul>
                  <li
                    v-for="(item, index) in parsedDescription.requirements"
                    :key="`req-${index}`"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>

              <!-- Benefits -->
              <div
                v-if="parsedDescription.benefits.length"
                class="bg-primary-900/20 border border-primary-800/30 rounded-2xl p-8"
              >
                <h2 class="text-2xl font-semibold mb-4">Benefits</h2>
                <ul>
                  <li
                    v-for="(item, index) in parsedDescription.benefits"
                    :key="`ben-${index}`"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>

              <!-- Remaining content -->
              <div
                v-if="parsedDescription.remaining"
                class="bg-primary-900/20 border border-primary-800/30 rounded-2xl p-8"
              >
                <div v-html="parsedDescription.remaining"></div>
              </div>
            </div>

            <!-- Fallback for unparsed description -->
            <div
              v-else-if="job.description"
              class="prose prose-lg prose-invert max-w-none bg-primary-900/20 border border-primary-800/30 rounded-2xl p-8"
            >
              <div v-html="job.description"></div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="h-full">
            <div class="space-y-6 sticky top-24">
              <!-- Company card -->
              <div
                class="bg-primary-900/20 border border-primary-800/30 rounded-2xl p-8 relative overflow-hidden"
              >
                <div
                  class="absolute top-0 right-0 w-32 h-32 bg-primary-800/30 rounded-full -translate-y-16 translate-x-16"
                ></div>

                <div class="relative">
                  <h2 class="text-xl font-semibold text-white mb-4">
                    {{ job.company }}
                  </h2>
                  <p class="text-gray-400 mb-6">
                    Leading company in its sector, {{ job.company }} constantly innovates to create
                    the best technological solutions.
                  </p>
                  <div class="space-y-4">
                    <div class="flex items-center gap-3 text-sm">
                      <Icon
                        name="heroicons:users"
                        class="w-5 h-5 text-primary-400"
                      />
                      <span>50-200 employees</span>
                    </div>
                    <div class="flex items-center gap-3 text-sm">
                      <Icon
                        name="heroicons:globe-europe-africa"
                        class="w-5 h-5 text-primary-400"
                      />
                      <span>{{ job.location }}</span>
                    </div>
                    <div class="flex items-center gap-3 text-sm">
                      <Icon
                        name="heroicons:building-office"
                        class="w-5 h-5 text-primary-400"
                      />
                      <span>Tech / Digital</span>
                    </div>
                  </div>
                  <a
                    href="#"
                    class="inline-flex items-center gap-2 mt-6 text-primary-400 hover:text-primary-300 font-medium"
                  >
                    <span>View full profile</span>
                    <Icon
                      name="heroicons:arrow-right"
                      class="w-4 h-4"
                    />
                  </a>
                </div>
              </div>

              <!-- Share -->
              <div class="bg-primary-900/20 border border-primary-800/30 rounded-2xl p-8">
                <h2 class="text-lg font-semibold text-white mb-4">Share this job</h2>
                <div class="grid grid-cols-3 gap-4">
                  <button
                    v-for="(network, i) in ['linkedin', 'twitter', 'facebook']"
                    :key="network"
                    class="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-primary-800/30 transition-colors group"
                  >
                    <Icon
                      :name="`simple-icons:${network}`"
                      class="w-6 h-6"
                      :class="[
                        i === 0 ? 'text-[#0077B5] group-hover:text-[#0077B5]/80' : '',
                        i === 1 ? 'text-[#1DA1F2] group-hover:text-[#1DA1F2]/80' : '',
                        i === 2 ? 'text-[#4267B2] group-hover:text-[#4267B2]/80' : '',
                      ]"
                    />
                    <span class="text-xs text-gray-400 capitalize">{{ network }}</span>
                  </button>
                </div>
              </div>

              <!-- Similar jobs -->
              <div
                v-if="similarJobs.length"
                class="bg-primary-900/20 border border-primary-800/30 rounded-2xl p-8"
              >
                <h2 class="text-lg font-semibold text-white mb-4">Similar jobs</h2>
                <div class="space-y-4">
                  <div
                    v-for="similarJob in similarJobs"
                    :key="similarJob.id"
                    class="p-4 border border-primary-800/30 rounded-xl hover:bg-primary-800/20 transition-colors"
                  >
                    <h3 class="font-medium text-white mb-1">{{ similarJob.title }}</h3>
                    <p class="text-sm text-gray-400 mb-2">{{ similarJob.company }}</p>
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-gray-500">{{ similarJob.location }}</span>
                      <NuxtLink
                        :to="`/opportunities/${similarJob.id}`"
                        class="text-primary-400 text-sm"
                        >View</NuxtLink
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Style for Markdown content */
.prose {
  font-size: 1.1rem;
  line-height: 1.8;
}

.prose h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f3f4f6;
  margin-top: 2.5rem;
  margin-bottom: 1.2rem;
}

.prose h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #e5e7eb;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose p {
  margin-top: 1.2rem;
  margin-bottom: 1.2rem;
  color: #9ca3af;
}

.prose ul {
  list-style-type: none;
  padding-left: 0;
}

.prose ul li {
  position: relative;
  padding-left: 1.8rem;
  margin: 0.8rem 0;
  color: #9ca3af;
}

.prose ul li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.7rem;
  width: 0.5rem;
  height: 0.5rem;
  background-color: #6366f1;
  border-radius: 50%;
}

/* Map styles */
.leaflet-container {
  filter: grayscale(100%) brightness(40%) !important;
}

/* Hide Mapbox controls */
.mapboxgl-control-container {
  display: none;
}

/* Hide Leaflet controls */
.leaflet-control-container {
  display: none;
}

/* Hide marker shadow */
.leaflet-shadow-pane {
  display: none;
}

/* Entry animation for elements */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}

/* Enhanced glassmorphism effect */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
