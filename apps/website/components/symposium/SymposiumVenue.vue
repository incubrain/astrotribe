<script setup lang="ts">
// 1. Imports

// 2. Component Options
defineOptions({
  name: 'SymposiumVenue',
})

// 4. Component state
const venues = [
  {
    icon: 'mdi:video-box',
    title: 'Zoom*',
    button: 'Zoom',
    website: 'https://www.zoom.com/',
    about:
      '<b><u>*For Invitees Only</u></b><br/>The meeting ID and password will be shared <b>with the invitees</b>',
    color: 'blue',
    features: [
      'Secure, password-protected meeting',
      'Interactive Q&A with speakers',
      'Private networking opportunities',
      'Direct access to presentations',
    ],
  },
  {
    icon: 'mdi:youtube',
    title: 'YouTube',
    about: 'The event will be broadcasted live on our website as well as on our YouTube channel',
    button: 'YouTube',
    website: 'https://www.youtube.com/live/_Du8pF2pru4?si=f1dlgDd6imcA1Duq',
    color: 'red',
    features: [
      'Public access for all interested viewers',
      'Live chat for community engagement',
      'Replay available after the event',
      'Easily share with colleagues',
    ],
  },
]
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-primary-400 mb-6">Venue</h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="(venue, index) in venues"
        :key="index"
        class="bg-primary-800/30 rounded-lg overflow-hidden backdrop-blur-sm border border-primary-700/30 flex flex-col"
      >
        <!-- Venue Header -->
        <div class="bg-primary-900/60 p-5">
          <div class="flex items-center gap-3">
            <div :class="`bg-${venue.color}-900/50 p-3 rounded-full`">
              <Icon
                :name="venue.icon"
                :class="`text-${venue.color}-500`"
                size="24px"
              />
            </div>
            <h3 class="text-xl font-bold text-white">{{ venue.title }}</h3>
          </div>
        </div>

        <!-- Venue Details -->
        <div class="p-5 flex-grow">
          <div
            class="mb-4"
            v-html="venue.about"
          ></div>

          <div class="mb-5">
            <h4 class="text-sm uppercase tracking-wider text-primary-400 mb-2 font-medium"
              >Features</h4
            >
            <ul class="space-y-2">
              <li
                v-for="(feature, fIndex) in venue.features"
                :key="fIndex"
                class="flex items-start gap-2 text-sm"
              >
                <Icon
                  name="mdi:check"
                  class="text-primary-400 mt-0.5"
                  size="16px"
                />
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Venue Button -->
        <div class="p-5 pt-0">
          <a
            :href="venue.website"
            target="_blank"
            class="inline-block w-full"
          >
            <PrimeButton
              class="w-full justify-center"
              :class="`bg-${venue.color}-600 hover:bg-${venue.color}-500`"
            >
              <Icon
                :name="venue.icon"
                class="mr-2"
              />
              {{ venue.button }}
            </PrimeButton>
          </a>
        </div>
      </div>
    </div>

    <!-- Additional Information -->
    <div
      class="mt-6 bg-primary-800/30 rounded-lg p-5 backdrop-blur-sm border border-primary-700/30"
    >
      <div class="flex items-center gap-3 mb-3">
        <Icon
          name="mdi:information-outline"
          class="text-primary-400"
          size="24px"
        />
        <h3 class="text-lg font-semibold text-primary-300">Important Information</h3>
      </div>
      <p class="text-sm">
        This is a virtual symposium accessible worldwide. The event will be conducted in English
        with presentations from international dark sky experts. We encourage participants to join
        via Zoom (by invitation) for interactive engagement, or watch the YouTube livestream for
        general access.
      </p>
    </div>
  </div>
</template>
