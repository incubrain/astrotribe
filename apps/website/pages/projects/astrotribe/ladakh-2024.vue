<script setup lang="ts">
import { projects } from './astrotribe.json'

const project = projects.astrotribe_2024

// Use tabs at the top instead of sidebar tabs
const activeTab = ref('about')

// Navigation tabs with better structure
const tabs = [
  { id: 'about', label: 'About', value: 'about' },
  { id: 'dps', label: 'DPS Manali', value: 'dps' },
  { id: 'secmol', label: 'SECMOL', value: 'secmol' },
  { id: 'comparison', label: 'Comparative Study', value: 'comparison' },
  { id: 'evaluation', label: 'Evaluation', value: 'evaluation' },
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
  <div class="relative min-h-screen">
    <!-- Hero section with background image -->
    <CommonHero
      :img="{
        src: 'images/astrotribe-ladakh-hp.jpg',
        alt: `Astrotribe Ladakh and Himachal Pradesh`,
      }"
      :title="{
        main: project.title,
      }"
      invert
    />

    <!-- Tab navigation - styled similar to Conference page -->
    <div
      class="sticky top-[60px] left-0 z-50 bg-primary-950/80 backdrop-blur-md border-b border-primary-700/30"
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
          <h2 class="text-2xl font-bold text-white mb-6">About AstroTribe</h2>
          <p class="text-primary-200">{{ project.about }}</p>
        </IBGlass>
      </section>

      <!-- DPS Manali Section -->
      <section
        id="dps"
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
          <h2 class="text-2xl font-bold text-white mb-6">DPS Manali AstroGuides</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="flex items-center gap-2 text-primary-300">
                <Icon
                  name="mdi:map-marker"
                  size="24px"
                  class="text-primary-500"
                />
                <span class="font-semibold">Venue:</span>
                <span>{{ project.dpsManali.venue }}</span>
              </div>

              <div class="flex items-center gap-2 text-primary-300">
                <Icon
                  name="mdi:calendar"
                  size="24px"
                  class="text-primary-500"
                />
                <span class="font-semibold">Date:</span>
                <span>{{ project.dpsManali.date }}</span>
              </div>

              <div class="flex items-center gap-2 text-primary-300">
                <Icon
                  name="mdi:account-group"
                  size="24px"
                  class="text-primary-500"
                />
                <span class="font-semibold">Conducted by:</span>
                <span>{{ project.dpsManali.conductedBy }}</span>
              </div>

              <h3 class="text-xl font-semibold text-white mt-6">Event Highlights</h3>
              <ul class="space-y-2">
                <li
                  v-for="highlight in project.dpsManali.highlights"
                  :key="highlight"
                  class="flex items-start gap-2"
                >
                  <Icon
                    name="mdi:star"
                    class="text-primary-500 mt-1 flex-shrink-0"
                  />
                  <span class="text-primary-200">{{ highlight }}</span>
                </li>
              </ul>
            </div>
            <div class="relative">
              <IBImage
                :img="{
                  src: 'images/dps-manali-astroguides.jpg',
                  alt: 'DPS Manali AstroGuides event',
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

      <!-- SECMOL Section -->
      <section
        id="secmol"
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
          <h2 class="text-2xl font-bold text-white mb-6">SECMOL AstroGuides</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="flex items-center gap-2 text-primary-300">
                <Icon
                  name="mdi:map-marker"
                  size="24px"
                  class="text-primary-500"
                />
                <span class="font-semibold">Venue:</span>
                <span>{{ project.secmol.venue }}</span>
              </div>

              <div class="flex items-center gap-2 text-primary-300">
                <Icon
                  name="mdi:account-group"
                  size="24px"
                  class="text-primary-500"
                />
                <span class="font-semibold">Conducted by:</span>
                <span>{{ project.secmol.conductedBy }}</span>
              </div>

              <h3 class="text-xl font-semibold text-white mt-6">Event Highlights</h3>
              <ul class="space-y-2">
                <li
                  v-for="highlight in project.secmol.highlights"
                  :key="`secmol-${highlight}`"
                  class="flex items-start gap-2"
                >
                  <Icon
                    name="mdi:star"
                    class="text-primary-500 mt-1 flex-shrink-0"
                  />
                  <span class="text-primary-200">{{ highlight }}</span>
                </li>
              </ul>
            </div>
            <div>
              <IBImage
                :img="{
                  src: project.secmol.image,
                  alt: 'SECMOL AstroGuides Group',
                }"
                class="rounded-lg w-full object-cover"
              />
            </div>
          </div>
        </IBGlass>
      </section>

      <!-- Comparative Study Section -->
      <section
        id="comparison"
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
          <h2 class="text-2xl font-bold text-white mb-6"
            >Comparative Study: SECMOL and Delhi Public School Manali</h2
          >

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <!-- SECMOL Card -->
            <IBGlass
              hover-effect="glow"
              glow-color="purple"
              intensity="minimal"
              class="p-6 h-full"
            >
              <h3 class="text-xl font-semibold text-white mb-4">SECMOL</h3>
              <p class="text-primary-200 mb-4">{{ project.comparison.secmol.description }}</p>
              <h4 class="text-lg font-semibold text-primary-300 mb-2">Key Features</h4>
              <ul class="space-y-2">
                <li
                  v-for="feature in project.comparison.secmol.features"
                  :key="feature"
                  class="flex items-start gap-2"
                >
                  <Icon
                    name="mdi:check-circle"
                    class="text-primary-500 mt-1 flex-shrink-0"
                  />
                  <span class="text-primary-200">{{ feature }}</span>
                </li>
              </ul>
            </IBGlass>

            <!-- DPS Card -->
            <IBGlass
              hover-effect="glow"
              glow-color="purple"
              intensity="minimal"
              class="p-6 h-full"
            >
              <h3 class="text-xl font-semibold text-white mb-4"
                >Delhi Public School (DPS), Manali</h3
              >
              <p class="text-primary-200 mb-4">{{ project.comparison.dps.description }}</p>
              <h4 class="text-lg font-semibold text-primary-300 mb-2">Key Features</h4>
              <ul class="space-y-2">
                <li
                  v-for="feature in project.comparison.dps.features"
                  :key="`dps-${feature}`"
                  class="flex items-start gap-2"
                >
                  <Icon
                    name="mdi:check-circle"
                    class="text-primary-500 mt-1 flex-shrink-0"
                  />
                  <span class="text-primary-200">{{ feature }}</span>
                </li>
              </ul>
            </IBGlass>
          </div>

          <!-- Purpose and Parameters Section -->
          <div class="space-y-6">
            <div>
              <h3 class="text-xl font-semibold text-white mb-3"
                >Purpose of Selecting These Schools</h3
              >
              <p class="text-primary-200">{{ project.comparison.purpose }}</p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-primary-300 mb-2">Parameters Compared</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="parameter in project.comparison.parameters"
                  :key="parameter"
                  class="bg-primary-900/30 border border-primary-700/30 rounded-lg p-3 text-primary-200 flex items-center gap-2"
                >
                  <Icon
                    name="mdi:compare"
                    class="text-primary-500"
                  />
                  {{ parameter }}
                </div>
              </div>
            </div>
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
          glow-color="blue"
          gradient="mixed"
          intensity="low"
          class="p-8"
        >
          <h2 class="text-2xl font-bold text-white mb-6">Comparative Evaluation</h2>

          <!-- Evaluation Images -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <IBImage
              v-for="(image, index) in project.evaluation.images"
              :key="`image-${index}`"
              :img="{
                src: image,
                alt: `Comparative evaluation chart ${index + 1}`,
              }"
              class="rounded-lg w-full h-auto object-contain bg-primary-950/50 p-2 border border-primary-800/30"
            />
          </div>

          <!-- Evaluation Content -->
          <IBGlass
            hover-effect="glow"
            glow-color="purple"
            intensity="minimal"
            class="p-6 mb-8"
          >
            <h3 class="text-xl font-semibold text-white mb-4"
              >Comparison Summary: DPS Manali vs. SECMOL AstroGuides Astronomy Knowledge</h3
            >

            <div class="space-y-6">
              <div
                v-for="(item, index) in project.evaluation.items"
                :key="index"
                class="space-y-2"
              >
                <h4 class="text-lg font-semibold text-primary-300"
                  >{{ index + 1 }}. {{ item.title }}</h4
                >
                <ul class="space-y-2 pl-6">
                  <li
                    v-for="(point, idx) in item.points"
                    :key="`${index}${idx}-${point}`"
                    class="flex items-start gap-2"
                  >
                    <Icon
                      name="mdi:circle-small"
                      class="text-primary-500 mt-1 flex-shrink-0"
                    />
                    <span class="text-primary-200">{{ point }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <h3 class="text-xl font-semibold text-white mt-8 mb-4">Key Takeaways</h3>
            <ul class="space-y-2">
              <li
                v-for="takeaway in project.evaluation.takeaways"
                :key="`${project.title}-${takeaway}`"
                class="flex items-start gap-2"
              >
                <Icon
                  name="mdi:lightbulb"
                  class="text-primary-500 mt-1 flex-shrink-0"
                />
                <span class="text-primary-200">{{ takeaway }}</span>
              </li>
            </ul>
          </IBGlass>

          <!-- Download Button -->
          <div class="flex justify-center">
            <PrimeButton
              severity="primary"
              size="large"
              class="bg-gradient-to-r from-blue-600 to-purple-600 border-0 px-6"
            >
              <div class="flex items-center gap-2">
                <Icon
                  name="mdi:file-download"
                  size="20px"
                />
                <span>Download Detailed Project Report</span>
              </div>
            </PrimeButton>
          </div>
        </IBGlass>
      </section>
    </div>
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
