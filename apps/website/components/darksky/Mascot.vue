<script setup lang="ts">
import type { TitleType } from '~/types/content'
import { useStarfield } from '~/composables/useStarfield'

const props = defineProps<{
  comicImage?: string
  buttonText?: string
  title?: TitleType
  socialLinks?: Array<{
    platform: string
    url: string
    icon: string
  }>
}>()

// Use starfield effect for background
const { stars, isClient } = useStarfield(30, 2)

// Default social media links
const defaultSocialLinks = [
  { platform: 'Twitter', url: '#', icon: 'mdi:twitter' },
  { platform: 'Instagram', url: '#', icon: 'mdi:instagram' },
  { platform: 'Facebook', url: '#', icon: 'mdi:facebook' },
]

// Use provided social links or defaults
const socialLinks = computed(() => props.socialLinks || defaultSocialLinks)

// Default comic image path
const comicImage = computed(() => props.comicImage || '/images/tara_comic_strip.jpg')
</script>

<template>
  <section class="relative py-16 overflow-hidden">
    <!-- Background stars -->
    <div
      v-if="isClient"
      class="absolute inset-0 z-0"
    >
      <div
        v-for="star in stars"
        :key="star.id"
        class="absolute rounded-full bg-white"
        :style="star.style"
      ></div>
    </div>

    <div class="wrapper relative z-10">
      <!-- Title section -->
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-2">
          {{ title?.main || 'Meet Tara the Firefly' }}
        </h2>
        <p class="text-xl text-primary-300">
          {{ title?.subtitle || 'Your quirky little mascot for saving the dark skies!' }}
        </p>
      </div>

      <!-- Comic strip - single image -->
      <div class="max-w-3xl mx-auto mb-12">
        <IBGlass
          hover-effect="glow"
          glow-color="orange"
          gradient="orange"
          intensity="low"
          class="p-4"
        >
          <div class="relative overflow-hidden rounded-lg">
            <IBImage
              :img="{
                src: comicImage,
                alt: 'Tara the Firefly Comic Strip',
                width: 1200,
                height: 800,
              }"
              class="w-full h-auto"
            />
          </div>
        </IBGlass>
      </div>

      <!-- CTA Section -->
      <div class="flex flex-col items-center gap-6">
        <!-- Tara image at bottom -->
        <div class="relative w-32 h-32">
          <IBImage
            :img="{
              src: '/images/mascot_tara.png',
              alt: 'Tara the Firefly',
              width: 128,
              height: 128,
            }"
            class="h-32 w-32 object-contain"
          />
          <div
            class="absolute inset-0 -z-1 bg-yellow-500/20 blur-2xl rounded-full animate-pulse"
          ></div>
        </div>

        <!-- Hashtag and call to action -->
        <div class="text-center">
          <p class="text-xl text-white">Join the movement —</p>
          <h3 class="text-3xl font-bold text-primary-300 mb-2">#FollowTara</h3>
          <p class="text-lg text-white">on social media!</p>
        </div>

        <!-- Social buttons -->
        <div class="flex gap-4">
          <a
            v-for="link in socialLinks"
            :key="link.platform"
            :href="link.url"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-primary-800 hover:bg-primary-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon
              :name="link.icon"
              size="20"
              class="text-white"
            />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wrapper {
  max-width: var(--max-width-md);
  margin: 0 auto;
  padding: 0 var(--px-sm);
}

@media (min-width: 768px) {
  .wrapper {
    padding: 0 var(--px-md);
  }
}

@media (min-width: 1024px) {
  .wrapper {
    max-width: var(--max-width-lg);
    padding: 0 var(--px-lg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>
