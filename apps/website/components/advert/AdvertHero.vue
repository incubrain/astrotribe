<script setup lang="ts">
const props = defineProps<{ openModal: () => void }>()

const scrollToContact = () => {
  const contactElement = document.getElementById('contact-form')
  if (contactElement) {
    contactElement.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="relative min-h-screen text-white w-full">
    <!-- Background image with overlay -->
    <IBImage
      :img="{
        src: 'advertising-hero.png',
        alt: 'AstronEra advertising analytics dashboard',
        quality: '80',
        format: 'webp',
      }"
      class="absolute left-0 top-0 h-full w-full bg-center bg-no-repeat object-cover"
    />
    <div class="absolute left-0 top-0 z-10 h-full w-full bg-zinc-900/70" />

    <!-- Hero content -->
    <div
      class="relative mx-auto grid max-w-[1920px] gap-8 px-4 py-32 md:px-16 lg:grid-cols-[1.5fr_1.75fr] xl:gap-16 xl:px-32"
    >
      <!-- Hero Left -->
      <div
        class="relative z-50 flex h-full w-full flex-col items-center gap-8 text-center lg:items-start lg:text-left"
      >
        <!-- <SvgStars
          class="top-14 left-14"
          :size="24"
          svg-color="#6366f1"
        /> -->
        <h1 class="max-w-lg text-4xl font-bold leading-tight lg:text-5xl">
          Reach Your Target Audience with AstronEra
        </h1>
        <p class="max-w-sm text-xl font-semibold">
          Connect with astronomy enthusiasts across India and beyond through our powerful platform
        </p>
        <div>
          <PrimeButton
            class="bg-primary-600 hover:bg-primary-700 px-6 py-3 text-lg"
            @click="openModal"
          >
            Advertise With Us
            <Icon
              name="i-lucide-rocket"
              class="ml-2"
            />
          </PrimeButton>
        </div>
        <!-- <SvgStars
          class="bottom-14 right-0"
          :size="18"
          svg-color="#6366f1"
        /> -->
      </div>

      <!-- Hero Right - Analytics showcase -->
      <div class="relative z-50 mx-auto flex h-full w-full items-center justify-center">
        <IBGlass
          hover-effect="glow"
          glow-color="blue"
          gradient="mixed"
          intensity="medium"
          class="p-6 rounded-lg"
        >
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-xl font-bold text-white">Campaign Performance</h3>
              <div class="bg-primary-700/50 px-3 py-1 rounded-full text-sm text-primary-200">
                Last Campaign
              </div>
            </div>

            <!-- Analytics metrics -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-primary-900/30 p-4 rounded-lg">
                <div class="text-primary-300 text-sm mb-1">Total Impressions</div>
                <div class="text-white text-2xl font-bold">15,240</div>
                <div class="text-primary-400 text-xs mt-1">+24% vs previous</div>
              </div>

              <div class="bg-primary-900/30 p-4 rounded-lg">
                <div class="text-primary-300 text-sm mb-1">Engagement Rate</div>
                <div class="text-white text-2xl font-bold">8.7%</div>
                <div class="text-primary-400 text-xs mt-1">Industry avg: 3.2%</div>
              </div>

              <div class="bg-primary-900/30 p-4 rounded-lg">
                <div class="text-primary-300 text-sm mb-1">Lead Conversion</div>
                <div class="text-white text-2xl font-bold">42</div>
                <div class="text-primary-400 text-xs mt-1">₹450 per acquisition</div>
              </div>

              <div class="bg-primary-900/30 p-4 rounded-lg">
                <div class="text-primary-300 text-sm mb-1">ROI</div>
                <div class="text-white text-2xl font-bold">317%</div>
                <div class="text-primary-400 text-xs mt-1">Exceeding targets</div>
              </div>
            </div>
          </div>
        </IBGlass>
      </div>
    </div>
  </div>
</template>
