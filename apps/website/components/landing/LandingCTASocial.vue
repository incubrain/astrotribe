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
    <div class="w-full">
      <div
        class="social-media-cta background border border-color rounded-lg shadow-lg p-8 text-center w-full"
      >
        <LandingTitle
          title="Let's stay in touch"
          subtitle="Follow us on Social"
        />
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink
            v-for="platform in socialMedia"
            :key="platform.name"
            href="#"
            class="social-button"
          >
            <PrimeButton
              outlined
              :severity="platform.color"
              size="large"
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
    </div>
  </section>
</template>

<style>
.font-space {
  font-family: 'Orbitron', sans-serif;
}
</style>
