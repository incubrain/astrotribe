<script setup lang="ts">
interface Course {
  id: string
  title: string
  subtitle: string
  link: string
  duration: string
  originalPrice: number
  discountPrice: number
  imageUrl: string
  highlights: string[]
  isNew?: boolean
}

const courses: Course[] = [
  {
    id: 'astronomers-starter-pack',
    title: "Astronomer's Starter Pack",
    subtitle: 'Unravel the Mysteries of the Cosmos',
    link: 'https://www.udemy.com/course/astronomers-starter-pack/?referralCode=D448B234A51124F8A4FC',
    duration: '2 hours',
    originalPrice: 1499,
    discountPrice: 399,
    imageUrl: '/images/course-2.webp', // Path to DALL-E generated image
    isNew: true,
    highlights: [
      'Explore galaxy formation',
      'Understand black holes',
      'Study massive pulsars',
      'Learn about AGNs',
    ],
  },
  {
    id: 'observational-astronomy',
    title: 'Observational Astronomy',
    subtitle: 'For Scientific Applications',
    link: 'https://www.udemy.com/course/observational-astronomy-for-scientific-applications/?referralCode=5A7CE7E94086C6662DF0',
    duration: '3.5 hours',
    originalPrice: 2499,
    discountPrice: 399,
    imageUrl: '/images/course-2.webp', // Path to DALL-E generated image
    highlights: [
      'Conduct home experiments',
      'Master image processing',
      'Track satellites',
      'Hunt exoplanets',
    ],
  },
]

// Use local storage to maintain course rotation
const storageKey = 'lastShownCourseIndex'
const getLastShownIndex = () => {
  const stored = localStorage.getItem(storageKey)
  return stored ? parseInt(stored) : -1
}

const currentCourse = computed(() => {
  const lastIndex = getLastShownIndex()
  const newIndex = (lastIndex + 1) % courses.length
  localStorage.setItem(storageKey, newIndex.toString())
  return courses[newIndex]
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

const discountPercentage = computed(() => {
  const course = currentCourse.value
  return Math.round(((course.originalPrice - course.discountPrice) / course.originalPrice) * 100)
})
</script>

<template>
  <div class="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 border-b border-gray-800">
    <div class="max-w-[940px] mx-auto px-4 py-8 md:px-8">
      <!-- Main container with relative positioning for background image -->
      <div class="relative overflow-hidden rounded-xl">
        <!-- Background image with overlay -->
        <div class="absolute inset-0">
          <img
            :src="currentCourse.imageUrl"
            :alt="currentCourse.title"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-900/80"
          ></div>
        </div>

        <!-- Content -->
        <div class="relative p-8">
          <!-- Header -->
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <span class="bg-yellow-500 text-black font-bold px-4 py-1.5 rounded-full text-sm"
              >BLACK FRIDAY</span
            >
            <span class="text-yellow-500 font-medium">3 days left!</span>
          </div>

          <!-- Course Info -->
          <div class="max-w-2xl">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-3">
              {{ currentCourse.title }}
            </h2>
            <p class="text-xl text-gray-200 mb-8">
              {{ currentCourse.subtitle }}
            </p>

            <!-- Course Highlights -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div
                v-for="highlight in currentCourse.highlights"
                :key="highlight"
                class="flex items-center gap-3 text-gray-200"
              >
                <Icon
                  name="mdi:check-circle"
                  class="text-green-400 flex-shrink-0"
                  size="20"
                />
                <span class="text-lg">{{ highlight }}</span>
              </div>
            </div>

            <!-- Price and CTA -->
            <div class="flex flex-wrap items-center gap-6">
              <div class="flex items-baseline gap-3">
                <span class="text-3xl font-bold text-white">{{
                  formatPrice(currentCourse.discountPrice)
                }}</span>
                <span class="text-xl text-gray-400 line-through">{{
                  formatPrice(currentCourse.originalPrice)
                }}</span>
                <span class="text-green-400 font-medium text-lg"
                  >{{ discountPercentage }}% off</span
                >
              </div>
              <a
                :href="currentCourse.link"
                target="_blank"
                class="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full transition-all text-lg font-medium hover:scale-105"
              >
                <Icon
                  name="mdi:rocket-launch"
                  size="20"
                />
                Enroll Now
              </a>
            </div>

            <!-- Money Back Guarantee -->
            <div class="mt-6 text-gray-300 flex items-center gap-2">
              <Icon
                name="mdi:shield-check"
                class="text-green-400"
              />
              30-Day Money-Back Guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stars-small,
.stars-medium,
.stars-large {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(1px, rgba(255, 255, 255, 0.5) 1px, transparent 0),
    radial-gradient(2px, rgba(255, 255, 255, 0.3) 1px, transparent 0),
    radial-gradient(3px, rgba(255, 255, 255, 0.2) 1px, transparent 0);
  background-size:
    100px 100px,
    200px 200px,
    300px 300px;
  animation: stars-animation 100s linear infinite;
}

@keyframes stars-animation {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}
</style>
