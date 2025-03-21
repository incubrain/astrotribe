<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

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

onMounted(() => {
  if (import.meta.client) {
    // Animate testimonial cards
    gsap.from('.testimonial-card', {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.testimonials-grid',
        start: 'top bottom-=100px',
      },
    })
  }
})
</script>

<template>
  <section class="py-16 md:py-24 bg-slate-900/50">
    <div class="wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <LandTitle
        title="Hear From The Community"
        subtitle="Discover how we're making a difference"
        gradient
      />

      <!-- User type filters -->
      <div class="flex flex-wrap justify-center gap-2 mt-8 mb-12">
        <PrimeButton
          outlined
          :class="[
            activeFilter === 'all'
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'border-primary-600/30 text-primary-600',
          ]"
          @click="activeFilter = 'all'"
        >
          All Users
        </PrimeButton>
        <PrimeButton
          outlined
          :class="[
            activeFilter === 'researcher'
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'border-primary-600/30 text-primary-600',
          ]"
          @click="activeFilter = 'researcher'"
        >
          <Icon
            name="mdi:file-search"
            class="mr-1"
            size="18"
          />
          Researchers
        </PrimeButton>
        <PrimeButton
          outlined
          :class="[
            activeFilter === 'educator'
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'border-primary-600/30 text-primary-600',
          ]"
          @click="activeFilter = 'educator'"
        >
          <Icon
            name="mdi:school"
            class="mr-1"
            size="18"
          />
          Educators
        </PrimeButton>
        <PrimeButton
          outlined
          :class="[
            activeFilter === 'enthusiast'
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'border-primary-600/30 text-primary-600',
          ]"
          @click="activeFilter = 'enthusiast'"
        >
          <Icon
            name="mdi:star"
            class="mr-1"
            size="18"
          />
          Enthusiasts
        </PrimeButton>
        <PrimeButton
          outlined
          :class="[
            activeFilter === 'industry'
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'border-primary-600/30 text-primary-600',
          ]"
          @click="activeFilter = 'industry'"
        >
          <Icon
            name="mdi:domain"
            class="mr-1"
            size="18"
          />
          Industry
        </PrimeButton>
      </div>

      <!-- Testimonials grid -->
      <div class="testimonials-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="testimonial in filteredTestimonials"
          :key="testimonial.id"
          class="testimonial-card group"
        >
          <!-- Card with glass effect -->
          <div
            class="h-full rounded-xl backdrop-blur-sm bg-slate-900/30 border border-slate-800/50 transition-all duration-500 hover:border-primary-600/30 p-8"
          >
            <!-- Quotation mark -->
            <div class="mb-6">
              <Icon
                name="mdi:format-quote-open"
                class="text-primary-600/40 group-hover:text-primary-600/70 transition-colors duration-300"
                size="36"
              />
            </div>

            <!-- Quote -->
            <blockquote class="text-gray-300 mb-8 italic"> "{{ testimonial.quote }}" </blockquote>

            <!-- Outcome badge -->
            <div class="mb-6">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-600/10 border border-primary-600/30 text-primary-600"
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
                class="w-12 h-12 rounded-full object-cover border border-slate-700 group-hover:border-primary-600/30 transition-colors duration-300"
              />
              <div>
                <h4 class="font-medium text-white">{{ testimonial.name }}</h4>
                <p class="text-sm text-gray-400">{{ testimonial.role }}</p>
                <p class="text-xs text-primary-600">{{ testimonial.institution }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- More testimonials button -->
      <div class="mt-10 text-center">
        <PrimeButton
          outlined
          class="border-primary-600/30 text-primary-600 hover:border-primary-600 transition-all duration-300"
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
  </section>
</template>

<style scoped>
.testimonial-card {
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
}
</style>
