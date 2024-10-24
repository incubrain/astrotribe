<script setup lang="ts">
import { onMounted } from 'vue'
import { useAnimation } from '~/composables/useAnimation'

const { fadeInUp, scaleIn } = useAnimation()

const socialMedia = [
  { name: 'LINKEDIN', icon: 'mdi:linkedin', color: 'info' },
  { name: 'TWITTER', icon: 'mdi:twitter', color: 'success' },
  { name: 'YOUTUBE', icon: 'mdi:youtube', color: 'danger' },
  { name: 'INSTAGRAM', icon: 'mdi:instagram', color: 'info' },
]

onMounted(() => {
  fadeInUp('.social-media-cta')
  scaleIn('.social-button')
})
</script>

<template>
  <section class="pb-8">
    <div
      class="w-full flex flex-col gap-8 background border border-color rounded-lg shadow-lg p-8 text-center"
    >
      <div class="social-media-cta">
        <LandingTitle
          title="Let's stay in touch"
          subtitle="Follow us on Social"
        />
        <div class="flex flex-wrap justify-center gap-8">
          <NuxtLink
            v-for="platform in socialMedia"
            :key="platform.name"
            href="#"
            class="social-button"
          >
            <PrimeButton
              outlined
              size="large"
              severity="secondary"
            >
              <Icon
                :name="platform.icon"
                size="24"
                class="mr-2"
              />
              {{ platform.name }}
            </PrimeButton>
          </NuxtLink>
        </div>
      </div>
      <div class="flex gap-4 max-w-xl mx-auto w-full">
        <PrimeInputText
          class="flex w-full border-4 border-primary-900"
          placeholder="Join our email newsletter"
        />
      </div>
    </div>
  </section>
</template>

<style>
.font-space {
  font-family: 'Orbitron', sans-serif;
}
</style>
