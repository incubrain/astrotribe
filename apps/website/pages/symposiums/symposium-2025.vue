<script setup lang="ts">
// 1. Imports
import { ref, watch } from 'vue'

// 2. Component Options
defineOptions({
  name: 'SymposiumPage',
})

// 3. Reactive Variables
const activeTab = ref('about')

// 4. Component state
const tabs = [
  { id: 'about', label: 'About' },
  { id: 'venue', label: 'Venue' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'speakers', label: 'Speakers' },
  { id: 'brochure', label: 'Brochure' },
]

// 5. Methods
const setActiveTab = (tabId) => {
  activeTab.value = tabId
  history.replaceState(null, '', `#${tabId}`)
}

const updateTabFromHash = () => {
  const hash = window.location.hash.replace('#', '')
  if (hash) {
    const tab = tabs.find((t) => t.id === hash)
    if (tab) activeTab.value = tab.id
  }
}

// 6. Lifecycle Hooks
onMounted(() => {
  updateTabFromHash()
  window.addEventListener('hashchange', updateTabFromHash)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', updateTabFromHash)
})
</script>

<template>
  <div class="symposium-page relative">
    <MascotTopbar />

    <!-- Video Hero Section -->
    <div class="relative w-full">
      <!-- Video background -->
      <div class="aspect-video w-full overflow-hidden bg-primary-950">
        <iframe
          src="https://www.youtube.com/embed/_Du8pF2pru4?si=oAh8KtSqxrSJbGWg"
          title="IDSPS Symposium: India's Dark Sky Policy & Sustainability"
          class="w-full h-full"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen="true"
        ></iframe>
      </div>
    </div>

    <!-- Main Content -->
    <div class="wrapper pt-8">
      <!-- Horizontal Tabs Navigation -->
      <div class="mb-6 border-b border-primary-700/30">
        <div class="flex overflow-x-auto no-scrollbar">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-button px-6 py-3 font-medium text-sm sm:text-base transition-all duration-200"
            :class="[
              activeTab === tab.id
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-primary-300 hover:border-b-2 hover:border-primary-300/50',
            ]"
            @click="setActiveTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="tab-content mb-12">
        <!-- About Tab -->
        <div
          v-show="activeTab === 'about'"
          id="about"
          class="animate-fadeIn"
        >
          <div class="space-y-12">
            <!-- About Section -->
            <div
              class="bg-primary-800/30 rounded-lg p-6 backdrop-blur-sm border border-primary-700/30"
            >
              <h2 class="text-2xl font-bold text-primary-400 mb-4">About the Symposium</h2>
              <p class="mb-4">
                AstronEra proudly presents India's Dark Sky Policy & Sustainability Symposium, a
                platform dedicated to tackling the critical issue of light pollution. Excessive
                artificial lighting disrupts ecosystems, harms human health, wastes energy, and
                diminishes cultural and astronomical heritage. This event aims to bring together
                policymakers, lighting companies, and global experts to inspire actionable solutions
                for India, starting with Maharashtra.
              </p>
            </div>

            <!-- Why Attend Section -->
            <div
              class="bg-primary-800/30 rounded-lg p-6 backdrop-blur-sm border border-primary-700/30"
            >
              <h2 class="text-2xl font-bold text-primary-400 mb-4">Why Attend?</h2>
              <ul class="space-y-2 mb-6 list-disc pl-6">
                <li>Understand the ecological, health, and cultural impacts of light pollution.</li>
                <li>Learn from global experts on successful dark sky conservation initiatives.</li>
                <li
                  >Collaborate with policymakers and industries to create sustainable solutions.</li
                >
                <li>Be a part of drafting policies and frameworks for dark sky policy in India.</li>
              </ul>
              <div class="rounded-lg overflow-hidden">
                <IBImage
                  :img="{
                    src: '/symposium/light_pollution_map.jpeg',
                    alt: 'Light pollution map showing global distribution',
                  }"
                  class="w-full"
                />
              </div>
            </div>

            <!-- Objectives Section -->
            <div
              class="bg-primary-800/30 rounded-lg p-6 backdrop-blur-sm border border-primary-700/30"
            >
              <h2 class="text-2xl font-bold text-primary-400 mb-4">Objectives</h2>
              <ul class="space-y-2 mb-6 list-disc pl-6">
                <li
                  >Raise awareness about light pollution and its impacts on nature, humans, and
                  astronomy.</li
                >
                <li
                  >Inspire pilot projects in rural areas to measure the impact of dark sky
                  conservation efforts.</li
                >
                <li
                  >Initiate conversations about drafting policies for sustainable urban planning,
                  light pollution mitigation, and creation of dark sky reserves.</li
                >
                <li>Highlight dark skies as a fundamental right for every global citizen.</li>
              </ul>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div class="rounded-lg overflow-hidden">
                  <IBImage
                    :img="{
                      src: 'symposium/before_and_after_germany.jpeg',
                      alt: 'Before and after image of light pollution reduction in Germany',
                    }"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="rounded-lg overflow-hidden">
                  <IBImage
                    :img="{
                      src: 'symposium/before_and_after_wales.jpeg',
                      alt: 'Before and after image of light pollution reduction in Wales',
                    }"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <!-- Be the Changemaker Section -->
            <div
              class="bg-primary-800/30 rounded-lg p-6 backdrop-blur-sm border border-primary-700/30"
            >
              <h2 class="text-2xl font-bold text-primary-400 mb-4">Be the Changemaker</h2>
              <p class="mb-4">
                This symposium offers a unique opportunity for policymakers and lighting companies
                to take a leadership role in combating light pollution. Together, let's create a
                sustainable future by preserving our nightscapes.
              </p>
              <div class="rounded-lg overflow-hidden mt-4">
                <IBImage
                  :img="{
                    src: 'symposium/five_principals_for_lighting.jpeg',
                    alt: 'Five principles for responsible lighting',
                  }"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Venue Tab -->
        <div
          v-show="activeTab === 'venue'"
          id="venue"
          class="animate-fadeIn"
        >
          <SymposiumVenue />
        </div>

        <!-- Schedule Tab -->
        <div
          v-show="activeTab === 'schedule'"
          id="schedule"
          class="animate-fadeIn"
        >
          <SymposiumSchedule />
        </div>

        <!-- Speakers Tab -->
        <div
          v-show="activeTab === 'speakers'"
          id="speakers"
          class="animate-fadeIn"
        >
          <SymposiumSpeakers />
        </div>

        <!-- Brochure Tab -->
        <div
          v-show="activeTab === 'brochure'"
          id="brochure"
          class="animate-fadeIn"
        >
          <h2 class="text-2xl font-bold text-primary-400 mb-6">Symposium Materials</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              class="bg-primary-800/30 rounded-lg p-6 backdrop-blur-sm border border-primary-700/30"
            >
              <h3 class="text-xl font-bold text-primary-300 mb-4">Symposium Report</h3>
              <div
                class="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-primary-700/30 shadow-lg mb-4"
              >
                <iframe
                  src="/symposium/idsps_symposium_report.pdf#page=1&zoom=FitH&toolbar=0&navpanes=0&scrollbar=0"
                  frameborder="0"
                  class="w-full h-full blur-sm pointer-events-none"
                ></iframe>
                <div class="absolute inset-0 flex items-center justify-center">
                  <PrimeButton
                    class="bg-primary-600 hover:bg-primary-500 shadow-lg"
                    icon="mdi:file-download"
                    label="Download Report"
                    href="/symposium/idsps_symposium_report.pdf"
                    download="IDSPS_Symposium_Report.pdf"
                  />
                </div>
              </div>
            </div>

            <div
              class="bg-primary-800/30 rounded-lg p-6 backdrop-blur-sm border border-primary-700/30"
            >
              <h3 class="text-xl font-bold text-primary-300 mb-4">Symposium Brochure</h3>
              <div
                class="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-primary-700/30 shadow-lg mb-4"
              >
                <iframe
                  src="/symposium/brochure_symposium_2025.pdf#page=1&zoom=FitH&toolbar=0&navpanes=0&scrollbar=0"
                  frameborder="0"
                  class="w-full h-full blur-sm pointer-events-none"
                ></iframe>
                <div class="absolute inset-0 flex items-center justify-center">
                  <PrimeButton
                    class="bg-primary-600 hover:bg-primary-500 shadow-lg"
                    icon="mdi:file-download"
                    label="Download Brochure"
                    href="/symposium/brochure_symposium_2025.pdf"
                    download="IDSPS_Symposium_Brochure.pdf"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
