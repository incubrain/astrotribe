<script setup lang="ts">
import { onMounted } from 'vue'

const features = [
  {
    text: 'Comprehensive News Feed',
    description: 'Access space news from 20+ trusted sources, updated 24/7',
    icon: 'mdi:newspaper-variant-outline',
  },
  {
    text: 'Community-Driven Content',
    description: 'Upvote and downvote articles to surface the best content',
    icon: 'mdi:thumb-up-outline',
  },
  {
    text: 'Personalized Experience',
    description: 'Customize your feed by selecting specific space categories',
    icon: 'mdi:tune-vertical',
  },
  {
    text: 'Smart Bookmarking',
    description: 'Save and organize articles into custom folders',
    icon: 'mdi:bookmark-outline',
  },
]

const comingSoon = [
  {
    text: 'Research Integration',
    description: 'Access latest space research papers and findings',
    icon: 'mdi:file-document-outline',
  },
  {
    text: 'AI-Powered Summaries',
    description: 'Get quick, accurate summaries of long articles',
    icon: 'mdi:robot-outline',
  },
  {
    text: 'Space Company Profiles',
    description: 'Track developments from leading space companies',
    icon: 'mdi:office-building-outline',
  },
]
</script>

<template>
  <section class="py-12 md:py-24">
    <LandingGlass
      gradient="mixed"
      intensity="low"
    >
      <LandingTitle
        title="Your Gateway to Space News"
        subtitle="One platform for all your space news needs - completely free"
      />
      <div class="pricing-content flex flex-col items-center px-4 md:px-6">
        <!-- Price Tag -->
        <div class="flex items-baseline gap-2 mb-8">
          <span class="text-4xl md:text-6xl font-bold text-sky-400">$0</span>
          <span class="text-xl text-gray-400">/</span>
          <span
            class="ml-2 px-4 py-1 text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
          >
            FOREVER FREE
          </span>
        </div>

        <!-- Current Features -->
        <h3 class="text-xl text-white mb-6 font-medium">Available Now</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-12 w-full max-w-4xl">
          <div
            v-for="feature in features"
            :key="feature.text"
            class="group relative flex"
          >
            <div
              class="relative rounded-xl bg-primary-900/30 backdrop-blur-sm p-4 border border-primary-800/30 transition-all duration-300 hover:border-sky-500/30 w-full"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
              />
              <div class="relative z-10 flex items-start gap-3">
                <Icon
                  :name="feature.icon"
                  class="text-sky-400 flex-shrink-0 mt-1"
                  size="24"
                />
                <div>
                  <h4 class="font-medium text-white mb-1">{{ feature.text }}</h4>
                  <p class="text-sm text-gray-400">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Coming Soon Features -->
        <h3 class="text-xl text-white mb-6 font-medium">Coming Soon</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-12 w-full max-w-4xl">
          <div
            v-for="feature in comingSoon"
            :key="feature.text"
            class="group relative flex"
          >
            <div
              class="relative rounded-xl bg-primary-900/20 backdrop-blur-sm p-4 border border-primary-800/20 transition-all duration-300 w-full"
            >
              <div class="relative z-10 flex items-start gap-3">
                <Icon
                  :name="feature.icon"
                  class="text-gray-400 flex-shrink-0 mt-1"
                  size="24"
                />
                <div>
                  <h4 class="font-medium text-gray-300 mb-1">{{ feature.text }}</h4>
                  <p class="text-sm text-gray-500">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
      </div>
      <div class="text-center space-y-6 max-w-2xl">
        <p class="text-gray-300">Start exploring the cosmos today - no credit card required!</p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <PrimeButton
            label="Start Reading Now"
            icon="mdi:rocket-launch-outline"
            size="large"
            class="min-w-[200px] bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-all duration-300"
          />
          <!-- <PrimeButton
              label="How It Works"
              size="large"
              outlined
              severity="secondary"
              class="min-w-[200px] border-sky-500/30 hover:border-sky-500/50 text-sky-400 transition-all duration-300"
            /> -->
        </div>
        <p class="text-sm text-gray-400">
          Join the growing community of space enthusiasts at AstronEra
        </p>
      </div>
    </LandingGlass>
  </section>
</template>
