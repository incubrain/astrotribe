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
            class="absolute w-full h-full object-cover top-0 left-0"
            :src="feature.bgImg"
            height="366px"
            width="290px"
            quality="70"
            format="webp"
            :alt="`${feature.title} background image`"
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
import features from '~/public/data/features.json'
</script>

<style scoped></style>
