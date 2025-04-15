<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const { conf: motionConstants } = useAnimation()
const { trackUserEngagement } = useAnalytics()

// Testimonials data
const testimonials = ref([
  {
    id: 1,
    name: 'Dr. Rachel Thompson',
    role: 'Astronomy PhD Candidate',
    institution: 'MIT Department of Physics',
    image: '/images/hero-image.jpg',
    quote:
      "AstronEra has reduced my literature review time by 70%. I can explore research gaps and find relevant papers in minutes instead of days. It's become an essential tool for my doctoral work.",
    outcome: 'Reduced research time by 70%',
    userType: 'researcher',
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    role: 'Astronomy Professor',
    institution: 'University of California',
    image: '/images/hero-image.jpg',
    quote:
      'I recommend AstronEra to all my graduate students. The ability to contextualize queries with specific papers has transformed how we approach new research questions and hypothesis generation.',
    outcome: 'Streamlined hypothesis generation',
    userType: 'researcher',
  },
  {
    id: 3,
    name: 'Samantha Wright',
    role: 'Space Enthusiast',
    institution: 'Amateur Astronomy Club',
    image: '/images/hero-image.jpg',
    quote:
      'As someone passionate about astronomy but without formal training, AstronEra helps me understand complex concepts by explaining them in accessible ways while still linking to the scientific sources.',
    outcome: 'Made complex astronomy accessible',
    userType: 'enthusiast',
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    role: 'Research Lead',
    institution: 'NewSpace Technologies',
    image: '/images/hero-image.jpg',
    quote:
      'Our R&D team uses AstronEra daily to stay current on industry developments and identify potential collaboration opportunities. The knowledge clustering feature has been particularly valuable for our innovation processes.',
    outcome: 'Accelerated innovation process',
    userType: 'industry',
  },
  {
    id: 5,
    name: 'Maria Gonzalez',
    role: 'Science Journalist',
    institution: 'AstroNews Network',
    image: '/images/hero-image.jpg',
    quote:
      'AstronEra helps me fact-check astronomy news quickly with reliable sources. The Press Kit Generator has revolutionized how I create accurate, accessible articles about complex space discoveries.',
    outcome: 'Improved reporting accuracy',
    userType: 'communicator',
  },
  {
    id: 6,
    name: 'Dr. Priya Sharma',
    role: 'Astrophysics Researcher',
    institution: 'TIFR, Mumbai',
    image: '/images/hero-image.jpg',
    quote:
      'The platform helped me connect with international researchers and access global resources that were previously difficult to find. AstronEra bridges geography and makes astronomy truly global.',
    outcome: 'Enhanced international collaboration',
    userType: 'researcher',
  },
])

// Filter by user type
const activeFilter = ref('all')
const filteredTestimonials = computed(() => {
  if (activeFilter.value === 'all') return testimonials.value
  return testimonials.value.filter((t) => t.userType === activeFilter.value)
})

// Auto-advance timer
let autoAdvanceTimer: number | null = null
const autoAdvanceInterval = 5000 // 5 seconds

// Track which testimonials are viewed
const trackTestimonialView = (testimonialId: number) => {
  trackUserEngagement(UserEngagementMetric.ContentPerformance, {
    contentType: 'testimonial',
    testimonialId,
  })
}

// Set up auto-advance
const autoAdvance = () => {
  if (autoAdvanceTimer) {
    window.clearInterval(autoAdvanceTimer)
  }

  autoAdvanceTimer = window.setInterval(() => {
    if (activeSlideIndex.value < filteredTestimonials.value.length - 1) {
      activeSlideIndex.value++
    } else {
      activeSlideIndex.value = 0
    }
  }, autoAdvanceInterval)
}

// Filter testimonials by persona
const filterTestimonialsByPersona = (persona: string) => {
  activeFilter.value = persona
  activeSlideIndex.value = 0

  // Track filter use
  trackUserEngagement(UserEngagementMetric.FeatureAdoption, {
    feature: 'testimonial_filter',
    filter: persona,
  })

  // Reset auto-advance
  autoAdvance()
}

// Active slide tracking
const activeSlideIndex = ref(0)

// Previous and next functions
const goToPrev = () => {
  if (activeSlideIndex.value > 0) {
    activeSlideIndex.value--
  } else {
    activeSlideIndex.value = filteredTestimonials.value.length - 1
  }
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, { action: 'testimonial_prev' })
}

const goToNext = () => {
  if (activeSlideIndex.value < filteredTestimonials.value.length - 1) {
    activeSlideIndex.value++
  } else {
    activeSlideIndex.value = 0
  }
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, { action: 'testimonial_next' })
}

// Define user type colors
const userTypeColors = {
  researcher: 'from-blue-600 to-primary-600',
  communicator: 'from-primary-600 to-emerald-600',
  enthusiast: 'from-amber-600 to-orange-600',
  industry: 'from-indigo-600 to-purple-600',
}

// Handle lifecycle
onMounted(() => {
  autoAdvance()
})

onBeforeUnmount(() => {
  if (autoAdvanceTimer) {
    window.clearInterval(autoAdvanceTimer)
  }
})
</script>

<template>
  <section
    id="testimonials"
    class="py-20 md:py-28 relative"
  >
    <!-- Background with subtle gradient -->
    <div class="absolute inset-0 bg-gradient-to-b from-slate-950 to-primary-950/70 z-0"></div>

    <!-- Glow effects -->
    <div class="absolute left-20 top-40 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl"></div>
    <div class="absolute right-20 bottom-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>

    <div class="wrapper relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div
        v-motion="motionConstants.sectionTitle"
        class="text-center max-w-3xl mx-auto mb-12"
      >
        <h2 class="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Hear From
          <span class="bg-gradient-to-r from-blue-500 to-primary-600 bg-clip-text text-transparent"
            >The Community</span
          >
        </h2>
        <p class="text-xl text-gray-300"> Discover how we're making a difference </p>
      </div>

      <!-- User type filters -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.2 } }"
        class="flex flex-wrap justify-center gap-3 mt-8 mb-12"
      >
        <button
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :visibleOnce="{ opacity: 1, scale: 1, transition: { delay: 0.3 } }"
          class="px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
          :class="
            activeFilter === 'all'
              ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg shadow-primary-900/30'
              : 'bg-slate-800/70 text-gray-300 border border-slate-700 hover:bg-slate-700/70'
          "
          @click="filterTestimonialsByPersona('all')"
        >
          All Users
        </button>

        <button
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :visibleOnce="{ opacity: 1, scale: 1, transition: { delay: 0.35 } }"
          class="px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
          :class="
            activeFilter === 'researcher'
              ? 'bg-gradient-to-r from-blue-600 to-primary-600 text-white shadow-lg shadow-primary-900/30'
              : 'bg-slate-800/70 text-gray-300 border border-slate-700 hover:bg-slate-700/70'
          "
          @click="filterTestimonialsByPersona('researcher')"
        >
          <Icon
            name="mdi:file-search"
            class="text-blue-500"
            size="18"
          />
          Researchers
        </button>

        <button
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :visibleOnce="{ opacity: 1, scale: 1, transition: { delay: 0.4 } }"
          class="px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
          :class="
            activeFilter === 'communicator'
              ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white shadow-lg shadow-primary-900/30'
              : 'bg-slate-800/70 text-gray-300 border border-slate-700 hover:bg-slate-700/70'
          "
          @click="filterTestimonialsByPersona('communicator')"
        >
          <Icon
            name="mdi:broadcast"
            class="text-emerald-500"
            size="18"
          />
          Communicators
        </button>

        <button
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :visibleOnce="{ opacity: 1, scale: 1, transition: { delay: 0.45 } }"
          class="px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
          :class="
            activeFilter === 'enthusiast'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-primary-900/30'
              : 'bg-slate-800/70 text-gray-300 border border-slate-700 hover:bg-slate-700/70'
          "
          @click="filterTestimonialsByPersona('enthusiast')"
        >
          <Icon
            name="mdi:star"
            class="text-amber-500"
            size="18"
          />
          Enthusiasts
        </button>

        <button
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :visibleOnce="{ opacity: 1, scale: 1, transition: { delay: 0.5 } }"
          class="px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
          :class="
            activeFilter === 'industry'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-primary-900/30'
              : 'bg-slate-800/70 text-gray-300 border border-slate-700 hover:bg-slate-700/70'
          "
          @click="filterTestimonialsByPersona('industry')"
        >
          <Icon
            name="mdi:domain"
            class="text-indigo-500"
            size="18"
          />
          Industry
        </button>
      </div>

      <!-- Testimonial carousel -->
      <div class="relative px-12 max-w-4xl mx-auto">
        <!-- Navigation arrows -->
        <button
          class="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-800/70 border border-slate-700/50 flex items-center justify-center text-gray-300 hover:bg-primary-900/60 hover:text-white transition-colors duration-300 z-10"
          @click="goToPrev"
        >
          <Icon
            name="mdi:chevron-left"
            size="24"
          />
        </button>

        <button
          class="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-800/70 border border-slate-700/50 flex items-center justify-center text-gray-300 hover:bg-primary-900/60 hover:text-white transition-colors duration-300 z-10"
          @click="goToNext"
        >
          <Icon
            name="mdi:chevron-right"
            size="24"
          />
        </button>

        <!-- Carousel slides -->
        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${activeSlideIndex * 100}%)` }"
          >
            <div
              v-for="(testimonial, index) in filteredTestimonials"
              :key="testimonial.id"
              class="w-full flex-shrink-0"
              @mouseenter="trackTestimonialView(testimonial.id)"
            >
              <!-- Testimonial card -->
              <div
                class="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800/50 p-8 transition-all duration-500 hover:border-primary-700/40 shadow-lg shadow-slate-900/30"
              >
                <!-- Quotation mark -->
                <div class="mb-6">
                  <Icon
                    name="mdi:format-quote-open"
                    class="text-primary-800/40"
                    size="36"
                  />
                </div>

                <!-- Quote -->
                <blockquote class="text-gray-300 mb-8 italic relative z-10 text-lg">
                  "{{ testimonial.quote }}"
                </blockquote>

                <!-- Outcome badge -->
                <div class="mb-6">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-900/30 border border-primary-800/40 text-primary-500"
                  >
                    <Icon
                      name="mdi:check-circle"
                      class="mr-1"
                      size="16"
                    />
                    {{ testimonial.outcome }}
                  </span>
                </div>

                <!-- Author info -->
                <div class="flex items-center gap-4">
                  <img
                    :src="testimonial.image"
                    :alt="testimonial.name"
                    class="w-12 h-12 rounded-full object-cover border border-slate-700"
                  />

                  <div>
                    <h4 class="font-medium text-white">{{ testimonial.name }}</h4>
                    <p class="text-sm text-gray-400">{{ testimonial.role }}</p>
                    <p class="text-xs text-primary-500">{{ testimonial.institution }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dots indicator -->
        <div class="flex justify-center mt-8 space-x-2">
          <button
            v-for="(_, index) in filteredTestimonials"
            :key="index"
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="
              index === activeSlideIndex
                ? 'bg-primary-600 scale-110'
                : 'bg-slate-700 hover:bg-primary-800'
            "
            @click="activeSlideIndex = index"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.transform {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}
</style>
