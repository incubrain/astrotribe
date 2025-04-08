<script setup lang="ts">
// 1. Imports
import { ref } from 'vue'

// 2. Component Options
defineOptions({
  name: 'TelescopeWorkshopPage',
})

// 3. Reactive Variables
const activeTab = ref('beginnerLevel')

// 4. Component state
const tabs = [
  { id: 'beginnerLevel', label: 'Beginner Level Workshop' },
  // { id: 'intermediateLevel', label: 'Intermediate Level Workshop' },
  { id: 'equipment', label: 'Our Equipment' },
  { id: 'whatToBring', label: 'What to Bring?' },
  { id: 'preWorkshop', label: 'Pre-Workshop Preparation' },
]

// Equipment data
const telescopeInfo = {
  name: 'Celestron NexStar 6SE Computerized Telescope',
  itemNumber: '11068',
  warranty: '2 Years',
  image: 'images/nexstar-6se-telescope.jpg', // This assumes you have this image, replace with actual path
  mainFeatures: [
    '6-inch aperture with excellent light-gathering ability',
    'Fully automated GoTo mount with database of 40,000+ celestial objects',
    'SkyAlign technology for quick alignment and setup',
    'Unique single fork arm design for easy transport',
    'Perfect for viewing the Moon, planets, and deep sky objects',
  ],
  description: [
    "Celestron's signature orange-tube telescope combines advanced features and excellent optics in one easy-to-use system, the NexStar 6SE. It's the perfect choice for your first serious telescope, offering striking views at an economical price.",
    "The 6SE's six-inch primary mirror packs enough light-gathering ability to observe the best that the solar system has to offer: Cassini's Division in Saturn\'s rings, the cloud bands on Jupiter, and geographic features on the surface of the Moon.",
    "When it comes to deep sky objects, take your 6SE to a dark-sky site and you'll see hundreds of pinpoint stars in the Hercules Globular Cluster, the spiral arms of the Whirlpool Galaxy, and more.",
  ],
  keyCapabilities: [
    "View Saturn's rings and the cloud bands on Jupiter",
    "Observe geographic features on the Moon's surface",
    'See hundreds of pinpoint stars in star clusters',
    'Identify and track over 40,000 celestial objects automatically',
    'Simple setup with SkyAlign technology',
  ],
}

const title = {
  main: 'Telescope Setting Workshop',
  img: 'images/telescope-workshop-2025.jpeg',
}

const registrationLink = 'https://forms.gle/DZhUN6d5AeH3qmch8'

// Workshop descriptions without specific dates or times
const beginnerWorkshop = {
  title: 'Beginner Level Workshop',
  description: 'Introduction to telescope types, basic handling, and sky navigation',
  fee: '₹2000 Per Person',
  venue:
    'Prachi, 392/6B, Atreya Society, Deep Bangla Chowk, Model Colony, Pune, Maharashtra 411016',
  schedule: [
    {
      activity: 'Welcome & Introduction',
      duration: '10 minutes',
      description: [
        '- Introduction to the workshop',
        '- Discussion on experience with telescopes',
        '- Recap',
      ],
      class: 'bg-primary-950',
    },
    {
      activity: 'Understanding Telescopes',
      duration: '20 minutes',
      description: [
        '- Different types of telescopes',
        '- Discuss parts of a telescope',
        '- How to choose the right telescope based on budget & interest',
      ],
      class: 'bg-primary-950',
    },
    {
      activity: 'Telescope Assembly & Balancing',
      duration: '20 minutes',
      description: [
        '- Hands-on: Unbox and assemble a simple telescope',
        '- Balance the telescope for stable viewing',
      ],
      class: 'bg-primary-950',
    },
    {
      activity: 'Break & Q&A',
      duration: '10 minutes',
      description: ['- Short break for networking & questions'],
      class: 'bg-primary-950',
    },
    {
      activity: 'Basic Sky Navigation',
      duration: '10 minutes',
      description: [
        '- How to use Sky Maps & Stellarium to find celestial objects',
        '- Locating the Moon, planets & bright stars',
        '- Constellation Mapping',
      ],
      class: 'bg-primary-950',
    },
    {
      activity: 'Hands-On Observation Session',
      duration: '40 minutes',
      description: [
        '- Participants take turns using the telescope to view the Moon (or bright objects)',
        '- Adjusting focus, understanding eyepieces',
      ],
      class: 'bg-primary-950',
    },
    {
      activity: 'Wrap-Up',
      duration: '10 minutes',
      description: ['- Quick recap & feedback session.'],
      class: 'bg-primary-950',
    },
  ],
}

const intermediateWorkshop = {
  title: 'Intermediate Level Workshop',
  description:
    'Learn how to fine-tune your telescope, track celestial objects, and spot constellations',
  fee: '₹2500 Per Person',
  venue:
    'Prachi, 392/6B, Atreya Society, Deep Bangla Chowk, Model Colony, Pune, Maharashtra 411016',
  schedule: [
    {
      activity: 'Welcome & Overview',
      duration: '10 minutes',
      description: [
        '- Introduction to the session',
        '- Discuss participant experience with telescopes',
      ],
      class: 'bg-primary-950',
    },
    {
      activity: 'Sky Navigation',
      duration: '10 minutes',
      description: ['- Constellation Mapping'],
      class: 'bg-primary-950',
    },
    {
      activity: 'Deep Sky Object Tracking',
      duration: '30 minutes',
      description: [
        '- How to locate and track Nebulae, Star Clusters, and Galaxies',
        '- Practice pointing telescopes manually & with slow-motion controls',
      ],
      class: 'bg-primary-950',
    },
    {
      activity: 'Break & Q&A',
      duration: '10 minutes',
      description: ['- Open discussion for doubts'],
      class: 'bg-primary-950',
    },
    {
      activity: 'Filters & Accessories',
      duration: '10 minutes',
      description: [
        '- Introduction to Barlow lenses, Moon & Nebula filters',
        '- How different filters enhance observation',
      ],
      class: 'bg-primary-950',
    },
    {
      activity: 'Hands-On Tracking Activity',
      duration: '40 minutes',
      description: [
        '- Practice tracking Orion Nebula, or Andromeda Galaxy',
        '- Use laser pointers to learn constellation mapping',
      ],
      class: 'bg-primary-950',
    },
    {
      activity: 'Wrap-Up',
      duration: '10 minutes',
      description: ['- Recap of learning.'],
      class: 'bg-primary-950',
    },
  ],
}

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

// 5. Methods
const updateTabFromHash = () => {
  const hash = window.location.hash.replace('#', '')
  if (hash) {
    const tab = tabs.find((t) => t.id === hash)
    if (tab) activeTab.value = tab.id
  }
}

// Handle tab change and update URL hash
const onTabChange = (tabId) => {
  activeTab.value = tabId
  window.history.replaceState(null, '', `#${tabId}`)
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
    </CommonHero>

    <!-- Workshop Information Banner -->
    <div class="wrapper">
      <div
        class="bg-primary-600/90 text-white p-6 rounded-lg mt-8 mb-4 backdrop-blur-sm border border-primary-500/50"
      >
        <div class="flex flex-col md:flex-row items-center gap-4">
          <div class="flex-1">
            <h2 class="text-xl font-bold mb-2">Register Your Interest</h2>
            <p
              >We're collecting interest for upcoming telescope workshops. Once we have enough
              participants (15 per workshop), we'll contact you with available dates and times.</p
            >
          </div>
          <NuxtLink
            :to="registrationLink"
            target="_blank"
          >
            <PrimeButton
              size="large"
              class="bg-white text-primary-700 hover:bg-primary-100 font-semibold px-8 py-3 whitespace-nowrap"
            >
              Register Now
              <Icon
                name="mdi:arrow-right"
                class="ml-2"
              />
            </PrimeButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="wrapper pt-4">
      <!-- PrimeTabs Component -->
      <PrimeTabs
        v-model:value="activeTab"
        scrollable
        :pt="{
          root: 'w-full',
        }"
        @update:value="onTabChange"
      >
        <PrimeTabList
          :pt="{
            root: 'border-b border-primary-700/30 mb-6',
          }"
        >
          <PrimeTab
            v-for="tab in tabs"
            :key="tab.id"
            :value="tab.id"
            :pt="{
              root: ({ context }) => ({
                class: [
                  'px-6 py-3 font-medium text-sm sm:text-base transition-all duration-200',
                  {
                    'text-primary-400 border-b-2 border-primary-400': context.active,
                    'text-gray-400 hover:text-primary-300 hover:border-b-2 hover:border-primary-300/50':
                      !context.active,
                  },
                ],
              }),
            }"
          >
            {{ tab.label }}
          </PrimeTab>
        </PrimeTabList>

        <PrimeTabPanel
          value="beginnerLevel"
          :pt="{
            root: 'animate-fadeIn',
          }"
        >
          <div
            class="bg-primary-800/30 rounded-lg p-6 mb-8 backdrop-blur-sm border border-primary-700/30"
          >
            <h2 class="text-2xl font-bold text-primary-400 mb-4">{{ beginnerWorkshop.title }}</h2>

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
                  <p>{{ beginnerWorkshop.description }}</p>
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
                  <p>{{ beginnerWorkshop.fee }}</p>
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
                <p>{{ beginnerWorkshop.venue }}</p>
              </div>

              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <Icon
                    name="mdi:information-outline"
                    class="text-primary-400"
                    size="24px"
                  />
                  <p class="font-medium">Workshop Size:</p>
                </div>
                <p>Limited to 15 participants per workshop for optimal hands-on experience</p>
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

          <!-- Workshop Schedule -->
          <div
            class="bg-primary-800/30 rounded-lg overflow-hidden mb-8 border border-primary-700/30"
          >
            <div class="p-6">
              <h3 class="text-xl font-bold text-primary-400 mb-4">Workshop Schedule</h3>
              <p class="text-gray-300 mb-4"
                >This is the general schedule we follow for our beginner workshops. Exact dates and
                times will be shared once we have enough registrations.</p
              >
            </div>

            <div class="divide-y divide-primary-700/30">
              <div
                v-for="(item, index) in beginnerWorkshop.schedule"
                :key="`schedule-${index}`"
                class="p-4 hover:bg-primary-700/20 transition-colors"
              >
                <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div class="md:w-1/3">
                    <h4 class="font-medium text-primary-300">{{ item.activity }}</h4>
                    <div class="text-sm text-gray-400">{{ item.duration }}</div>
                  </div>
                  <div class="md:w-2/3 text-sm text-gray-300">
                    <ul>
                      <li
                        v-for="(desc, i) in item.description"
                        :key="`desc-${i}`"
                        >{{ desc }}</li
                      >
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PrimeTabPanel>

        <PrimeTabPanel
          value="intermediateLevel"
          :pt="{
            root: 'animate-fadeIn',
          }"
        >
          <div
            class="bg-primary-800/30 rounded-lg p-6 mb-8 backdrop-blur-sm border border-primary-700/30"
          >
            <h2 class="text-2xl font-bold text-primary-400 mb-4">{{
              intermediateWorkshop.title
            }}</h2>

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
                  <p>{{ intermediateWorkshop.description }}</p>
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
                  <p>{{ intermediateWorkshop.fee }}</p>
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
                <p>{{ intermediateWorkshop.venue }}</p>
              </div>

              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <Icon
                    name="mdi:information-outline"
                    class="text-primary-400"
                    size="24px"
                  />
                  <p class="font-medium">Workshop Size:</p>
                </div>
                <p>Limited to 15 participants per workshop for optimal hands-on experience</p>
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

          <!-- Workshop Schedule -->
          <div
            class="bg-primary-800/30 rounded-lg overflow-hidden mb-8 border border-primary-700/30"
          >
            <div class="p-6">
              <h3 class="text-xl font-bold text-primary-400 mb-4">Workshop Schedule</h3>
              <p class="text-gray-300 mb-4"
                >This is the general schedule we follow for our intermediate workshops. Exact dates
                and times will be shared once we have enough registrations.</p
              >
            </div>

            <div class="divide-y divide-primary-700/30">
              <div
                v-for="(item, index) in intermediateWorkshop.schedule"
                :key="`schedule-${index}`"
                class="p-4 hover:bg-primary-700/20 transition-colors"
              >
                <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div class="md:w-1/3">
                    <h4 class="font-medium text-primary-300">{{ item.activity }}</h4>
                    <div class="text-sm text-gray-400">{{ item.duration }}</div>
                  </div>
                  <div class="md:w-2/3 text-sm text-gray-300">
                    <ul>
                      <li
                        v-for="(desc, i) in item.description"
                        :key="`desc-${i}`"
                        >{{ desc }}</li
                      >
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PrimeTabPanel>

        <PrimeTabPanel
          value="whatToBring"
          :pt="{
            root: 'animate-fadeIn',
          }"
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
        </PrimeTabPanel>

        <PrimeTabPanel
          value="preWorkshop"
          :pt="{
            root: 'animate-fadeIn',
          }"
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
        </PrimeTabPanel>

        <PrimeTabPanel
          value="equipment"
          :pt="{
            root: 'animate-fadeIn',
          }"
        >
          <div
            class="bg-primary-800/30 rounded-lg overflow-hidden mb-8 backdrop-blur-sm border border-primary-700/30"
          >
            <div class="md:flex">
              <div class="md:w-1/3 p-6 flex items-center justify-center bg-primary-900/50">
                <img
                  :src="telescopeInfo.image"
                  :alt="telescopeInfo.name"
                  class="max-w-full h-auto max-h-80"
                  @error="$event.target.src = '/api/placeholder/350/350'"
                />
              </div>
              <div class="md:w-2/3 p-6">
                <h2 class="text-2xl font-bold text-primary-400 mb-2">{{ telescopeInfo.name }}</h2>
                <div class="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-300 mb-4">
                  <div>Item #: {{ telescopeInfo.itemNumber }}</div>
                  <div>Warranty: {{ telescopeInfo.warranty }}</div>
                </div>

                <div class="space-y-4">
                  <div
                    v-for="(paragraph, index) in telescopeInfo.description"
                    :key="index"
                    class="text-gray-300"
                  >
                    {{ paragraph }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <!-- Main Features -->
            <div
              class="bg-primary-800/30 rounded-lg p-6 backdrop-blur-sm border border-primary-700/30"
            >
              <div class="flex items-center gap-2 mb-4">
                <Icon
                  name="mdi:star"
                  class="text-primary-400"
                  size="24px"
                />
                <h3 class="text-xl font-bold text-primary-400">Main Features</h3>
              </div>

              <ul class="space-y-4">
                <li
                  v-for="(feature, index) in telescopeInfo.mainFeatures"
                  :key="`feature-${index}`"
                  class="flex items-start gap-3"
                >
                  <Icon
                    name="mdi:check-circle-outline"
                    class="text-primary-400 mt-1 flex-shrink-0"
                    size="20px"
                  />
                  <span class="text-gray-300">{{ feature }}</span>
                </li>
              </ul>
            </div>

            <!-- What You Can See -->
            <div
              class="bg-primary-800/30 rounded-lg p-6 backdrop-blur-sm border border-primary-700/30"
            >
              <div class="flex items-center gap-2 mb-4">
                <Icon
                  name="mdi:telescope"
                  class="text-primary-400"
                  size="24px"
                />
                <h3 class="text-xl font-bold text-primary-400">What You'll See</h3>
              </div>

              <ul class="space-y-4">
                <li
                  v-for="(capability, index) in telescopeInfo.keyCapabilities"
                  :key="`capability-${index}`"
                  class="flex items-start gap-3"
                >
                  <Icon
                    name="mdi:eye-outline"
                    class="text-primary-400 mt-1 flex-shrink-0"
                    size="20px"
                  />
                  <span class="text-gray-300">{{ capability }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="bg-primary-700/30 rounded-lg p-6 mb-8 border border-primary-600/50">
            <div class="flex items-center gap-3 mb-2">
              <Icon
                name="mdi:information-outline"
                class="text-primary-400"
                size="24px"
              />
              <h3 class="text-lg font-medium text-primary-300">Workshop Experience</h3>
            </div>
            <p class="text-gray-300">
              During our workshop, you'll get hands-on experience with the Celestron NexStar 6SE
              telescope. Our experienced instructors will guide you through setup, alignment, and
              operation. You'll learn how to locate celestial objects using the GoTo system and get
              tips for making the most of your viewing sessions.
            </p>
          </div>
        </PrimeTabPanel>
      </PrimeTabs>

      <!-- Register CTA -->
      <div
        class="bg-primary-800/30 rounded-lg p-6 my-12 backdrop-blur-sm border border-primary-700/30"
      >
        <div class="flex flex-col items-center text-center">
          <h2 class="text-2xl font-bold text-primary-400 mb-3">Ready to Explore the Universe?</h2>
          <p class="text-gray-300 mb-6 max-w-2xl"
            >Register your interest today! We'll contact you with workshop dates once we have enough
            participants (15 per session).</p
          >
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
