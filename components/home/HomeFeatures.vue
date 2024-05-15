<template>
  <div class="py-[40px] md:py-[80px] lg:py-[160px] mx-auto">
    <div class="mx-auto">
      <HomeHeading
        class="pb-16 md:pb-24"
        heading="What is AstroTribe?"
        subheading="Built By Astronomers For Astronomers"
      />
      <div
        class="grid items-start justify-center grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-8"
      >
        <div
          v-for="feature in features"
          :key="feature.id"
          class="relative h-full p-8 mx-auto overflow-hidden rounded-lg shadow-md"
        >
          <BaseImage
            :img="{
              src: feature.bgImg,
              alt: `${feature.title} background image`,
              height: '366px',
              width: '290px',
              quality: '70',
              format: 'webp'
            }"
            class="absolute top-0 left-0 object-cover w-full h-full"
          />
          <div class="absolute top-0 left-0 w-full h-full bg-gray-900/50 dark:bg-zinc-900/80" />
          <div class="relative z-50 text-light">
            <Icon
              :name="feature.icon"
              class="w-[26px] h-[26px]"
            />
            <div class="pt-4">
              <h1 class="text-lg font-semibold tracking-wider lg:text-2xl">
                {{ feature.title }}
              </h1>
              <p class="w-11/12 mt-2 text-sm leading-normal tracking-wider">
                {{ feature.description }}
              </p>
              <p
                v-if="!feature.isAvailable"
                class="pt-2 text-xs font-semibold text-success-600 dark:text-success-test"
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
import features from '@/data/home/features.json'

// must list out icons for them to work, for some reason they don't load directly from JSON (nuxthq/ui bug)
const icons = [
  'material-symbols:group-add',
  'material-symbols:calendar-month',
  'material-symbols:android-messages-outline',
  'mdi:briefcase',
  'mdi:telescope',
  'material-symbols:circle-notifications'
]
</script>

<style scoped></style>
