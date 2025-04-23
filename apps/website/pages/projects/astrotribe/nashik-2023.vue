<script setup lang="ts">
import { projects } from './astrotribe.json'

const project = projects.astrotribe_2023

// Use tabs at the top instead of sidebar
const activeTab = ref('about')

// Navigation tabs structure
const tabs = [
  { id: 'about', label: 'About', value: 'about' },
  { id: 'evaluation', label: 'Evaluation', value: 'evaluation' },
  { id: 'achievements', label: 'Achievements', value: 'achievements' },
  { id: 'stargazing', label: 'Stargazing Events', value: 'stargazing' },
  { id: 'resorts', label: 'Resort Collaborations', value: 'resorts' },
]

// For smooth scrolling to sections
const scrollToSection = (sectionId) => {
  activeTab.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 100, // Adjust for header height
      behavior: 'smooth',
    })
  }
}

// Animation constants for consistent effects
const { conf } = useAnimation()
</script>

<template>
  <!-- Hero section with background image -->
  <CommonHero
    :img="{
      src: 'images/astrotribe-guide-training-India.jpg',
      alt: `Astrotribe Guide Training`,
    }"
    :title="{
      main: project.title,
    }"
    invert
  />

  <!-- Tab navigation - styled similar to Conference page -->
  <div
    class="sticky top-[60px] z-50 bg-primary-950/80 backdrop-blur-md border-b border-primary-700/30"
  >
    <div class="wrapper flex overflow-x-auto no-scrollbar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button px-6 py-3 font-medium transition-all duration-200"
        :class="[
          activeTab === tab.value
            ? 'text-primary-400 border-b-2 border-primary-400'
            : 'text-gray-400 hover:text-primary-300 hover:border-b-2 hover:border-primary-300/50',
        ]"
        @click="scrollToSection(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>

  <!-- Main content with glass card styling -->
  <div class="wrapper py-12">
    <!-- About Section -->
    <section
      id="about"
      v-motion
      :initial="conf.fadeUp.initial"
      :visible="conf.fadeUp.enter"
      class="mb-16"
    >
      <IBGlass
        hover-effect="glow"
        glow-color="blue"
        gradient="mixed"
        intensity="low"
        class="p-8"
      >
        <h2 class="text-2xl font-bold text-white mb-6">About AstroTribe 2023</h2>
        <div class="prose prose-invert max-w-none">
          <p class="text-primary-200">{{ project.about }}</p>
        </div>
      </IBGlass>
    </section>

    <!-- Evaluation Section -->
    <section
      id="evaluation"
      v-motion
      :initial="conf.fadeUp.initial"
      :visible="conf.fadeUp.enter"
      class="mb-16"
    >
      <IBGlass
        hover-effect="glow"
        glow-color="purple"
        gradient="mixed"
        intensity="low"
        class="p-8"
      >
        <h2 class="text-2xl font-bold text-white mb-6">{{ project.evaluation.title }}</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div class="space-y-4">
            <p class="text-primary-200">{{ project.evaluation.text }}</p>
          </div>

          <div class="flex justify-center">
            <IBImage
              :img="{
                src: project.evaluation.image,
                alt: 'AstroTribe Evaluation Chart',
              }"
              class="rounded-lg border border-primary-700/30 shadow-lg max-w-full h-auto"
            />
          </div>
        </div>
      </IBGlass>
    </section>

    <!-- Achievements Section -->
    <section
      id="achievements"
      v-motion
      :initial="conf.fadeUp.initial"
      :visible="conf.fadeUp.enter"
      class="mb-16"
    >
      <IBGlass
        hover-effect="glow"
        glow-color="blue"
        gradient="mixed"
        intensity="low"
        class="p-8"
      >
        <h2 class="text-2xl font-bold text-white mb-6">{{ project.achievements.title }}</h2>

        <div class="space-y-6">
          <div
            v-for="(text, index) in project.achievements.text"
            :key="`achievement-${index}`"
            class="bg-primary-900/30 border border-primary-700/30 rounded-lg p-4"
          >
            <div class="flex items-start gap-3">
              <div
                class="bg-primary-700 text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1"
              >
                {{ index + 1 }}
              </div>
              <p class="text-primary-200">{{ text }}</p>
            </div>
          </div>
        </div>
      </IBGlass>
    </section>

    <!-- Stargazing Events Section -->
    <section
      id="stargazing"
      v-motion
      :initial="conf.fadeUp.initial"
      :visible="conf.fadeUp.enter"
      class="mb-16"
    >
      <IBGlass
        hover-effect="glow"
        glow-color="purple"
        gradient="mixed"
        intensity="low"
        class="p-8"
      >
        <h2 class="text-2xl font-bold text-white mb-6">{{ project.stargazingEvents.title }}</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="flex items-center gap-2 text-primary-300">
              <Icon
                name="mdi:map-marker"
                size="24px"
                class="text-primary-500"
              />
              <span class="font-semibold">Venue:</span>
              <span>{{ project.stargazingEvents.venue }}</span>
            </div>

            <div class="flex items-center gap-2 text-primary-300">
              <Icon
                name="mdi:calendar"
                size="24px"
                class="text-primary-500"
              />
              <span class="font-semibold">Date:</span>
              <span>{{ project.stargazingEvents.date }}</span>
            </div>

            <p class="text-primary-200 mt-4">{{ project.stargazingEvents.text }}</p>
          </div>

          <div class="relative">
            <IBImage
              :img="{
                src: 'images/astrotribe-stargazing-event.jpg',
                alt: 'AstroTribe Stargazing Event',
              }"
              class="rounded-lg w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-primary-950/80 to-transparent pointer-events-none"
            ></div>
          </div>
        </div>
      </IBGlass>
    </section>

    <!-- Resort Collaborations Section -->
    <section
      id="resorts"
      v-motion
      :initial="conf.fadeUp.initial"
      :visible="conf.fadeUp.enter"
      class="mb-16"
    >
      <IBGlass
        hover-effect="glow"
        glow-color="blue"
        gradient="mixed"
        intensity="low"
        class="p-8"
      >
        <h2 class="text-2xl font-bold text-white mb-6">{{ project.resortCollabs.title }}</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(resort, index) in project.resortCollabs.resorts"
            :key="`resort-${index}`"
            class="bg-primary-900/30 border border-primary-700/30 rounded-lg p-4 hover:border-primary-600/50 transition-colors duration-300"
          >
            <div class="flex items-start gap-3">
              <Icon
                name="mdi:hotel"
                size="24px"
                class="text-primary-500 flex-shrink-0"
              />
              <div>
                <h3 class="font-semibold text-white mb-1">Certified Resort Partner</h3>
                <p class="text-primary-200">{{ resort }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Optional Call to Action -->
        <div class="mt-8 p-6 bg-primary-800/30 border border-primary-700/30 rounded-lg text-center">
          <h3 class="text-xl font-semibold text-white mb-3">Become a Certified Partner</h3>
          <p class="text-primary-200 mb-4"
            >Interested in becoming a certified AstroTribe partner resort? Collaborate with us for
            dark sky preservation and astro-tourism opportunities.</p
          >
          <PrimeButton
            severity="secondary"
            outlined
            class="hover:bg-primary-700/30"
          >
            <div class="flex items-center gap-2">
              <Icon name="mdi:handshake" />
              <span>Contact for Partnership</span>
            </div>
          </PrimeButton>
        </div>
      </IBGlass>
    </section>
  </div>
</template>

<style scoped>
/* Smooth scrolling for the entire page */
html {
  scroll-behavior: smooth;
}

/* Hide scrollbar but allow scrolling */
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
