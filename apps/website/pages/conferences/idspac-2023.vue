<script setup lang="ts">
// 1. Imports
import { ref } from 'vue'

// 2. Component Options
defineOptions({
  name: 'ConferencePage',
})

// 3. Reactive Variables
const activeTab = ref('About')

// 4. Component state
const tabs = [
  { id: 'About', label: 'About' },
  // { id: 'Venue', label: 'Venue' },
  { id: 'Schedule', label: 'Schedule' },
  { id: 'Speakers', label: 'Speakers' },
]

// 5. Methods
const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
  history.replaceState(null, '', `#${tabId.toLowerCase()}`)
}

const updateTabFromHash = () => {
  const hash = window.location.hash.replace('#', '')
  const tab = tabs.find((t) => t.id.toLowerCase() === hash.toLowerCase())
  if (tab) activeTab.value = tab.id
}

onMounted(() => {
  updateTabFromHash()
  window.addEventListener('hashchange', updateTabFromHash)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', updateTabFromHash)
})

// 6. Composables
const { isMobile } = useNavigation()
</script>

<template>
  <div class="conference-page">
    <!-- Hero Section with Improved Styling -->
    <CommonHero
      :img="{
        src: 'conference/photos/IDSPAC23-ruchira-huchgol.jpg',
        alt: 'Featured image for the Dark Sky Conservation India Conference',
      }"
      :title="{
        centered: false,
        main: 'Dark Sky Conservation India Conference',
        subtitle: '24th-26th November 2023',
      }"
      position="object-top"
    >
      <div class="hero-content flex items-center justify-center gap-6">
        <IBImage
          :img="{
            src: 'images/trusted/dst.png',
          }"
          class="mx-auto h-16 lg:h-20"
        />
      </div>
    </CommonHero>

    <!-- Horizontal Tabs Navigation -->
    <div class="wrapper pt-8">
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
          v-show="activeTab === 'About'"
          class="animate-fadeIn"
        >
          <ConferenceAbout />
          <div class="mt-10 flex flex-col gap-6 xl:gap-12">
            <div class="flex flex-col items-start gap-6 lg:flex-row xl:gap-12">
              <div class="space-y-4 lg:w-1/2">
                <h3 class="text-lg font-bold text-primary-400">Conference Summary</h3>
                <p>
                  The conference effectively laid the groundwork for substantive discussions
                  concerning the preservation of dark skies and the promotion of astro-tourism in
                  India, successfully achieving its stated goals and objectives. In light of the
                  insights garnered from this conference, the subsequent steps entail the
                  organization of an in-person workshop spanning 2-3 days, aimed at convening
                  stakeholders, government officials, engineers, architects, and space policy
                  representatives.
                </p>
                <p>
                  This workshop will be instrumental in addressing the issue of light pollution and
                  formulating actionable solutions, thereby taking a significant stride toward
                  preserving dark and tranquil skies.
                </p>
              </div>
              <div class="space-y-4 lg:w-1/2">
                <p>
                  Additionally, plans are underway to convene an online summit to synthesize the
                  discussions held and distill key themes for consideration in future in-person
                  conferences.
                </p>
                <p>
                  Moreover, a collaborative endeavor is ongoing to host a dedicated in-person
                  conference focusing on "Preserving the Night Sky for Astronomy and Sustainable
                  Development," which will bring together government officials and industry experts
                  to engage in substantive discussions and collectively devise pragmatic solutions.
                  Subsequent initiatives will include the dissemination of research findings through
                  the publication of articles, reports, and papers across various platforms,
                  including the CAP conference, IAU publications, and esteemed scientific journals.
                </p>
              </div>
            </div>

            <!-- Key Themes Section -->
            <div class="mt-8">
              <h3 class="text-lg font-bold text-primary-400 mb-4">Key Themes</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  class="bg-primary-800/30 backdrop-blur-sm p-4 rounded-lg border border-primary-700/30"
                >
                  <h4 class="text-primary-300 font-medium mb-2">Satellite Impacts</h4>
                  <p class="text-sm"
                    >Satellite constellations and space debris impact on observations</p
                  >
                </div>
                <div
                  class="bg-primary-800/30 backdrop-blur-sm p-4 rounded-lg border border-primary-700/30"
                >
                  <h4 class="text-primary-300 font-medium mb-2">Science & Culture</h4>
                  <p class="text-sm">Astronomy in everyday life: bridging science and culture</p>
                </div>
                <div
                  class="bg-primary-800/30 backdrop-blur-sm p-4 rounded-lg border border-primary-700/30"
                >
                  <h4 class="text-primary-300 font-medium mb-2">Light Pollution</h4>
                  <p class="text-sm"
                    >Controlling light pollution for enhanced astronomical visibility</p
                  >
                </div>
              </div>
            </div>

            <div class="mt-12">
              <IBImage
                :img="{
                  src: 'conference/photos/IDSPAC23-group-photo.jpg',
                  alt: 'Conference group photo',
                  width: '900',
                  height: '460',
                }"
                class="mx-auto w-full rounded-md shadow-xl"
              />
              <p class="w-full p-4 text-center text-primary-300">
                Thank you to everyone who made this possible! ❤️
              </p>
              <div class="flex items-center justify-center mt-6">
                <a
                  href="/conference/full-conference-report.pdf"
                  target="_blank"
                >
                  <PrimeButton class="bg-primary-600 hover:bg-primary-500">
                    <Icon
                      name="mdi:file-document-outline"
                      class="mr-2"
                    />
                    View Full Conference Report
                  </PrimeButton>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Venue Tab -->
        <!-- <div
          v-show="activeTab === 'Venue'"
          class="animate-fadeIn"
        >
          <ConferenceVenue />
        </div> -->

        <!-- Schedule Tab -->
        <div
          v-show="activeTab === 'Schedule'"
          class="animate-fadeIn"
        >
          <ConferenceScheduleTabs />
        </div>

        <!-- Speakers Tab -->
        <div
          v-show="activeTab === 'Speakers'"
          class="animate-fadeIn"
        >
          <ConferenceSpeakers />
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
