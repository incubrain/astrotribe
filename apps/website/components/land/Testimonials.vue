<script setup lang="ts">
import { ref, computed } from 'vue'

const { conf: motionConstants } = useAnimation()

// Testimonials data
const testimonials = ref([
  {
    id: 1,
    name: 'Dr. Rachel Thompson',
    role: 'Astronomy PhD Candidate',
    institution: 'MIT Department of Physics',
    image: '/images/hero-image.jpg',
    quote:
      "AstroQuery has reduced my literature review time by 70%. I can explore research gaps and find relevant papers in minutes instead of days. It's become an essential tool for my doctoral work.",
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
      'I recommend AstroQuery to all my graduate students. The ability to contextualize queries with specific papers has transformed how we approach new research questions and hypothesis generation.',
    outcome: 'Streamlined hypothesis generation',
    userType: 'educator',
  },
  {
    id: 3,
    name: 'Samantha Wright',
    role: 'Space Enthusiast',
    institution: 'Amateur Astronomy Club',
    image: '/images/hero-image.jpg',
    quote:
      'As someone passionate about astronomy but without formal training, AstroQuery helps me understand complex concepts by explaining them in accessible ways while still linking to the scientific sources.',
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
      'Our R&D team uses AstroQuery daily to stay current on industry developments and identify potential collaboration opportunities. The knowledge clustering feature has been particularly valuable for our innovation processes.',
    outcome: 'Accelerated innovation process',
    userType: 'industry',
  },
])

// Filter by user type
const activeFilter = ref('all')
const filteredTestimonials = computed(() => {
  if (activeFilter.value === 'all') return testimonials.value
  return testimonials.value.filter((t) => t.userType === activeFilter.value)
})

const userTypeColors = {
  researcher: 'from-blue-600 to-primary-600',
  educator: 'from-primary-600 to-emerald-600',
  enthusiast: 'from-amber-600 to-orange-600',
  industry: 'from-indigo-600 to-purple-600',
}
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
          @click="activeFilter = 'all'"
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
          @click="activeFilter = 'researcher'"
        >
          <Icon
            name="mdi:file-search"
            class="text-blue-500"
            size="18"
          />
          Researcher
        </button>

        <button
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :visibleOnce="{ opacity: 1, scale: 1, transition: { delay: 0.4 } }"
          class="px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
          :class="
            activeFilter === 'educator'
              ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white shadow-lg shadow-primary-900/30'
              : 'bg-slate-800/70 text-gray-300 border border-slate-700 hover:bg-slate-700/70'
          "
          @click="activeFilter = 'educator'"
        >
          <Icon
            name="mdi:school"
            class="text-emerald-500"
            size="18"
          />
          Educators
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
          @click="activeFilter = 'enthusiast'"
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
          @click="activeFilter = 'industry'"
        >
          <Icon
            name="mdi:domain"
            class="text-indigo-500"
            size="18"
          />
          Industry
        </button>
      </div>

      <!-- Testimonials grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div
          v-for="(testimonial, index) in filteredTestimonials"
          :key="testimonial.id"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visibleOnce="{
            opacity: 1,
            y: 0,
            transition: {
              type: 'spring',
              stiffness: 150,
              damping: 20,
              delay: 0.5 + index * 0.15,
            },
          }"
          class="group"
        >
          <!-- Card with glass effect -->
          <div
            class="relative h-full rounded-xl backdrop-blur-sm bg-slate-900/30 border border-slate-800/50 transition-all duration-500 hover:border-primary-800/40 p-8 shadow-lg shadow-primary-900/5 hover:shadow-xl hover:shadow-primary-900/10 transform hover:-translate-y-2"
          >
            <!-- Subtle gradient overlay based on user type -->
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br rounded-xl"
              :class="userTypeColors[testimonial.userType]"
            ></div>

            <!-- Quotation mark -->
            <div class="mb-6">
              <Icon
                name="mdi:format-quote-open"
                class="text-primary-800/40 group-hover:text-primary-600/40 transition-colors duration-300"
                size="36"
              />
            </div>

            <!-- Quote -->
            <blockquote class="text-gray-300 mb-8 italic relative z-10">
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
                class="w-12 h-12 rounded-full object-cover border border-slate-700 group-hover:border-primary-800/40 transition-colors duration-300"
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

      <!-- More testimonials button -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.8 } }"
        class="mt-12 text-center"
      >
        <div class="inline-block p-0.5 rounded-md bg-gradient-to-r from-primary-600 to-blue-600">
          <PrimeButton
            outlined
            class="bg-slate-900 text-white border-none shadow-lg shadow-primary-900/20 hover:bg-slate-800 transition-all duration-300"
          >
            View More Testimonials
            <Icon
              name="mdi:chevron-down"
              class="ml-1"
              size="18"
            />
          </PrimeButton>
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
