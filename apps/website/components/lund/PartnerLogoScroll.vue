<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import AutoScroll from 'embla-carousel-auto-scroll'

const { trackUserEngagement } = useAnalytics()

// Personal testimonials
const testimonials = [
  {
    name: 'Dr. Rachel Thompson',
    role: 'Astronomy PhD Candidate',
    institution: 'MIT Department of Physics',
    quote:
      "AstronEra has reduced my literature review time by 70%. I can explore research gaps and find relevant papers in minutes instead of days. It's become an essential tool for my doctoral work.",
  },
  {
    name: 'Prof. Michael Chen',
    role: 'Astronomy Professor',
    institution: 'University of California',
    quote:
      'I recommend AstronEra to all my graduate students. The ability to contextualize queries with specific papers has transformed how we approach new research questions and hypothesis generation.',
  },
  {
    name: 'Samantha Wright',
    role: 'Space Enthusiast',
    institution: 'Amateur Astronomy Club',
    quote:
      'As someone passionate about astronomy but without formal training, AstronEra helps me understand complex concepts by explaining them in accessible ways while still linking to the scientific sources.',
  },
  {
    name: 'Alex Rodriguez',
    role: 'Research Lead',
    institution: 'NewSpace Technologies',
    quote:
      'Our R&D team uses AstronEra daily to stay current on industry developments and identify potential collaboration opportunities.',
  },
  {
    name: 'Maria Gonzalez',
    role: 'Science Journalist',
    institution: 'AstroNews Network',
    quote:
      'AstronEra helps me fact-check astronomy news quickly with reliable sources. The Press Kit Generator has revolutionized how I create accurate articles.',
  },
  {
    name: 'Dr. Priya Sharma',
    role: 'Astrophysics Researcher',
    institution: 'TIFR, Mumbai',
    quote:
      'The platform helped me connect with international researchers and access global resources that were previously difficult to find.',
  },
]

// Partner organizations and data sources
const partners = [
  { name: 'NASA', image: '/images/partners/nasa-logo.png', type: 'agency' },
  { name: 'ESA', image: '/images/partners/esa-logo.png', type: 'agency' },
  { name: 'ISRO', image: '/images/partners/isro-logo.png', type: 'agency' },
  { name: 'ArXiv', image: '/images/partners/arxiv-logo.png', type: 'data' },
  { name: 'MAST', image: '/images/partners/mast-logo.png', type: 'data' },
  { name: 'JWST', image: '/images/partners/jwst-logo.png', type: 'data' },
  { name: 'Nature', image: '/images/partners/nature-logo.png', type: 'publisher' },
  { name: 'Science', image: '/images/partners/science-logo.png', type: 'publisher' },
  { name: 'AAAS', image: '/images/partners/aaas-logo.png', type: 'publisher' },
  { name: 'Google Scholar', image: '/images/partners/google-scholar-logo.png', type: 'data' },
  { name: 'IEEE', image: '/images/partners/ieee-logo.png', type: 'publisher' },
  { name: 'JAXA', image: '/images/partners/jaxa-logo.png', type: 'agency' },
]

// AI technology partners
const aiTechnologies = [
  { name: 'Claude AI', image: '/images/partners/claude-ai-icon.png' },
  { name: 'Google Gemini', image: '/images/partners/google-gemini-icon.png' },
  { name: 'Grok', image: '/images/partners/grok-icon.png' },
  { name: 'Hugging Face', image: '/images/partners/huggingface-icon.png' },
  { name: 'Mistral AI', image: '/images/partners/mistral-ai-icon.png' },
  { name: 'OpenAI', image: '/images/partners/openai-icon.png' },
]

// Set up testimonials carousel with auto-scroll
const [testimonialsRef, testimonialsApi] = useEmblaCarousel(
  { loop: true, align: 'start', containScroll: 'trimSnaps' },
  [AutoScroll({ speed: 1, direction: 'forward', stopOnInteraction: false })],
)

// Set up AI technologies carousel with auto-scroll (faster)
const [technologiesRef, technologiesApi] = useEmblaCarousel(
  { loop: true, align: 'start', containScroll: 'trimSnaps' },
  [AutoScroll({ speed: 1.5, direction: 'forward', stopOnInteraction: false })],
)

// Set up partners carousel with auto-scroll (in reverse direction)
const [partnersRef, partnersApi] = useEmblaCarousel(
  { loop: true, align: 'start', containScroll: 'trimSnaps' },
  [AutoScroll({ speed: 1.2, direction: 'backward', stopOnInteraction: false })],
)

// Track user engagement
const trackElementView = (element, type) => {
  trackUserEngagement(UserEngagementMetric.ContentPerformance, {
    contentType: type,
    element,
  })
}

// Track CTA click
const trackCTAClick = () => {
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'social_proof_cta_click',
  })
}
</script>

<template>
  <section class="py-12 relative overflow-hidden">
    <!-- Background with deep space effect -->
    <div class="absolute inset-0 bg-slate-950 z-0"></div>
    <div class="absolute inset-0 bg-[url('/patterns/noise-pattern.svg')] opacity-5 z-0"></div>

    <!-- Single blue glow in center -->
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-3xl"
    ></div>

    <div class="wrapper relative z-10 max-w-7xl mx-auto px-4">
      <!-- Section header -->
      <div class="text-center mb-8">
        <h2 class="text-4xl font-bold relative">
          <span class="bg-primary-700/80 px-4 py-2 text-white">The Best Global Sources</span>
          <span class="text-white mx-3">&</span>
          <span class="bg-primary-700/80 px-4 py-2 text-white">Cutting-Edge AI Tech</span>
        </h2>
      </div>

      <!-- Testimonials track -->
      <div class="relative mb-8 overflow-hidden">
        <!-- Dimension portal edges -->
        <div
          class="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"
        ></div>
        <div
          class="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent"
        ></div>

        <!-- Testimonials auto-scroll -->
        <div
          ref="testimonialsRef"
          class="embla"
        >
          <div class="embla__container flex">
            <div
              v-for="(testimonial, index) in testimonials"
              :key="`testimonial-${index}`"
              class="embla__slide embla__slide-testimonial px-2"
              @mouseenter="trackElementView(testimonial.name, 'testimonial')"
            >
              <div
                class="testimonial-card bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg p-5 h-full"
              >
                <div class="mb-3">
                  <Icon
                    name="mdi:format-quote-open"
                    class="text-blue-500/40"
                    size="28"
                  />
                </div>
                <p class="text-gray-300 text-sm italic mb-4">{{ testimonial.quote }}</p>
                <div>
                  <h4 class="text-white font-medium">{{ testimonial.name }}</h4>
                  <p class="text-xs text-gray-400">{{ testimonial.role }}</p>
                  <p class="text-xs text-blue-400">{{ testimonial.institution }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Technologies track -->
      <div class="relative mb-8 overflow-hidden">
        <!-- Same dimension portal edges -->
        <div
          class="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"
        ></div>
        <div
          class="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent"
        ></div>

        <!-- AI Technologies auto-scroll -->
        <div
          ref="technologiesRef"
          class="embla"
        >
          <div class="embla__container flex">
            <div
              v-for="(tech, index) in aiTechnologies"
              :key="`tech-${index}`"
              class="embla__slide embla__slide-tech px-2"
            >
              <div
                class="tech-logo bg-slate-900/60 border border-slate-800/50 rounded-lg p-4 flex flex-col items-center"
              >
                <img
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

      <!-- Partners/Data Sources track -->
      <div class="relative mb-8 overflow-hidden">
        <!-- Same dimension portal edges -->
        <div
          class="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"
        ></div>
        <div
          class="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent"
        ></div>

        <!-- Partners auto-scroll -->
        <div
          ref="partnersRef"
          class="embla"
        >
          <div class="embla__container flex">
            <div
              v-for="(partner, index) in partners"
              :key="`partner-${index}`"
              class="embla__slide embla__slide-partner px-2"
            >
              <div
                class="partner-logo bg-slate-900/60 border border-slate-800/50 rounded-lg p-4 flex flex-col items-center"
              >
                <img
                  :src="partner.image"
                  :alt="partner.name"
                  class="h-12 w-auto mb-2 grayscale hover:grayscale-0 transition-all duration-300"
                />
                <p class="text-xs text-gray-400">{{ partner.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sources counter with glow -->
      <div class="text-center mb-8 relative">
        <div class="inline-block relative">
          <div
            class="px-6 py-3 bg-blue-900/20 backdrop-blur-sm border border-blue-800/30 rounded-full"
          >
            <span class="text-lg md:text-xl font-bold text-blue-400">
              <span class="text-white">150+</span>
              trusted sources integrated
            </span>
          </div>
          <!-- Subtle glow effect -->
          <div class="absolute -inset-1 bg-blue-500/20 rounded-full blur-md -z-10"></div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="text-center">
        <p class="mb-6 text-lg text-gray-300">
          Ready to transform your business with AI automation?
        </p>
        <button
          class="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition-colors duration-300 text-lg inline-flex items-center"
          @click="trackCTAClick"
        >
          Get Started Today
          <Icon
            name="mdi:arrow-right"
            class="ml-2"
            size="20"
          />
        </button>
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
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 4px 20px -2px rgba(59, 130, 246, 0.2);
}

/* Consistent item heights */
.testimonial-card {
  min-height: 220px;
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
