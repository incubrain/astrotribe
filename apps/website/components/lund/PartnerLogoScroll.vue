<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import AutoScroll from 'embla-carousel-auto-scroll'
import testimonials from '@/assets/data/testimonials.json'
import { usePersona } from '~/composables/usePersona'
import { useAnalytics, UserEngagementMetric } from '#imports'

const { trackUserEngagement, trackCTAClick } = useAnalytics()

// Get persona state from our composable
const { activePersona, personaStyles, isResearcher, isCommunicator, isEnthusiast } = usePersona()

// Main set of partners
const allPartners = [
  {
    name: 'NASA',
    image: 'logos/nasa-logo.svg',
    type: 'agency',
    personas: ['researcher', 'sci-commer', 'enthusiast'],
  },
  {
    name: 'ESA',
    image: 'logos/esa-logo.png',
    type: 'agency',
    personas: ['researcher', 'sci-commer', 'enthusiast'],
  },
  {
    name: 'ISRO',
    image: 'logos/isro-logo.png',
    type: 'agency',
    personas: ['researcher', 'sci-commer', 'enthusiast'],
  },
  {
    name: 'ArXiv',
    image: 'logos/arxiv_logo.png',
    type: 'data',
    personas: ['researcher'],
  },
  {
    name: 'Nature',
    image: 'logos/nature_logo.png',
    type: 'publisher',
    personas: ['researcher', 'sci-commer'],
  },
  {
    name: 'Science',
    image: 'logos/science_logo.png',
    type: 'publisher',
    personas: ['researcher', 'sci-commer'],
  },
  {
    name: 'AAAS',
    image: 'logos/aaas-logo.png',
    type: 'publisher',
    personas: ['researcher', 'sci-commer'],
  },
  {
    name: 'Google Scholar',
    image: 'logos/google-scholar-logo.png',
    type: 'data',
    personas: ['researcher'],
  },
  {
    name: 'IEEE',
    image: 'logos/ieee-logo.png',
    type: 'publisher',
    personas: ['researcher'],
  },
  {
    name: 'JAXA',
    image: 'logos/jaxa-logo.png',
    type: 'agency',
    personas: ['researcher', 'sci-commer', 'enthusiast'],
  },
  // Additional sources
  {
    name: 'Space.com',
    image: 'logos/space-com-logo.png',
    type: 'media',
    personas: ['sci-commer', 'enthusiast'],
  },
  {
    name: 'SETI Institute',
    image: 'logos/seti-logo.png',
    type: 'agency',
    personas: ['researcher', 'enthusiast'],
  },
]

// Filter sources based on the active persona
const filteredPartners = computed(() => {
  const personaName = activePersona.value.name.toLowerCase()
  const filtered = allPartners.filter((partner) => partner.personas.includes(personaName))
  return [...filtered, ...filtered]
})

// AI technology partners - don't filter these
const aiTechnologies = [
  { name: 'Claude AI', image: 'partners/claude-ai-icon.png' },
  { name: 'Google Gemini', image: 'partners/google-gemini-icon.png' },
  { name: 'Grok', image: 'partners/grok-icon.png' },
  { name: 'Hugging Face', image: 'partners/huggingface-icon.png' },
  { name: 'Mistral AI', image: 'partners/mistral-ai-icon.png' },
  { name: 'OpenAI', image: 'partners/openai-icon.png' },
  { name: 'Claude AI', image: 'partners/claude-ai-icon.png' },
  { name: 'Google Gemini', image: 'partners/google-gemini-icon.png' },
  { name: 'Grok', image: 'partners/grok-icon.png' },
  { name: 'Hugging Face', image: 'partners/huggingface-icon.png' },
  { name: 'Mistral AI', image: 'partners/mistral-ai-icon.png' },
  { name: 'OpenAI', image: 'partners/openai-icon.png' },
]

// Set up testimonials carousel with auto-scroll (fastest)
const [testimonialsRef, testimonialsApi] = useEmblaCarousel(
  { loop: true, align: 'start', containScroll: 'trimSnaps' },
  [AutoScroll({ speed: 0.8, direction: 'forward', stopOnInteraction: false })],
)

// Set up AI technologies carousel with auto-scroll (medium speed)
const [technologiesRef, technologiesApi] = useEmblaCarousel(
  { loop: true, align: 'start', containScroll: 'trimSnaps' },
  [AutoScroll({ speed: 0.6, direction: 'forward', stopOnInteraction: false })],
)

// Set up partners carousel with auto-scroll (slower speed)
const [partnersRef, partnersApi] = useEmblaCarousel(
  { loop: true, align: 'start', containScroll: 'trimSnaps' },
  [AutoScroll({ speed: 0.3, direction: 'forward', stopOnInteraction: false })],
)

// Track user engagement
const trackElementView = (element, type) => {
  try {
    trackUserEngagement(UserEngagementMetric.ContentPerformance, {
      contentType: type,
      element,
      persona: activePersona.value.name,
    })
  } catch (error) {
    console.error('Error tracking element view:', error)
  }
}

// Calculate sources count based on persona
const sourcesCount = computed(() => {
  // Different count for different personas to personalize the experience
  const personaName = activePersona.value.name.toLowerCase()
  const baseCounts = {
    'researcher': 170,
    'sci-commer': 150,
    'enthusiast': 130,
  }

  return baseCounts[personaName] || 150
})

// Init embla when mounted
onMounted(() => {
  // Re-init carousels to ensure proper setup
  if (testimonialsApi.value) testimonialsApi.value.reInit()
  if (technologiesApi.value) technologiesApi.value.reInit()
  if (partnersApi.value) partnersApi.value.reInit()
})

// Get a badge class based on user type
const getUserTypeBadgeClass = (userType) => {
  const classMap = {
    'researcher': 'bg-blue-900/30 text-blue-400 border-blue-800/30',
    'sci-commer': 'bg-red-900/30 text-red-400 border-red-800/30',
    'enthusiast': 'bg-amber-900/30 text-amber-400 border-amber-800/30',
    'industry': 'bg-indigo-900/30 text-indigo-400 border-indigo-800/30',
  }
  return classMap[userType] || 'bg-gray-900/30 text-gray-400 border-gray-800/30'
}
</script>

<template>
  <section class="py-12 relative overflow-hidden">
    <div class="wrapper relative z-10 max-w-7xl mx-auto px-4">
      <!-- Section header -->
      <LundTitle
        :title="{
          main: 'The Best Global Sources & Cutting-Edge AI Tech',
        }"
        alignment="center"
        dynamic-styling
        class="mb-12"
      />

      <div class="relative overflow-hidden">
        <div
          class="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"
        ></div>
        <div
          class="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent"
        ></div>

        <div class="relative">
          <!-- Testimonials auto-scroll -->
          <div
            ref="testimonialsRef"
            class="embla"
          >
            <div class="embla__container flex">
              <div
                v-for="(testimonial, index) in testimonials"
                :key="`testimonial-${index}`"
                class="embla__slide embla__slide-testimonial p-2"
                @mouseenter="trackElementView(testimonial.name, 'testimonial')"
              >
                <div
                  class="testimonial-card bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg p-5 h-full transition-colors duration-500 relative"
                  :class="`hover:border-${activePersona.color}-700/50`"
                >
                  <!-- User type badge -->
                  <div
                    class="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs border flex items-center gap-1"
                    :class="getUserTypeBadgeClass(testimonial.userType)"
                  >
                    <span
                      v-if="testimonial.userType === 'researcher'"
                      class="flex items-center"
                    >
                      <Icon
                        name="mdi:telescope"
                        size="12"
                      />
                      <span class="ml-1">Researcher</span>
                    </span>
                    <span
                      v-else-if="testimonial.userType === 'sci-commer'"
                      class="flex items-center"
                    >
                      <Icon
                        name="mdi:broadcast"
                        size="12"
                      />
                      <span class="ml-1">Science Comm</span>
                    </span>
                    <span
                      v-else-if="testimonial.userType === 'enthusiast'"
                      class="flex items-center"
                    >
                      <Icon
                        name="mdi:star"
                        size="12"
                      />
                      <span class="ml-1">Enthusiast</span>
                    </span>
                    <span
                      v-else-if="testimonial.userType === 'industry'"
                      class="flex items-center"
                    >
                      <Icon
                        name="mdi:office-building"
                        size="12"
                      />
                      <span class="ml-1">Industry</span>
                    </span>
                  </div>

                  <div class="mb-3">
                    <Icon
                      name="mdi:format-quote-open"
                      :class="`text-${activePersona.color}-500/40 transition-colors duration-500`"
                      size="28"
                    />
                  </div>
                  <p class="text-gray-300 text-sm italic mb-4">{{ testimonial.quote }}</p>
                  <div>
                    <h4 class="text-white font-medium">{{ testimonial.name }}</h4>
                    <p class="text-xs text-gray-400">{{ testimonial.role }}</p>
                    <p
                      class="text-xs transition-colors duration-500"
                      :class="`text-${activePersona.color}-400`"
                      >{{ testimonial.institution }}</p
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Technologies track - don't filter -->
        <div class="relative overflow-hidden">
          <!-- AI Technologies auto-scroll -->
          <div
            ref="technologiesRef"
            class="embla"
          >
            <div class="embla__container flex">
              <div
                v-for="(tech, index) in aiTechnologies"
                :key="`tech-${index}`"
                class="embla__slide embla__slide-tech p-2"
                @mouseenter="trackElementView(tech.name, 'technology')"
              >
                <div
                  class="tech-logo bg-slate-900/60 border border-slate-800/50 rounded-lg p-4 flex flex-col items-center transition-all duration-300 hover:border-slate-700/70"
                >
                  <NuxtImg
                    :src="tech.image"
                    :alt="tech.name"
                    class="h-16 w-auto mb-2 grayscale hover:grayscale-0 transition-all duration-300"
                  />
                  <p class="text-xs text-gray-400">{{ tech.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Partners/Data Sources track - DO filter by persona -->
        <div class="relative mb-16 overflow-hidden">
          <!-- Partners auto-scroll -->
          <div
            ref="partnersRef"
            class="embla"
          >
            <div class="embla__container flex">
              <div
                v-for="(partner, index) in filteredPartners"
                :key="`partner-${index}`"
                class="embla__slide embla__slide-partner p-2"
                @mouseenter="trackElementView(partner.name, 'partner')"
              >
                <div
                  class="partner-logo bg-slate-900/60 border border-slate-800/50 rounded-lg p-4 flex flex-col items-center transition-all duration-300 hover:border-slate-700/70"
                >
                  <NuxtImg
                    :src="partner.image"
                    :alt="partner.name"
                    class="h-12 w-auto mb-2 grayscale hover:grayscale-0 transition-all duration-300"
                  />
                  <div class="flex flex-col items-center">
                    <p class="text-xs text-gray-400 mb-1">{{ partner.name }}</p>
                    <span
                      class="px-2 py-0.5 rounded-full text-[10px] border inline-flex items-center"
                      :class="`bg-${activePersona.color}-900/30 text-${activePersona.color}-400 border-${activePersona.color}-800/30`"
                    >
                      {{ partner.type }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sources counter with glow -->
      <div class="text-center mb-12 relative">
        <div class="inline-block relative">
          <div
            class="px-6 py-3 backdrop-blur-sm rounded-full transition-colors duration-500"
            :class="`bg-${activePersona.color}-900/20 border border-${activePersona.color}-800/30`"
          >
            <span
              class="text-lg md:text-xl font-bold transition-colors duration-500"
              :class="`text-${activePersona.color}-400`"
            >
              <span class="text-white">{{ sourcesCount }}+</span>
              trusted sources integrated
            </span>
          </div>
          <!-- Subtle glow effect -->
          <div
            class="absolute -inset-1 rounded-full blur-md -z-10 transition-colors duration-500"
            :class="`bg-${activePersona.color}-500/20`"
          ></div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="text-center">
        <p class="mb-6 text-lg text-gray-300">
          Ready to transform your astronomy experience with AI?
        </p>
        <AuthWrapper
          mode="register"
          redirect-url="/onboarding"
        >
          <template #default="{ authAction }">
            <PrimeButton
              size="large"
              :class="personaStyles.primaryButton"
              class="mt-6"
              @click="
                () => {
                  trackCTAClick?.('register', activePersona.name), authAction()
                }
              "
            >
              Get Started
            </PrimeButton>
          </template>
        </AuthWrapper>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Basic Embla reset */
.embla {
  overflow: hidden;
}

.embla__container {
  display: flex;
  flex-wrap: nowrap;
  user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.embla__slide {
  position: relative;
  flex: 0 0 auto;
}

/* Slide sizes for different types */
.embla__slide-testimonial {
  width: 33.333%;
}

.embla__slide-tech {
  width: 16.666%;
}

.embla__slide-partner {
  width: 16.666%;
}

/* Card styling and hover effects */
.testimonial-card,
.tech-logo,
.partner-logo {
  transition: all 0.3s ease;
  height: 100%;
}

.testimonial-card:hover,
.tech-logo:hover,
.partner-logo:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px -2px rgba(59, 130, 246, 0.2);
}

/* Consistent item heights */
.testimonial-card {
  min-height: 240px;
  display: flex;
  flex-direction: column;
}

.testimonial-card > div:last-child {
  margin-top: auto;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .embla__slide-testimonial {
    width: 50%;
  }

  .embla__slide-tech,
  .embla__slide-partner {
    width: 25%;
  }
}

@media (max-width: 640px) {
  .embla__slide-testimonial {
    width: 100%;
  }

  .embla__slide-tech,
  .embla__slide-partner {
    width: 33.333%;
  }
}
</style>
