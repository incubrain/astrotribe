<template>
  <div class="mx-auto py-[40px] md:py-[80px] lg:py-[160px]">
    <div class="mx-auto">
      <HomeHeading
        class="pb-16 md:pb-24"
        heading="What is AstroTribe?"
        subheading="Built By Astronomers For Astronomers"
      />
      <div
        class="grid grid-cols-1 items-start justify-center gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-3"
      >
        <div
          v-for="feature in features"
          :key="feature.id"
          class="relative mx-auto h-full overflow-hidden rounded-lg p-8 shadow-md"
        >
          <IBImage
            :img="{
              src: feature.bgImg,
              alt: `${feature.title} background image`,
              height: '366px',
              width: '290px',
              quality: '70',
              format: 'webp',
            }"
            class="absolute left-0 top-0 h-full w-full object-cover"
          />
          <div class="absolute left-0 top-0 h-full w-full bg-gray-900/50 dark:bg-zinc-900/80" />
          <div class="text-light relative z-50">
            <Icon
              :name="feature.icon"
              size="28px"
            />
            <div class="pt-4">
              <h1 class="text-lg font-semibold tracking-wider lg:text-2xl">
                {{ feature.title }}
              </h1>
              <p class="mt-2 w-11/12 text-sm leading-normal tracking-wider">
                {{ feature.description }}
              </p>
              <p
                v-if="!feature.isAvailable"
                class="text-success-600 dark:text-success-test pt-2 text-xs font-semibold"
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
  'material-symbols:circle-notifications',
]
</script>

<style scoped></style>
