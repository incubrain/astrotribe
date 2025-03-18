<template>
  <div class="flex flex-col min-h-screen">
    <!-- Hero Carousel Section -->
    <section class="relative w-full">
      <AppCarousel
        :items="carouselItems"
        :interval="8000"
      >
        <template #default="{ item }: { item: CarouselItem }">
          <div>
            <DarkskyHero
              :img="{
                src: item.image,
                alt: item.title,
                width: 1080,
                height: 720,
              }"
              :title="{
                main: item.title,
                subtitle: '',
                centered: true,
              }"
              :object-position="`object-centered`"
              fit="cover"
            >
              <!-- Condensed description with better contrast -->
              <div
                class="max-w-xl bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-white/10 shadow-lg"
              >
                <p class="text-white text-lg font-medium">{{ item.shortDescription }}</p>
              </div>
            </DarkskyHero>
          </div>
        </template>
      </AppCarousel>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-0 right-0 flex justify-center z-30">
        <button
          class="flex flex-col items-center gap-2 text-white bg-black/30 px-6 py-3 rounded-full backdrop-blur-sm hover:bg-black/50 transition-all duration-300"
          @click="scrollToContent"
        >
          <span class="text-sm font-medium">Explore Dark Sky Initiatives</span>
          <Icon
            name="mdi:chevron-down"
            size="24px"
            class="animate-bounce"
          />
        </button>
      </div>
    </section>

    <!-- Impact Statistics Section - ADDED -->
    <section class="relative py-12 bg-gradient-to-b from-primary-950 to-primary-900">
      <div class="wrapper">
        <LandingTitle
          title="The Impact of Light Pollution"
          subtitle="Key statistics that highlight the urgent need for change"
          class="mb-10"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div
            v-for="(stat, index) in impactStatistics"
            :key="index"
            class="bg-primary-800/50 backdrop-blur-sm rounded-lg p-6 border border-primary-700/30 flex flex-col items-center text-center hover:bg-primary-700/50 transition-all duration-300"
          >
            <div class="text-4xl font-bold text-primary-400 mb-4">{{ stat.value }}</div>
            <p class="text-white text-sm">{{ stat.description }}</p>
          </div>
        </div>

        <div class="mt-8 text-center">
          <NuxtLink
            to="https://www.darksky.org/light-pollution/light-pollution-statistics/"
            target="_blank"
          >
            <PrimeButton
              size="small"
              severity="secondary"
              outlined
            >
              Learn more about these statistics
              <Icon
                name="mdi:arrow-right"
                class="ml-2"
              />
            </PrimeButton>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Main Content Container -->
    <div
      ref="contentRef"
      class="wrapper"
    >
      <!-- Mission Section - SIMPLIFIED -->
      <section class="py-16">
        <LandingTitle
          title="Our Mission"
          subtitle="Preserving the night sky for everyone"
          class="mb-12"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Education Panel - CONDENSED -->
          <LandingGlass
            hover-effect="glow"
            glow-color="blue"
            gradient="blue"
            intensity="low"
            interactive
          >
            <h3 class="text-2xl font-bold mb-4 text-white">Astronomy Education For All</h3>
            <p class="text-base mb-6">{{ missionAstronomyEducation }}</p>

            <div class="flex justify-end">
              <PrimeButton
                size="small"
                severity="secondary"
                outlined
              >
                Learn more
                <Icon
                  name="mdi:arrow-right"
                  class="ml-2"
                />
              </PrimeButton>
            </div>
          </LandingGlass>

          <!-- Dark Sky Preservation Panel - CONDENSED -->
          <LandingGlass
            hover-effect="glow"
            glow-color="purple"
            gradient="purple"
            intensity="low"
            interactive
          >
            <h3 class="text-2xl font-bold mb-4 text-white"
              >Dark Sky Preservation & Sustainability</h3
            >
            <p class="text-base mb-6">{{ missionDarkSkyPreservation }}</p>

            <div class="flex justify-end">
              <PrimeButton
                size="small"
                severity="secondary"
                outlined
              >
                Learn more
                <Icon
                  name="mdi:arrow-right"
                  class="ml-2"
                />
              </PrimeButton>
            </div>
          </LandingGlass>
        </div>
      </section>

      <!-- Mascot Section -->
      <section class="py-16 bg-gradient-to-b from-primary-950 to-primary-900 rounded-xl my-8">
        <LandingTitle
          title="Meet Our Dark Sky Mascot"
          subtitle="Tara the Firefly"
          class="mb-12"
        />

        <div class="flex flex-col md:flex-row gap-12 items-center px-6">
          <div class="md:w-2/5 flex justify-center">
            <div class="relative">
              <IBImage
                :img="{
                  src: '/images/mascot_tara.png',
                  alt: 'Tara the Firefly',
                }"
                class="w-full max-w-md"
              />
              <!-- Glow effect -->
              <div class="absolute inset-0 -z-10 bg-yellow-500/20 blur-xl rounded-full"></div>
            </div>
          </div>

          <div class="md:w-3/5">
            <LandingGlass
              hover-effect="glow"
              glow-color="yellow"
              gradient="orange"
              intensity="medium"
              interactive
            >
              <div
                v-for="(paragraph, index) in mascotStory"
                :key="index"
                class="mb-4"
              >
                <p class="text-base">{{ paragraph }}</p>
              </div>

              <div class="flex justify-center mt-8">
                <PrimeButton class="w-auto bg-gradient-to-r from-yellow-500 to-orange-500">
                  <div class="flex flex-col">
                    <span>KNOW MY STORY</span>
                    <span class="text-sm">DOWNLOAD</span>
                  </div>
                </PrimeButton>
              </div>
            </LandingGlass>
          </div>
        </div>
      </section>

      <DarkskySimulator />

      <!-- Take Action Now / Quick-Start Guide - ADDED -->
      <section class="py-16">
        <LandingTitle
          title="Start Making a Difference Today"
          subtitle="Simple steps to reduce light pollution and protect dark skies"
          class="mb-12"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(step, index) in actionSteps"
            :key="index"
          >
            <LandingGlass
              hover-effect="glow"
              glow-color="blue"
              gradient="mixed"
              intensity="low"
              interactive
            >
              <div class="flex items-start gap-4">
                <div
                  class="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  {{ index + 1 }}
                </div>
                <div>
                  <h3 class="text-xl font-bold mb-3 text-primary-400">{{ step.title }}</h3>
                  <p class="text-base mb-4">{{ step.description }}</p>

                  <div
                    v-if="step.actionUrl"
                    class="mt-4"
                  >
                    <NuxtLink :to="step.actionUrl">
                      <PrimeButton
                        size="small"
                        severity="secondary"
                      >
                        {{ step.actionText }}
                        <Icon
                          :name="step.icon"
                          class="ml-2"
                        />
                      </PrimeButton>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </LandingGlass>
          </div>
        </div>
      </section>

      <!-- Resources Section - ADDED -->
      <section class="py-16">
        <LandingTitle
          title="Helpful Resources"
          subtitle="Tools and information to support your dark sky preservation efforts"
          class="mb-12"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          <div
            v-for="(resource, index) in helpfulResources"
            :key="index"
          >
            <LandingGlass
              hover-effect="glow"
              glow-color="purple"
              gradient="mixed"
              intensity="low"
              interactive
              class="h-full"
            >
              <div class="flex flex-col h-full">
                <div class="mb-4">
                  <Icon
                    :name="resource.icon"
                    size="36"
                    class="text-primary-400"
                  />
                </div>

                <h3 class="text-xl font-bold mb-3 text-white">{{ resource.title }}</h3>
                <p class="text-base mb-6 flex-grow">{{ resource.description }}</p>

                <div class="mt-auto">
                  <NuxtLink
                    :to="resource.url"
                    target="_blank"
                  >
                    <PrimeButton
                      severity="secondary"
                      outlined
                      class="w-full"
                    >
                      Visit Resource
                      <Icon
                        name="mdi:open-in-new"
                        class="ml-2"
                      />
                    </PrimeButton>
                  </NuxtLink>
                </div>
              </div>
            </LandingGlass>
          </div>
        </div>
      </section>

      <!-- FAQ Section - ADDED -->
      <section class="py-16 bg-gradient-to-b from-primary-950 to-primary-900 rounded-xl my-8">
        <LandingTitle
          title="Frequently Asked Questions"
          subtitle="Common questions about dark sky preservation and light pollution"
          class="mb-12"
        />

        <div class="px-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="(faq, index) in faqs"
              :key="index"
            >
              <div
                class="background p-4 border border-color rounded-md h-full flex flex-col justify-between"
              >
                <div class="flex flex-col">
                  <h3 class="text-xl font-bold mb-3 text-primary-400">{{ faq.question }}</h3>
                  <p class="text-base">{{ faq.answer }}</p>
                </div>

                <div
                  v-if="faq.expandedAnswer"
                  class="mt-4"
                >
                  <PrimeButton
                    size="small"
                    severity="secondary"
                    text
                    @click="faq.isExpanded = !faq.isExpanded"
                  >
                    {{ faq.isExpanded ? 'Show less' : 'Read more' }}
                    <Icon
                      :name="faq.isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                      class="ml-1"
                    />
                  </PrimeButton>

                  <div
                    v-if="faq.isExpanded"
                    class="mt-3 text-sm text-gray-300 border-l-2 border-primary-600 pl-4"
                  >
                    {{ faq.expandedAnswer }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Our Events Section -->
      <section class="py-16">
        <LandingTitle
          title="Our Events"
          subtitle="Join us in our mission"
          class="mb-12"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          <!-- Conferences Card -->
          <LandingGlass
            hover-effect="glow"
            glow-color="blue"
            gradient="blue"
            intensity="low"
            interactive
            :padded="false"
          >
            <template #header>
              <div class="relative overflow-hidden">
                <IBImage
                  :img="{
                    src: '/conference/photos/IDSPAC23-ruchira-huchgol.jpg',
                    alt: 'Conferences',
                    width: 500,
                    height: 250,
                    loading: 'lazy',
                    format: 'webp',
                  }"
                  class="w-full h-48 object-cover transform transition-transform duration-700 hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
            </template>

            <div class="p-6">
              <h3 class="text-2xl font-semibold mb-4 text-white">Conferences</h3>
              <p class="text-base mb-6">{{ conferencesText }}</p>

              <NuxtLink to="/conferences">
                <PrimeButton severity="secondary">
                  <Icon
                    name="mdi:presentation"
                    class="mr-2"
                  />
                  View Conferences
                </PrimeButton>
              </NuxtLink>
            </div>
          </LandingGlass>

          <!-- Symposiums Card -->
          <LandingGlass
            hover-effect="glow"
            glow-color="purple"
            gradient="purple"
            intensity="low"
            interactive
            :padded="false"
          >
            <template #header>
              <div class="relative overflow-hidden">
                <IBImage
                  :img="{
                    src: 'darksky/symposium_card.jpeg',
                    alt: 'Symposiums',
                    width: 500,
                    height: 250,
                    loading: 'lazy',
                    format: 'webp',
                  }"
                  class="w-full h-48 object-cover transform transition-transform duration-700 hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
            </template>

            <div class="p-6">
              <h3 class="text-2xl font-semibold mb-4 text-white">Symposiums</h3>
              <p class="text-base mb-6">{{ symposiumsText }}</p>

              <NuxtLink to="/symposiums">
                <PrimeButton severity="secondary">
                  <Icon
                    name="mdi:account-group"
                    class="mr-2"
                  />
                  View Symposiums
                </PrimeButton>
              </NuxtLink>
            </div>
          </LandingGlass>
        </div>
      </section>

      <!-- Social Sharing Section - ADDED -->
      <section class="py-16 bg-gradient-to-b from-primary-950 to-primary-900 rounded-xl my-8">
        <LandingTitle
          title="Spread Awareness"
          subtitle="Help others learn about the importance of dark sky preservation"
          class="mb-12"
        />

        <div class="px-6">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div class="md:col-span-7">
              <LandingGlass
                hover-effect="glow"
                glow-color="blue"
                gradient="mixed"
                intensity="low"
                interactive
              >
                <h3 class="text-2xl font-bold mb-4 text-white">Why Sharing Matters</h3>
                <p class="text-base mb-4">
                  Light pollution affects everyone, yet many people aren't aware of its impacts. By
                  sharing information about dark sky preservation, you can help others understand
                  why it matters and what they can do to help.
                </p>
                <p class="text-base mb-6">
                  Use the hashtags #DarkSkyPreservation, #FightLightPollution, and #AstronEra to
                  join the conversation and connect with others who care about protecting our night
                  skies.
                </p>

                <div class="p-4 bg-primary-800/50 rounded-lg border border-primary-700/30 mb-6">
                  <p class="text-sm italic text-gray-300">
                    "The stars are the heritage of all humanity. But with increasing light
                    pollution, fewer and fewer people can see them. Let's change that.
                    #DarkSkyPreservation"
                  </p>
                </div>

                <div class="flex flex-wrap gap-3">
                  <span
                    v-for="(tag, index) in shareTags"
                    :key="index"
                    class="bg-primary-700/50 px-3 py-1 rounded-full text-sm text-primary-300"
                  >
                    {{ tag }}
                  </span>
                </div>
              </LandingGlass>
            </div>

            <div class="md:col-span-5">
              <LandingGlass
                hover-effect="glow"
                glow-color="blue"
                gradient="mixed"
                intensity="low"
                interactive
              >
                <h3 class="text-xl font-bold mb-6 text-white text-center">Share This Initiative</h3>

                <div class="flex flex-col space-y-4">
                  <div
                    v-for="(platform, index) in sharePlatforms"
                    :key="index"
                  >
                    <PrimeButton
                      class="w-full flex justify-between items-center"
                      :class="platform.btnClass"
                      @click="shareOnPlatform(platform.name, platform.url)"
                    >
                      <span class="flex items-center">
                        <Icon
                          :name="platform.icon"
                          class="mr-3"
                          size="24"
                        />
                        Share on {{ platform.name }}
                      </span>
                      <Icon name="mdi:share" />
                    </PrimeButton>
                  </div>

                  <div class="mt-4 p-4 bg-primary-800/50 rounded-lg border border-primary-700/30">
                    <h4 class="text-sm font-bold mb-2 text-primary-400">Direct Link:</h4>
                    <div class="flex items-center gap-2">
                      <input
                        type="text"
                        value="https://astronera.org/darksky"
                        readonly
                        class="bg-primary-900/50 text-white text-sm p-2 rounded border border-primary-700/30 flex-grow"
                      />
                      <PrimeButton
                        icon="mdi:content-copy"
                        severity="secondary"
                        @click="copyToClipboard('https://astronera.org/darksky')"
                      />
                    </div>
                  </div>
                </div>
              </LandingGlass>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="py-16 text-center mb-12">
        <LandingGlass
          hover-effect="glow"
          glow-color="mixed"
          gradient="mixed"
          intensity="medium"
          interactive
        >
          <h2 class="text-4xl font-bold mb-6 text-white">Ready to Make a Difference?</h2>
          <p class="text-xl mb-8 max-w-2xl mx-auto">{{ ctaText }}</p>

          <NuxtLink to="/darksky">
            <PrimeButton
              size="large"
              class="font-inter bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-all duration-300 text-lg px-8 py-4"
            >
              <Icon
                name="mdi:star"
                class="mr-2"
              />
              Get Involved!
            </PrimeButton>
          </NuxtLink>
        </LandingGlass>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// References for scrolling
const contentRef = ref<HTMLElement | null>(null)

// Types
interface CarouselItem {
  title: string
  subtitle: string
  image: string
  shortDescription: string
}

interface BortleLevel {
  number: number
  name: string
  bgColor: string
  numColor: string
}

interface LightingPrinciple {
  title: string
  description: string
}

interface ImpactStatistic {
  value: string
  description: string
}

interface ActionStep {
  title: string
  description: string
  actionText?: string
  actionUrl?: string
  icon: string
}

interface Resource {
  title: string
  description: string
  url: string
  icon: string
}

interface FAQ {
  question: string
  answer: string
  expandedAnswer?: string
  isExpanded: boolean
}

interface SharePlatform {
  name: string
  icon: string
  url: string
  btnClass: string
}

// Scroll function
const scrollToContent = () => {
  if (contentRef.value) {
    contentRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}

// Share functions
const shareOnPlatform = (platform: string, baseUrl: string) => {
  const shareText = encodeURIComponent(
    'Join me in protecting our night skies from light pollution. Learn more about dark sky preservation and what you can do to help. #DarkSkyPreservation',
  )
  const shareUrl = encodeURIComponent('https://astronera.org/darksky')

  let shareLink = ''

  switch (platform) {
    case 'Twitter':
      shareLink = `${baseUrl}?text=${shareText}&url=${shareUrl}`
      break
    case 'Facebook':
      shareLink = `${baseUrl}?u=${shareUrl}`
      break
    case 'LinkedIn':
      shareLink = `${baseUrl}?url=${shareUrl}&summary=${shareText}`
      break
    default:
      shareLink = baseUrl
  }

  window.open(shareLink, '_blank')
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  // In a real implementation, you'd show a notification here
}

// Carousel items (continued)
const carouselItems: CarouselItem[] = [
  {
    title: 'Effects On Different Species',
    subtitle: 'Artificial light disrupts wildlife behavior and ecosystems',
    image: 'darksky/carousel_(1).jpeg',
    shortDescription:
      'Artificial light disrupts wildlife behavior, affecting foraging, mating, and migration patterns. Dark sky preservation helps maintain biodiversity and ecosystem health.',
  },
  {
    title: 'Circadian Rhythm',
    subtitle: 'Light pollution affects human health and wellbeing',
    image: 'darksky/carousel_(2).jpeg',
    shortDescription:
      'Excessive light at night disrupts human circadian rhythms, leading to sleep disorders and health issues. Dark sky practices improve wellbeing and enhance stargazing opportunities.',
  },
  {
    title: 'Energy Waste',
    subtitle: 'Reducing unnecessary lighting decreases carbon footprint',
    image: 'darksky/carousel_(3).jpeg',
    shortDescription:
      'Excessive lighting wastes energy and increases greenhouse gas emissions. Dark sky initiatives help communities reduce their carbon footprint and mitigate climate change.',
  },
  {
    title: 'Tribal Community Preservation',
    subtitle: 'Natural darkness supports cultural practices',
    image: 'darksky/carousel_(4).jpeg',
    shortDescription:
      'Many tribal communities rely on natural darkness for cultural practices, storytelling, and ceremonies. Preserving dark skies supports these traditions and local wildlife conservation.',
  },
  {
    title: 'Sustainable Development',
    subtitle: 'Economic benefits of dark sky policies',
    image: 'darksky/carousel_(5).jpeg',
    shortDescription:
      'Optimizing public lighting reduces energy costs, allowing funds to be redirected to other community needs. Smart lighting solutions benefit both dark skies and municipal budgets.',
  },
]

// Impact Statistics - ADDED
const impactStatistics: ImpactStatistic[] = [
  {
    value: '83%',
    description:
      'of the global population lives under light-polluted skies, limiting their view of stars and planets',
  },
  {
    value: '2-6%',
    description:
      'annual increase in light pollution in many regions, especially in developing countries',
  },
  {
    value: '$3.3B',
    description:
      'annual cost of wasted outdoor lighting in the US alone—30% of all outdoor lighting',
  },
  {
    value: '50%',
    description:
      'higher risk of certain health issues linked to nighttime exposure to artificial light',
  },
  {
    value: '70%',
    description:
      'reduction in activity for many nocturnal animals in artificially lit environments',
  },
]

// Mission section text - CONDENSED
const missionAstronomyEducation =
  'Making astronomy accessible to everyone through digital learning, diverse educational resources, and a global community of space enthusiasts.'

const missionDarkSkyPreservation =
  'Pioneering dark sky conservation in India by combating light pollution, promoting sustainable lighting practices, and uniting experts and policymakers to protect our natural nightscapes.'

// Mascot section text
const mascotStory = [
  "Hi, I'm Tara the Firefly—your quirky little mascot for saving the dark skies! As a firefly, I shine brightest when the night is dark and calm.",
  "But with harsh artificial lights, not only are stars disappearing, but it's confusing creatures like me, disturbing humans' sleep, and affecting health!",
  "Protecting the night sky isn't just for stargazing—it's about keeping our planet in balance. I'm thrilled to see experts and policymakers joining forces to bring back the beauty of the night for everyone!",
]

// Action Steps - ADDED
const actionSteps: ActionStep[] = [
  {
    title: 'Assess Your Home',
    description:
      'Audit your outdoor lighting for unnecessary brightness, upward-pointing fixtures, and light spillover into neighboring properties or the sky.',
    actionText: 'Download Audit Checklist',
    actionUrl: '#',
    icon: 'mdi:clipboard-check',
  },
  {
    title: 'Make Simple Changes',
    description:
      'Install shields on existing lights, switch to warm-colored bulbs under 3000K, add motion sensors, and use timers to reduce hours of operation.',
    actionText: 'View Lighting Guide',
    actionUrl: '#',
    icon: 'mdi:lightbulb',
  },
  {
    title: 'Spread Awareness',
    description:
      'Share information about light pollution with neighbors, local businesses, and community groups to create broader understanding.',
    actionText: 'Get Sharing Tools',
    actionUrl: '#share-section',
    icon: 'mdi:share-variant',
  },
  {
    title: 'Contact Officials',
    description:
      'Advocate for dark sky-friendly lighting ordinances in your community by contacting local representatives and attending planning meetings.',
    actionText: 'Advocacy Resources',
    actionUrl: '#',
    icon: 'mdi:gavel',
  },
  {
    title: 'Join the Movement',
    description:
      'Participate in community dark sky events, citizen science projects, and local initiatives to monitor and reduce light pollution.',
    actionText: 'Find Local Events',
    actionUrl: '#',
    icon: 'mdi:account-group',
  },
]

// What You Can Do section text
const responsibleLightingText = [
  'Excessive and poorly managed outdoor lighting creates unnecessary energy waste, environmental harm, and increasing light pollution that disrupts ecosystems and diminishes overall well-being.',
  'DarkSky and the Illuminating Engineering Society have outlined the Five Principles for Responsible Outdoor Lighting to help minimize light pollution through thoughtful design.',
  'Following these principles ensures outdoor lighting is efficient, visually appealing, and environmentally conscious while maintaining effective nighttime illumination.',
]

const lightingPrinciples: LightingPrinciple[] = [
  {
    title: 'Useful',
    description: 'All light should have a clear purpose and be directed only where needed.',
  },
  {
    title: 'Targeted',
    description: 'Light should be directed only to where it is needed, minimizing spill.',
  },
  {
    title: 'Low Level',
    description: 'Light should be no brighter than necessary for the intended task.',
  },
  {
    title: 'Controlled',
    description: 'Light should be used only when it is needed, utilizing timers and sensors.',
  },
  {
    title: 'Warm Color',
    description: 'Use warmer color lights (less than 3000 Kelvins) whenever possible.',
  },
]

const bortleScaleText = [
  "The Bortle Scale is a nine-level numeric scale that measures the night sky's brightness at a particular location. It helps astronomers and stargazers assess light pollution's impact on visibility.",
  'Lower numbers on the scale (1-3) indicate darker, higher-quality skies with better star visibility, while higher numbers (7-9) indicate heavily light-polluted areas where few stars are visible.',
]

const bortleScaleLevels: BortleLevel[] = [
  { number: 1, name: 'Excellent Dark Sky', bgColor: 'bg-primary-950/60', numColor: 'bg-blue-900' },
  { number: 3, name: 'Rural Sky', bgColor: 'bg-primary-900/60', numColor: 'bg-blue-800' },
  { number: 5, name: 'Suburban Sky', bgColor: 'bg-primary-800/60', numColor: 'bg-blue-700' },
  { number: 7, name: 'City Sky', bgColor: 'bg-primary-700/60', numColor: 'bg-blue-600' },
  { number: 9, name: 'Inner City Sky', bgColor: 'bg-primary-600/60', numColor: 'bg-blue-500' },
]

// Helpful Resources - ADDED
const helpfulResources: Resource[] = [
  {
    title: 'International Dark-Sky Association',
    description:
      'The leading organization in the fight against light pollution, offering comprehensive guidance, research, and advocacy.',
    url: 'https://www.darksky.org/',
    icon: 'mdi:earth',
  },
  {
    title: 'Globe at Night',
    description:
      'A citizen science project that invites people worldwide to measure their night sky brightness and submit observations.',
    url: 'https://www.globeatnight.org/',
    icon: 'mdi:globe-light',
  },
  {
    title: 'Light Pollution Map',
    description:
      'Interactive world atlas of artificial night sky brightness, helping you locate areas of low light pollution.',
    url: 'https://www.lightpollutionmap.info/',
    icon: 'mdi:map',
  },
  {
    title: 'Dark Sky Friendly Lighting',
    description:
      'Comprehensive guide to selecting outdoor lighting fixtures that minimize light pollution while maintaining functionality.',
    url: 'https://www.darksky.org/our-work/lighting/lighting-for-industry/',
    icon: 'mdi:lightbulb',
  },
  {
    title: 'Sky Quality Measurement',
    description:
      'Tools and techniques for measuring local light pollution levels and tracking changes over time.',
    url: 'https://www.darksky.org/our-work/conservation/idsp/become-a-dark-sky-place/sky-quality-survey/',
    icon: 'mdi:brightness-7',
  },
  {
    title: 'Educational Materials',
    description:
      'Resources for teachers, community leaders, and parents to educate others about light pollution and dark sky preservation.',
    url: 'https://www.darksky.org/our-work/grassroots-advocacy/resources/public-outreach-materials/',
    icon: 'mdi:school',
  },
]

// FAQs - ADDED
const faqs: FAQ[] = [
  {
    question: 'What exactly is light pollution?',
    answer:
      'Light pollution is the excessive or inappropriate use of artificial light that disrupts natural darkness. It includes skyglow (brightening of the night sky), glare, light trespass, and clutter.',
    expandedAnswer:
      "These different types of light pollution have varying impacts. Skyglow washes out stars and affects astronomers and nocturnal wildlife. Glare creates safety hazards by reducing visibility. Light trespass occurs when unwanted light enters properties where it's not intended, and clutter involves excessive groupings of light sources.",
    isExpanded: false,
  },
  {
    question: 'Why should I care about dark skies?',
    answer:
      'Dark skies are important for human health, wildlife wellbeing, energy conservation, cultural heritage, and scientific research. Excess artificial light disrupts sleep patterns, endangers nocturnal species, wastes energy, and prevents us from experiencing the night sky.',
    expandedAnswer:
      'Throughout human history, the night sky has inspired art, science, religion, and philosophy. When we lose access to truly dark skies, we lose touch with this fundamental part of our heritage and the sense of wonder it provides.',
    isExpanded: false,
  },
  {
    question: 'How does light pollution affect wildlife?',
    answer:
      'Artificial light at night disrupts natural behaviors of nocturnal animals. It affects predator-prey relationships, migratory patterns, reproduction cycles, and feeding behaviors. For example, sea turtle hatchlings can become disoriented by coastal lighting instead of following moonlight to the ocean.',
    expandedAnswer:
      'Light pollution also affects insects, which are attracted to artificial lights and often die from exhaustion or predation. This disrupts ecosystems as insects are a crucial food source for many animals and important pollinators for plants.',
    isExpanded: false,
  },
  {
    question: 'Does light pollution affect human health?',
    answer:
      'Yes, exposure to artificial light at night disrupts our circadian rhythms, which can lead to sleep disorders, increased stress, and potentially more serious health issues. The blue light from LEDs is particularly disruptive to melatonin production, which regulates our sleep cycles.',
    expandedAnswer:
      'Research has shown potential links between nighttime light exposure and various health conditions including depression, obesity, diabetes, and even certain types of cancer. While more research is needed, reducing unnecessary light exposure at night is considered a prudent health measure.',
    isExpanded: false,
  },
  {
    question: "What's the Bortle Scale?",
    answer:
      'The Bortle Scale is a nine-level numeric scale that measures night sky brightness and star visibility at a particular location. It ranges from Class 1 (excellent dark-sky site) to Class 9 (inner-city sky), helping astronomers and conservationists assess light pollution levels.',
    expandedAnswer:
      'John E. Bortle created this scale in 2001 to help amateur astronomers evaluate observing sites. The scale considers factors like visibility of celestial objects, presence of light domes from nearby cities, and overall sky transparency.',
    isExpanded: false,
  },
  {
    question: 'Do dark sky initiatives mean less safety?',
    answer:
      "No, properly designed lighting actually improves safety by reducing glare and shadows. Dark sky friendly lighting directs light where it's needed (like paths and doorways) instead of scattering it everywhere. Studies show no correlation between increased lighting and decreased crime.",
    expandedAnswer:
      'In fact, poorly designed lighting can create safety hazards by causing harsh glare that makes it harder to see potential dangers. The key is using the right amount of light, properly directed, at appropriate times—not eliminating lighting altogether.',
    isExpanded: false,
  },
  {
    question: "How can I determine my area's light pollution level?",
    answer:
      'You can assess your local light pollution by observing how many stars are visible on a clear night, whether you can see the Milky Way, and checking for light domes from nearby cities. Apps like Loss of the Night and Dark Sky Meter can help measure sky brightness.',
    expandedAnswer:
      'For more precise measurements, you can use a Sky Quality Meter (SQM) which provides numerical readings of sky brightness. The International Dark-Sky Association recommends taking measurements on moonless nights away from direct light sources.',
    isExpanded: false,
  },
  {
    question: 'What types of lighting are dark sky friendly?',
    answer:
      "Dark sky friendly lighting is fully shielded (pointing downward), no brighter than necessary, has a color temperature of 3000K or less (warm, not blue-white), and is only on when needed. Look for fixtures labeled as 'dark sky compliant' or 'full cutoff.'",
    expandedAnswer:
      'The color temperature is particularly important—lights with higher Kelvin ratings (4000K+) emit more blue light, which scatters more easily in the atmosphere and causes more skyglow than warmer-toned lighting. Motion sensors and timers are also excellent additions to any outdoor lighting system.',
    isExpanded: false,
  },
]

// Social Sharing - ADDED
const sharePlatforms: SharePlatform[] = [
  {
    name: 'Facebook',
    icon: 'mdi:facebook',
    url: 'https://www.facebook.com/sharer/sharer.php',
    btnClass: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'Twitter',
    icon: 'mdi:twitter',
    url: 'https://twitter.com/intent/tweet',
    btnClass: 'bg-sky-500 hover:bg-sky-600',
  },
  {
    name: 'LinkedIn',
    icon: 'mdi:linkedin',
    url: 'https://www.linkedin.com/shareArticle',
    btnClass: 'bg-blue-700 hover:bg-blue-800',
  },
]

const shareTags = [
  '#DarkSkyPreservation',
  '#FightLightPollution',
  '#AstronEra',
  '#SaveTheNightSky',
  '#StargazingForAll',
]

// Events section text
const conferencesText =
  'Uniting experts and enthusiasts to reclaim the night—because preserving dark skies means protecting life, science, and wonder. Take a look at our past and upcoming conferences!'

const symposiumsText =
  'We host a collaborative platform shaping policies for a starlit future—where innovation meets sustainability to combat light pollution. Explore our past and upcoming symposiums!'

// CTA section text
const ctaText =
  'Join us in the fight against light pollution and help preserve our night skies for future generations.'
</script>
