<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAnimation } from '~/composables/useAnimation'

const { fadeInUp, scaleOnHover } = useAnimation()

interface TrustedPartner {
  image: string
  name: string
  invert?: boolean
}

const trustedPartners = ref<TrustedPartner[]>([
  { image: 'images/trusted/dst.png', name: 'DST', invert: true },
  { image: 'images/trusted/iau-oad.png', name: 'IAU-OAD', invert: true },
  { image: 'images/trusted/in-fed.png', name: 'IN-FED', invert: true },
  { image: 'images/trusted/iimb-nsrcel.png', name: 'IIMB-NSRCEL' },
])

onMounted(() => {
  fadeInUp('.partner-logo')
  scaleOnHover('.partner-logo')
})
</script>

<template>
  <div class="relative py-32">
    <div
      class="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-transparent from-10% via-primary-950 via-50% to-transparent to-90%"
    ></div>
    <div class="wrapper mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
      <LandingTitle title="Trusted by Leading Organizations" />
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
        <div
          v-for="(partner, index) in trustedPartners"
          :key="index"
          class="flex flex-col items-center justify-center partner-logo"
        >
          <NuxtImg
            :id="'partner-logo-' + index"
            v-tooltip="partner.name"
            :src="partner.image"
            :alt="partner.name"
            :class="[
              'max-h-16 w-auto object-contain transition-all duration-300 hover:scale-110 ',
              partner.invert ? 'filter invert' : '',
            ]"
          />
        </div>
      </div>
      <div class="mt-16 text-center">
        <p class="mb-4 text-lg">Interested in partnering with us?</p>
        <PrimeButton
          label="Get in Touch"
          size="large"
          outlined
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter.invert {
  filter: invert(1);
}

/* You might need to adjust these styles based on your PrimeVue theme */
:deep(.p-tooltip) {
  @apply bg-white text-black px-2 py-1 rounded text-sm;
}

:deep(.p-button) {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-bold transition duration-300 transform hover:scale-105;
}
</style>
