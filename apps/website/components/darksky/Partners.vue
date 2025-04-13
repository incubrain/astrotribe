<script setup lang="ts">
// DarkSkyPartners.vue - Component for showing DarkSky certified partners in India
import { ref } from 'vue'

// Track the currently expanded partner
const activePartnerId = ref<string | null>(null)

// Function to toggle partner details
const togglePartnerDetails = (id: string) => {
  activePartnerId.value = activePartnerId.value === id ? null : id
}

// Partners data
const partners = [
  {
    id: 'wipro',
    name: 'Wipro Lighting',
    location: 'Pune, Maharashtra, India',
    description:
      'A leading Indian lighting manufacturer and part of Wipro Enterprises. Their "Vista" post-top luminaire is an officially DarkSky Approved fixture, designed to minimize uplight and glare.',
    products: ['Vista LED outdoor landscape lighting fixtures'],
    website: 'wiprolighting.com',
    isIndian: true,
  },
  {
    id: 'havells',
    name: 'Havells India Ltd',
    location: 'Noida, Uttar Pradesh, India',
    description:
      "One of India's largest lighting and electrical equipment companies. Havells joined the DarkSky Approved program in 2022, producing outdoor luminaires meeting DarkSky's strict criteria.",
    products: ['DarkSky-approved outdoor luminaires'],
    website: 'havells.com',
    isIndian: true,
  },
  {
    id: 'signify',
    name: 'Signify (Philips Lighting)',
    location: 'Gurgaon, India (India HQ); Eindhoven, Netherlands (Global HQ)',
    description:
      "The world's largest lighting company with manufacturing facilities and market presence in India as Signify Innovations India Ltd. Their Philips Luma Gen2 LED streetlight range is DarkSky Approved.",
    products: ['Philips Luma Gen2 LED streetlights'],
    website: 'signify.com/en-in',
    isIndian: false,
  },
  {
    id: 'schreder',
    name: 'Schréder (Keselec Schréder India)',
    location: 'Faridabad, Haryana, India (India HQ); Brussels, Belgium (Global HQ)',
    description:
      'Global outdoor lighting specialist operating in India through Keselec Schréder Pvt. Ltd. with a state-of-the-art manufacturing facility in India.',
    products: ['Avento LED street lighting', 'Pilzeo LED street lights'],
    website: 'schreder.com',
    isIndian: false,
  },
  {
    id: 'ligman',
    name: 'LIGMAN Lighting',
    location: 'West Bengal & Uttar Pradesh, India (India HQ); Bangkok, Thailand (Global HQ)',
    description:
      'Operates through Ligman India Illumination Systems Pvt. Ltd. with facilities in West Bengal and Uttar Pradesh. Their product line includes a special DarkSky Approved Ranges collection.',
    products: ['DarkSky Approved outdoor luminaires'],
    website: 'ligman.com',
    isIndian: false,
  },
]

const { conf } = useAnimation()
</script>

<template>
  <section
    id="darksky-partners"
    class="py-16 relative"
  >
    <!-- Section title with motion animation -->
    <div
      v-motion
      class="wrapper mb-12 text-center"
      :initial="conf.sectionTitle.initial"
      :visible="conf.sectionTitle.enter"
    >
      <h2 class="text-3xl md:text-4xl font-bold mb-4 text-white">
        DarkSky Certified <span class="text-highlight">Partners in India</span>
      </h2>
      <p class="text-primary-200 text-lg max-w-3xl mx-auto">
        These companies offer DarkSky-certified lighting solutions that reduce light pollution and
        preserve our night skies while operating in India.
      </p>
    </div>

    <!-- Partners grid -->
    <div class="wrapper">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <IBGlass
          v-for="partner in partners"
          :key="partner.id"
          v-motion
          hover-effect="glow"
          glow-color="blue"
          gradient="mixed"
          intensity="minimal"
          interactive
          class="h-full"
          :initial="conf.card.initial"
          :enter="{
            ...conf.card.enter,
            transition: { ...conf.card.enter.transition, delay: 0.1 * partners.indexOf(partner) },
          }"
        >
          <div class="p-6 flex flex-col h-full">
            <!-- Partner header -->
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-white">{{ partner.name }}</h3>
              <span
                v-if="partner.isIndian"
                class="px-2 py-1 bg-primary-600/20 text-primary-400 text-xs font-semibold rounded-full"
              >
                India HQ
              </span>
            </div>

            <!-- Location info -->
            <div class="flex items-start mb-3">
              <Icon
                name="mdi:map-marker"
                size="18px"
                class="text-primary-500 mt-0.5 mr-2 flex-shrink-0"
              />
              <p class="text-sm text-primary-300">{{ partner.location }}</p>
            </div>

            <!-- Website info -->
            <div class="flex items-start mb-4">
              <Icon
                name="mdi:web"
                size="18px"
                class="text-primary-500 mt-0.5 mr-2 flex-shrink-0"
              />
              <a
                :href="`https://${partner.website}`"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-primary-300 hover:text-primary-400"
              >
                {{ partner.website }}
              </a>
            </div>

            <!-- Expandable content -->
            <div class="border-t border-primary-700/30 pt-4 mt-2">
              <div
                class="overflow-hidden transition-all duration-300"
                :class="activePartnerId === partner.id ? 'max-h-96' : 'max-h-24'"
              >
                <p class="text-primary-200 mb-3 text-sm">{{ partner.description }}</p>

                <div
                  v-if="activePartnerId === partner.id"
                  class="mb-3"
                >
                  <h4 class="text-sm font-semibold text-primary-400 mb-2"
                    >DarkSky Certified Products:</h4
                  >
                  <ul class="list-disc list-inside text-primary-300 text-sm pl-1">
                    <li
                      v-for="(product, index) in partner.products"
                      :key="index"
                    >
                      {{ product }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Toggle button -->
              <div class="flex justify-center mt-3">
                <PrimeButton
                  text
                  size="small"
                  class="text-primary-400 hover:text-primary-300 flex items-center px-4 py-2"
                  @click="togglePartnerDetails(partner.id)"
                >
                  {{ activePartnerId === partner.id ? 'Show Less' : 'Show More' }}
                  <Icon
                    :name="activePartnerId === partner.id ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                    size="16px"
                    class="ml-1"
                  />
                </PrimeButton>
              </div>
            </div>
          </div>
        </IBGlass>
      </div>

      <!-- Info box -->
      <div
        v-motion
        :initial="conf.fadeUp.initial"
        :visible="{
          ...conf.fadeUp.enter,
          transition: { ...conf.fadeUp.enter.transition, delay: 0.3 },
        }"
        class="mt-12 text-center"
      >
        <IBGlass
          hover-effect="glow"
          glow-color="blue"
          gradient="mixed"
          intensity="minimal"
          class="inline-block p-4"
        >
          <div class="flex items-center gap-3 text-primary-200">
            <Icon
              name="mdi:lightbulb"
              size="24px"
              class="text-primary-500 flex-shrink-0"
            />
            <span>
              DarkSky certification ensures luminaires minimize light pollution through proper
              shielding, color temperature, and efficient design.
            </span>
          </div>
        </IBGlass>
      </div>

      <!-- Call to action -->
      <div
        v-motion
        :initial="conf.fadeUp.initial"
        :visible="{
          ...conf.fadeUp.enter,
          transition: { ...conf.fadeUp.enter.transition, delay: 0.4 },
        }"
        class="mt-10 flex justify-center"
      >
        <a
          href="https://darksky.org/our-work/lighting/lighting-for-industry/fsa/"
          target="_blank"
          rel="noopener noreferrer"
          class="group"
        >
          <PrimeButton
            severity="primary"
            class="px-6 py-3"
          >
            <div class="flex items-center gap-2">
              <span>Learn More About DarkSky Certification</span>
              <Icon
                name="mdi:arrow-right"
                size="18px"
                class="transition-transform duration-300 group-hover:translate-x-1"
              />
            </div>
          </PrimeButton>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Ensure smooth height transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
