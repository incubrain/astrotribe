<template>
  <div class="py-[40px] md:py-[80px] lg:py-[160px] mx-auto dark:bg-success-test">
    <div class="mx-auto">
      <div class="mb-4 text-left pl-8">
        <h1 class="text-base font-bold text-primary-700 dark:text-primary-600 tracking-tight">
          Why AstroTribe?
        </h1>
        <h2 class="text-3xl font-semibold mt-5 max-w-[50%] leading-normal">
          Keep your Life Simple, Safe and Wealthy
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-top">
        <div
          v-for="feature in features"
          :key="feature.id"
          class="mx-auto m-4 rounded-lg shadow-md p-8 relative overflow-hidden h-full"
        >
          <NuxtImg
            class="absolute w-full h-full top-0 left-0"
            :src="feature.bgImg"
            height="366px"
            width="290px"
          />
          <div class="absolute w-full h-full top-0 left-0 bg-gray-900/50 dark:bg-zinc-900/80" />
          <div class="relative z-50 text-light">
            <UIcon
              :name="feature.icon"
              class="w-[26px] h-[26px]"
            ></UIcon>
            <div class="pt-4">
              <h1 class="text-lg lg:text-2xl font-semibold tracking-wider">
                {{ feature.title }}
              </h1>
              <p class="mt-2 tracking-wider leading-normal text-sm w-11/12">
                {{ feature.description }}
              </p>
              <p
                v-if="!feature.isAvailable"
                class="text-xs pt-2 font-semibold text-success-600 dark:text-success-test"
              >
                Coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    id: 1,
    title: 'Universe of Connections',
    description:
      'Connect and share insights with astronomers and enthusiasts in our interactive community. Make your passion for the cosmos a shared journey.',
    icon: 'i-material-symbols-group-add',
    bgImg: '/images/features/feat1.png',
    isAvailable: true
  },
  {
    id: 2,
    title: 'Local Astronomy Events',
    description:
      'Discover local astronomical happenings from stargazing sessions to professional conferences. Experience the cosmos in your neighborhood.',
    icon: 'i-material-symbols-calendar-month',
    bgImg: '/images/features/feat2.png',
    isAvailable: false
  },
  {
    id: 3,
    title: 'Join the Cosmic Conversation',
    description:
      'Share, discuss, and engage with the latest news and events in the astronomy world. Be a part of our dynamic community and enrich your cosmic journey',
    icon: 'i-material-symbols-calendar-month',
    bgImg: '/images/features/feat3.png',
    isAvailable: false
  },
  {
    id: 4,
    title: 'Start An Astronomy Career',
    description:
      'Explore our selection of online and offline educational resources. From online courses to local workshops, fuel your knowledge and passion for astronomy.',
    icon: 'i-mdi-briefcase',
    bgImg: '/images/features/feat4.png',
    isAvailable: false
  },
  {
    id: 5,
    title: 'Connect With AstroGuides',
    description:
      'Find expert AstroGuides to make your stargazing events more enlightening. Discover the universe under the guidance of seasoned astronomers',
    icon: 'i-mdi-telescope',
    bgImg: '/images/features/feat5.png',
    isAvailable: true
  },
  {
    id: 6,
    title: 'Celestial Event Alerts',
    description:
      'Never miss an astronomical spectacle with our timely push notifications. Stay ready for the next cosmic show',
    icon: 'i-material-symbols-circle-notifications',
    bgImg: '/images/features/feat6.png',
    isAvailable: false
  }
]
</script>

<style scoped></style>
