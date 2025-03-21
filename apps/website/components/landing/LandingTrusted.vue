<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LandingTitle from './LandingTitle.vue'

interface TrustedPartner {
  image: string
  name: string
  invert?: boolean
  category: 'research' | 'education' | 'space' | 'tech'
  description: string
}

const trustedPartners = ref<TrustedPartner[]>([
  {
    image: 'images/trusted/dst.png',
    name: 'DST',
    invert: true,
    category: 'research',
    description:
      "Department of Science and Technology - Government of India's premier scientific research organization.",
  },
  {
    image: 'images/trusted/iau-oad.png',
    name: 'IAU-OAD',
    invert: true,
    category: 'education',
    description: 'International Astronomical Union Office of Astronomy for Development.',
  },
  {
    image: 'images/trusted/in-fed.png',
    name: 'IN-FED',
    invert: true,
    category: 'space',
    description: 'Indian Federation of Space Research and Technology.',
  },
  {
    image: 'images/trusted/iimb-nsrcel.png',
    name: 'IIMB-NSRCEL',
    invert: true,
    category: 'tech',
    description: "IIM Bangalore's Innovation & Entrepreneurship Center.",
  },
])

const categoryColors = {
  research: 'from-blue-500/10 to-sky-500/10',
  education: 'from-purple-500/10 to-blue-500/10',
  space: 'from-sky-500/10 to-indigo-500/10',
  tech: 'from-indigo-500/10 to-purple-500/10',
}

</script>

<template>
  <section class="pt-16">
    <LandingTitle title="Supported by" />
    <!-- Partner Stats -->

    <!-- Partners Grid -->
    <div class="grid grid-cols-2 gap-8 items-center justify-items-center mb-16">
      <div
        v-for="(partner, index) in trustedPartners"
        :key="index"
        class="partner-logo group relative w-full"
      >
        <!-- Partner Card -->
        <div
          class="relative rounded-xl bg-primary-900/30 backdrop-blur-sm p-6 border border-primary-800/30 transition-all duration-500 hover:border-sky-500/30 !bg-gray-200"
        >
          <!-- Hover Gradient -->
          <div
            class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
            :class="categoryColors[partner.category]"
          ></div>

          <!-- Logo -->
          <div class="relative z-10 w-full">
            <NuxtImg
              :id="'partner-logo-' + index"
              v-tooltip="partner.description"
              :src="partner.image"
              :alt="partner.name"
              :class="[' w-full object-contain transition-all duration-300 group-hover:scale-110']"
            />
          </div>
        </div>

        <!-- Card Glow -->
        <div
          class="absolute inset-0 bg-sky-500/5 group-hover:bg-sky-500/10 blur-xl transition-all duration-500 -z-10 rounded-xl"
        ></div>
      </div>
    </div>

    <!-- CTA Section -->
    <!-- <div class="text-center space-y-6">
        <p class="text-xl text-gray-300">Ready to Join Our Network?</p>
        <div class="flex gap-4 justify-center">
          <PrimeButton
            label="Partner With Us"
            size="large"
            class="min-w-[200px] bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-all duration-300"
          />
          <PrimeButton
            label="Learn More"
            size="large"
            outlined
            severity="secondary"
            class="min-w-[200px] border-sky-500/30 hover:border-sky-500/50 text-sky-400 transition-all duration-300"
          />
        </div>
        <p class="text-sm text-gray-400 max-w-md mx-auto">
          Join our growing network of space industry leaders and help shape the future of space
          exploration
        </p>
      </div> -->
  </section>
</template>

<style scoped>
.filter.invert {
  filter: invert(1);
}
</style>
