<script setup lang="ts">
import type { TitleType } from '~/types/content'

defineProps<{
  storyParagraphs: string[]
  buttonText?: string
  downloadUrl?: string
  title?: TitleType
}>()
</script>

<template>
  <section class="py-16 my-8">
    <LandingTitle
      :title="title?.main || 'Meet Our Dark Sky Mascot'"
      :subtitle="title?.subtitle || 'Tara the Firefly'"
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
            class="w-full max-w-md relative z-10"
          />
          <!-- Glow effect -->
          <div class="absolute inset-0 -z-1 bg-yellow-500/30 blur-3xl rounded-full"></div>
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
            v-for="(paragraph, index) in storyParagraphs"
            :key="index"
            class="mb-4"
          >
            <p class="text-base">{{ paragraph }}</p>
          </div>

          <div class="flex justify-center mt-8">
            <button
              v-if="buttonText"
              class="bg-gradient-to-r text-white font-bold from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 border border-yellow-400 p-2 rounded-md"
              :href="downloadUrl"
              tag="a"
              download
            >
              <span>{{ buttonText || 'KNOW MY STORY' }}</span>
            </button>
          </div>
        </LandingGlass>
      </div>
    </div>
  </section>
</template>
