<script setup lang="ts">
import courses from './courses.json'

definePageMeta({
  name: 'Courses',
})

// Configure animation for section entries
const { conf, animateCounter } = useAnimation()

// Filter options
const filters = ref({
  search: '',
  paid: 'all', // 'all', 'free', 'paid'
  sort: 'newest', // 'newest', 'highest-rated', 'popular'
})

// Computed property for filtered courses
const filteredCourses = computed(() => {
  let result = [...courses]

  // Apply search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    result = result.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm) ||
        course.headline.toLowerCase().includes(searchTerm),
    )
  }

  // Apply paid/free filter
  if (filters.value.paid === 'free') {
    result = result.filter((course) => !course.is_paid)
  } else if (filters.value.paid === 'paid') {
    result = result.filter((course) => course.is_paid)
  }

  // Apply sorting
  if (filters.value.sort === 'newest') {
    result.sort((a, b) => new Date(b.created) - new Date(a.created))
  } else if (filters.value.sort === 'highest-rated') {
    result.sort((a, b) => b.rating - a.rating)
  } else if (filters.value.sort === 'popular') {
    result.sort((a, b) => b.num_reviews - a.num_reviews)
  }

  return result
})

// Stats for the counter section
const stats = [{ value: courses.length, label: 'Courses', icon: 'i-lucide-book-open' }]

// Format description to show only first paragraph
const formatDescription = (description: string) => {
  const firstParagraph = description.match(/<p>(.*?)<\/p>/)?.[1] || ''
  return firstParagraph.length > 150 ? firstParagraph.substring(0, 150) + '...' : firstParagraph
}

// Format date in readable format
const formatDate = (dateString: string) => {
  if (!dateString) return 'Coming Soon'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Initialize counters when the page is mounted
onMounted(() => {
  // Animate counter elements
  animateCounter('[data-value]', {
    duration: 2000,
    delay: 300,
    stagger: 0.2,
  })
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <IBImageHero
      img="{ src: '/images/courses/courses-hero.jpg', alt: 'AstronEra Courses' }"
      :title="{
        main: 'Explore Our Astronomy Courses',
        sub: 'Learn, discover, and grow with expert-led courses',
      }"
      fit="cover"
      object-position="center"
    />

    <!-- Stats Counter Section -->
    <div class="bg-slate-900">
      <div class="wrapper py-12">
        <div class="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div
            v-for="(stat, index) in stats"
            :key="index"
            v-motion
            :initial="conf.fadeUp.initial"
            :enter="{ ...conf.fadeUp.enter, transition: { delay: 0.1 * index } }"
            class="flex flex-col items-center justify-center text-center"
          >
            <div
              class="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20"
            >
              <div :class="[stat.icon, 'text-3xl text-blue-400']"></div>
            </div>
            <div class="mt-2 flex flex-col">
              <span
                class="text-3xl font-bold text-white"
                :data-value="stat.value"
              >
                0
              </span>
              <span class="text-sm text-slate-400">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Courses Section -->
    <div class="wrapper my-12">
      <!-- Filters -->
      <div
        v-motion
        :initial="conf.fadeUp.initial"
        :enter="conf.fadeUp.enter"
        class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <h2 class="text-3xl font-bold">Our Courses</h2>

        <div class="flex flex-wrap gap-3">
          <!-- Search -->
          <div class="relative">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search courses..."
              class="rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-white"
            />
            <div class="absolute left-3 top-1/2 -translate-y-1/2">
              <div class="i-lucide-search text-slate-400"></div>
            </div>
          </div>

          <!-- Filter Dropdown -->
          <select
            v-model="filters.paid"
            class="rounded-lg border border-slate-700 bg-slate-800 py-2 px-4 text-white"
          >
            <option value="all">All Courses</option>
            <option value="free">Free Courses</option>
            <option value="paid">Paid Courses</option>
          </select>

          <!-- Sort Dropdown -->
          <select
            v-model="filters.sort"
            class="rounded-lg border border-slate-700 bg-slate-800 py-2 px-4 text-white"
          >
            <option value="newest">Newest First</option>
            <option value="highest-rated">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <!-- Course Cards -->
      <div class="space-y-6">
        <div
          v-for="(course, index) in filteredCourses"
          :key="course.id"
          v-motion
          :initial="conf.fadeUp.initial"
          :enter="{ ...conf.fadeUp.enter, transition: { delay: 0.1 * index } }"
        >
          <IBGlass
            :gradient="index % 2 === 0 ? 'blue' : 'purple'"
            intensity="low"
            interactive
            hover-effect="lift"
            class="overflow-hidden"
          >
            <div class="flex flex-col md:flex-row">
              <!-- Course Thumbnail -->
              <div class="md:w-1/3 lg:w-1/4 flex-shrink-0">
                <IBImage
                  :img="{ src: course.thumbnail, alt: course.title }"
                  class="h-60 w-full object-cover md:h-full"
                />
              </div>

              <!-- Course Info -->
              <div class="flex flex-col justify-between p-6 md:w-2/3 lg:w-3/4">
                <div>
                  <!-- Title & Badge -->
                  <div class="mb-2 flex items-start justify-between">
                    <h3 class="text-2xl font-bold">{{ course.title }}</h3>
                  </div>

                  <!-- Headline -->
                  <p class="mb-4 text-lg italic text-slate-400">{{ course.headline }}</p>

                  <!-- Description -->
                  <p
                    v-html="formatDescription(course.description)"
                    class="mb-4 text-sm text-slate-300"
                  />
                </div>

                <div class="flex flex-wrap items-center justify-between">
                  <!-- Instructor & Ratings -->
                  <div class="mb-4 md:mb-0">
                    <div class="flex items-center mb-1">
                      <div class="i-lucide-user mr-2 text-slate-400"></div>
                      <span>{{ course?.visible_instructors[0]?.name }}</span>
                    </div>
                    <div class="flex items-center">
                      <div class="flex">
                        <div
                          v-for="n in 5"
                          :key="n"
                          :class="[
                            'i-lucide-star text-base',
                            n <= Math.round(course.rating) ? 'text-amber-400' : 'text-slate-600',
                          ]"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <!-- CTA & Date -->
                  <div class="flex flex-col items-end">
                    <p
                      v-if="course?.published_time"
                      class="mb-2 text-xs text-slate-400"
                    >
                      {{ formatDate(course.published_time) }}
                    </p>
                    <NuxtLink
                      :to="course.url"
                      class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      View Course
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </IBGlass>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredCourses.length === 0"
        class="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 p-12 text-center"
      >
        <div class="i-lucide-search-x mb-4 text-5xl text-slate-500"></div>
        <h3 class="mb-2 text-xl font-medium">No courses found</h3>
        <p class="text-slate-400">Try adjusting your search or filters</p>
      </div>
    </div>

    <!-- CTA Section -->
    <div
      v-motion
      :initial="conf.fadeUp.initial"
      :enter="conf.fadeUp.enter"
      class="wrapper my-16"
    >
      <IBGlass
        gradient="mixed"
        intensity="medium"
        class="p-12 text-center"
      >
        <h2 class="mb-4 text-3xl font-bold">Ready to Explore the Universe?</h2>
        <p class="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
          Join thousands of students on a journey to understand the cosmos. From beginner astronomy
          to advanced astrophysics, we have courses for every level.
        </p>
        <NuxtLink
          to="/register"
          class="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
        >
          <span class="i-lucide-rocket mr-2"></span>
          Start Learning Today
        </NuxtLink>
      </IBGlass>
    </div>
  </div>
</template>

<style scoped>
/* Any page-specific styles here */
</style>
