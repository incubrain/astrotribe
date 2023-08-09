<template>
  <div
    class="flex flex-col items-center relative overflow-hidden justify-between w-full p-4 xl:p-8 rounded-md shadow-md foreground backdrop-filter backdrop-blur-lg hadow-xl ring-1 ring-gray-900/5 dark:ring-[#2F1352]/50 transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-2xl"
  >
    <div class="absolute w-full h-full animate-pulse">
      <SvgStars
        class="bottom-46 left-12"
        :size="15"
        svg-color="#303030"
      />
      <SvgStars
        class="bottom-22 left-36"
        :size="8"
        svg-color="#303030"
      />
      <SvgStars
        class="top-28 right-14"
        :size="12"
        svg-color="#303030"
      />
      <SvgStars
        class="bottom-12 left-44"
        :size="20"
        svg-color="#303030"
      />
      <SvgStars
        class="top-52 left-12"
        :size="14"
        svg-color="#303030"
      />
    </div>
    <!-- SemiCircle -->
    <div
      class="absolute bottom-2 left-0 right-0 -z-10 transform w-56 h-28 mx-auto opacity-10 blur-[4px] bg-black rounded-t-full"
    />

    <div class="relative px-10 flex items-start justify-center pb-4">
      <div class="w-20 overflow-hidden border rounded-full md:w-24">
        <NuxtImg
          :src="member.avatar"
          loading="lazy"
          :alt="member.name"
        />
      </div>
    </div>
    <div class="flex flex-col items-center justify-center space-y-5">
      <p
        class="text-black dark:text-gray-300 text-base font-semibold leading-none text-center rounded-sm"
      >
        {{ member.name }}
      </p>
      <p class="text-sm font-semibold leading-none text-center dark:text-gray-400">
        {{ member.position.title }}
      </p>
      <div class="space-y-2 pt-12 z-10">
        <SocialBlock
          :socials="member.socials"
          :has-title="false"
          class="flex items-center justify-center space-x-2"
        />
        <NuxtLink
          :to="`/team/${member.name.toLowerCase().replaceAll(' ', '-')}`"
          class="flex flex-col items-center justify-center font-semibold"
        >
          <UButton
            variant="outline"
            color="black"
          >
            View Profile
          </UButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TeamMember } from '@/types/team'

defineProps({
  member: {
    type: Object as PropType<TeamMember>,
    required: true
  }
})
</script>

<style scoped></style>
