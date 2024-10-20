<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAnimation } from '~/composables/useAnimation'

const { fadeInUp } = useAnimation()
const loadVideo = ref(false)

onMounted(() => {
  fadeInUp('.webseries-section')
})
</script>

<template>
  <section class="pb-16 webseries-section">
    <div>
      <div class="grid grid-cols-2 gap-8 mb-8">
        <h2
          class="text-3xl md:text-4xl font-bold text-center p-8 font-space background border border-color rounded-md"
        >
          Follow the development of AstronEra in "Startups Guide to the Galaxy"
        </h2>
        <div
          class="flex justify-center items-center background border border-color rounded-lg shadow-lg p-6 text-center"
        >
          <div class="max-w-md">
            <h3 class="text-3xl md:text-4xl font-bold font-space mb-4">Support Us on Patreon</h3>
            <p class="mb-6">
              Get behind-the-scenes access and exclusive content about starting, growing, and
              running a SaaS company.
            </p>
            <NuxtLink
              to="https://www.patreon.com/YourPatreonLink"
              target="_blank"
            >
              <PrimeButton size="large"> Become a Patron </PrimeButton>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="p-4 lg:p-8 rounded-lg background border border-color">
        <div class="aspect-video relative">
          <img
            src="https://img.youtube.com/vi/gMG621m6QRE/hqdefault.jpg"
            alt="Startups Guide to the Galaxy - AstronEra"
            class="w-full h-full object-cover rounded-lg shadow-lg cursor-pointer"
            @click="loadVideo = true"
          />
          <div
            v-if="loadVideo"
            class="absolute inset-0"
          >
            <iframe
              src="https://www.youtube.com/embed/gMG621m6QRE?start=488&autoplay=1"
              title="Startups Guide to the Galaxy - AstronEra"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="w-full h-full rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
    <LazyLandingCTASocial class="pt-8 w-full" />
  </section>
</template>

<style scoped>
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
