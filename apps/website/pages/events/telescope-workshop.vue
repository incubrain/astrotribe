<script setup lang="ts">
// 1. Imports
import { ref, watch } from 'vue'

// 2. Component Options
defineOptions({
  name: 'TelescopeWorkshopPage',
})

// 3. Reactive Variables
const activeTab = ref('beginnerLevel')

// 4. Component state
const tabs = [
  { id: 'beginnerLevel', label: 'Beginner Level Session I' },
  { id: 'intermediateLevel', label: 'Intermediate Level Session II' },
  { id: 'whatToBring', label: 'What to Bring?' },
  { id: 'preWorkshop', label: 'Pre-Workshop Preparation' },
  { id: 'provided', label: "What's Provided" },
]

const title = {
  main: 'Telescope Setting Workshop',
  img: 'images/telescope-workshop-2025.jpeg',
}

const registrationLink = 'https://forms.gle/DZhUN6d5AeH3qmch8'

const beginnerSchedule = [
  {
    slot: 'saturday',
    value: '0',
    label: 'Saturday',
    day: 8,
    month: 'March',
    year: 2025,
    items: [
      {
        activity: 'Welcome & Introduction',
        time: { start: '07:00', end: '07:10' },
        description: [
          '- Introduction to the workshop',
          '- Discussion on experience with telescopes',
          '- Recap',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Understanding Telescopes',
        time: { start: '07:10', end: '07:30' },
        description: [
          '- Different types of telescopes',
          '- Discuss parts of a telescope',
          '- How to choose the right telescope based on budget & interest',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Telescope Assembly & Balancing',
        time: { start: '07:30', end: '07:50' },
        description: [
          '- Hands-on: Unbox and assemble a simple telescope',
          '- Balance the telescope for stable viewing',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Break & Q&A',
        time: { start: '07:50', end: '08:00' },
        description: ['- Short break for networking & questions'],
        class: 'bg-primary-950',
      },
      {
        activity: 'Basic Sky Navigation',
        time: { start: '08:00', end: '08:10' },
        description: [
          '- How to use Sky Maps & Stellarium to find celestial objects',
          '- Locating the Moon, planets & bright stars',
          '- Constellation Mapping',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Hands-On Observation Session',
        time: { start: '08:10', end: '08:50' },
        description: [
          '- Participants take turns using the telescope to view the Moon (or bright objects)',
          '- Adjusting focus, understanding eyepieces',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Wrap-Up',
        time: { start: '08:50', end: '09:00' },
        description: ['- Quick recap & feedback session.'],
        class: 'bg-primary-950',
      },
    ],
  },
]

const intermediateSchedule = [
  {
    slot: 'saturday',
    value: '1',
    label: 'Saturday',
    day: 15,
    month: 'March',
    year: 2025,
    items: [
      {
        activity: 'Welcome & Overview',
        time: { start: '07:00', end: '07:10' },
        description: [
          '- Introduction to the session',
          '- Discuss participant experience with telescopes',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Sky Navigation',
        time: { start: '07:10', end: '07:20' },
        description: ['- Constellation Mapping'],
        class: 'bg-primary-950',
      },
      {
        activity: 'Deep Sky Object Tracking',
        time: { start: '07:20', end: '07:50' },
        description: [
          '- How to locate and track Nebulae, Star Clusters, and Galaxies',
          '- Practice pointing telescopes manually & with slow-motion controls',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Break & Q&A',
        time: { start: '07:50', end: '08:00' },
        description: ['- Open discussion for doubts'],
        class: 'bg-primary-950',
      },
      {
        activity: 'Filters & Accessories',
        time: { start: '08:00', end: '08:10' },
        description: [
          '- Introduction to Barlow lenses, Moon & Nebula filters',
          '- How different filters enhance observation',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Hands-On Tracking Activity',
        time: { start: '08:10', end: '08:50' },
        description: [
          '- Practice tracking Orion Nebula, or Andromeda Galaxy',
          '- Use laser pointers to learn constellation mapping',
        ],
        class: 'bg-primary-950',
      },
      {
        activity: 'Wrap-Up',
        time: { start: '08:50', end: '09:00' },
        description: ['- Recap of learning.'],
        class: 'bg-primary-950',
      },
    ],
  },
]

const whatToBring = [
  '✔ Notebook & Pen – For taking notes on telescope setup & sky maps.',
  '✔ Red Flashlight – Helps maintain night vision while reading maps.',
  '✔ Smartphone or Tablet – Download Stellarium / SkySafari / Star Walk for sky navigation.',
  '✔ Water Bottle -Stay hydrated & refreshed.',
  '✔ Personal Telescope (Optional) – If you own one, bring it for hands-on practice!',
]

const preWorkshop = [
  '🔹 Download a Sky Map App: Stellarium',
  '🔹 Charge Your Phone & Power Bank – You might need it for apps & taking pictures',
  '🔹 Read Up on Basic Astronomy Terms – Understand terms like "focal length," "magnification," and "alt-azimuth"',
]

const provided = [
  '✔ Telescope & Accessories for training  (Eyepieces, Barlow lenses, Filters)',
  '✔ Sky Maps',
  '✔ Expert Guidance & Hands-on Experience',
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
  <div class="telescope-workshop-page">
    <!-- Hero Section -->
    <CommonHero
      :img="{
        src: title.img,
        alt: title.main,
        width: 1080,
        height: 720,
      }"
      :title="{
        main: title.main,
      }"
      position="center"
    >
      <div class="flex justify-center mt-4">
        <NuxtLink
          :to="registrationLink"
          target="_blank"
        >
          <PrimeButton
            size="large"
          >
            Register Interest
            <Icon
              name="mdi:arrow-right"
              class="ml-2"
            />
          </PrimeButton>
        </NuxtLink>
      </div>
    </CommonHero>

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
        <!-- Beginner Level Tab -->
        <div
          v-show="activeTab === 'beginnerLevel'"
          id="beginnerLevel"
          class="animate-fadeIn"
        >
          <div
            class="bg-primary-800/30 rounded-lg p-6 mb-8 backdrop-blur-sm border border-primary-700/30"
          >
            <h2 class="text-2xl font-bold text-primary-400 mb-4">Beginner Level Session I</h2>

            <div class="space-y-4">
              <div class="flex flex-col md:flex-row gap-4">
                <div class="md:w-1/2 space-y-2">
                  <div class="flex items-center gap-2">
                    <Icon
                      name="mdi:target"
                      class="text-primary-400"
                      size="24px"
                    />
                    <p class="font-medium">Objective:</p>
                  </div>
                  <p>Introduction to telescope types, basic handling, and sky navigation</p>
                </div>

                <div class="md:w-1/2 space-y-2">
                  <div class="flex items-center gap-2">
                    <Icon
                      name="mdi:currency-inr"
                      class="text-primary-400"
                      size="24px"
                    />
                    <p class="font-medium">Fee:</p>
                  </div>
                  <p>₹2000 Per Person</p>
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <Icon
                    name="mdi:map-marker"
                    class="text-primary-400"
                    size="24px"
                  />
                  <p class="font-medium">Venue:</p>
                </div>
                <p
                  >Prachi, 392/6B, Atreya Society, Deep Bangla Chowk, Model Colony, Pune,
                  Maharashtra 411016</p
                >
              </div>
            </div>
          </div>

          <div class="overflow-hidden rounded-lg mb-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15132.046394090614!2d73.831345!3d18.528378!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf781273177b%3A0x748518923253f332!2sAstron%20Era!5e0!3m2!1sen!2sin!4v1687445031830!5m2!1sen!2sin"
              height="400"
              style="border: 0; width: 100%"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <WorkshopSchedule :schedule="beginnerSchedule" />
        </div>

        <!-- Intermediate Level Tab -->
        <div
          v-show="activeTab === 'intermediateLevel'"
          id="intermediateLevel"
          class="animate-fadeIn"
        >
          <div
            class="bg-primary-800/30 rounded-lg p-6 mb-8 backdrop-blur-sm border border-primary-700/30"
          >
            <h2 class="text-2xl font-bold text-primary-400 mb-4">Intermediate Level Session II</h2>

            <div class="space-y-4">
              <div class="flex flex-col md:flex-row gap-4">
                <div class="md:w-1/2 space-y-2">
                  <div class="flex items-center gap-2">
                    <Icon
                      name="mdi:target"
                      class="text-primary-400"
                      size="24px"
                    />
                    <p class="font-medium">Objective:</p>
                  </div>
                  <p
                    >Learn how to fine-tune your telescope, track celestial objects, and spot
                    constellations</p
                  >
                </div>

                <div class="md:w-1/2 space-y-2">
                  <div class="flex items-center gap-2">
                    <Icon
                      name="mdi:currency-inr"
                      class="text-primary-400"
                      size="24px"
                    />
                    <p class="font-medium">Fee:</p>
                  </div>
                  <p>₹2500 Per Person</p>
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <Icon
                    name="mdi:map-marker"
                    class="text-primary-400"
                    size="24px"
                  />
                  <p class="font-medium">Venue:</p>
                </div>
                <p
                  >Prachi, 392/6B, Atreya Society, Deep Bangla Chowk, Model Colony, Pune,
                  Maharashtra 411016</p
                >
              </div>
            </div>
          </div>

          <div class="overflow-hidden rounded-lg mb-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15132.046394090614!2d73.831345!3d18.528378!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf781273177b%3A0x748518923253f332!2sAstron%20Era!5e0!3m2!1sen!2sin!4v1687445031830!5m2!1sen!2sin"
              height="400"
              style="border: 0; width: 100%"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <WorkshopSchedule :schedule="intermediateSchedule" />
        </div>

        <!-- What to Bring Tab -->
        <div
          v-show="activeTab === 'whatToBring'"
          id="whatToBring"
          class="animate-fadeIn"
        >
          <div
            class="bg-primary-800/30 rounded-lg p-6 mb-8 backdrop-blur-sm border border-primary-700/30"
          >
            <h2 class="text-2xl font-bold text-primary-400 mb-6">What to Bring?</h2>

            <ul class="space-y-6">
              <li
                v-for="(item, index) in whatToBring"
                :key="`bring-${index}`"
                class="flex items-start gap-4"
              >
                <div class="bg-primary-900/50 p-2 rounded-lg">
                  <Icon
                    name="mdi:check-circle"
                    class="text-primary-400"
                    size="24px"
                  />
                </div>
                <div class="flex-1 pt-1">{{ item }}</div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Pre-Workshop Preparation Tab -->
        <div
          v-show="activeTab === 'preWorkshop'"
          id="preWorkshop"
          class="animate-fadeIn"
        >
          <div
            class="bg-primary-800/30 rounded-lg p-6 mb-8 backdrop-blur-sm border border-primary-700/30"
          >
            <h2 class="text-2xl font-bold text-primary-400 mb-6">Pre-Workshop Preparation</h2>

            <ul class="space-y-6">
              <li
                v-for="(item, index) in preWorkshop"
                :key="`prep-${index}`"
                class="flex items-start gap-4"
              >
                <div class="bg-primary-900/50 p-2 rounded-lg">
                  <Icon
                    name="mdi:arrow-right-circle"
                    class="text-primary-400"
                    size="24px"
                  />
                </div>
                <div class="flex-1 pt-1">{{ item }}</div>
              </li>
            </ul>
          </div>
        </div>

        <!-- What's Provided Tab -->
        <div
          v-show="activeTab === 'provided'"
          id="provided"
          class="animate-fadeIn"
        >
          <div
            class="bg-primary-800/30 rounded-lg p-6 mb-8 backdrop-blur-sm border border-primary-700/30"
          >
            <h2 class="text-2xl font-bold text-primary-400 mb-6"
              >What's Provided in the Workshop</h2
            >

            <ul class="space-y-6">
              <li
                v-for="(item, index) in provided"
                :key="`provided-${index}`"
                class="flex items-start gap-4"
              >
                <div class="bg-primary-900/50 p-2 rounded-lg">
                  <Icon
                    name="mdi:check-circle"
                    class="text-primary-400"
                    size="24px"
                  />
                </div>
                <div class="flex-1 pt-1">{{ item }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Register CTA -->
      <div class="flex justify-center my-12">
        <NuxtLink
          :to="registrationLink"
          target="_blank"
        >
          <PrimeButton
            size="large"
            class="bg-primary-600 hover:bg-primary-500 font-semibold px-8 py-3"
          >
            Register Interest
            <Icon
              name="mdi:arrow-right"
              class="ml-2"
            />
          </PrimeButton>
        </NuxtLink>
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
