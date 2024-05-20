<script setup lang="ts">
import type { TeamMemberType } from '@/types/team'

defineProps({
  member: {
    type: Object as PropType<TeamMemberType>,
    required: true
  }
})
</script>

<template>
  <div
    class="flex flex-col items-center relative justify-between w-full p-4 xl:p-8 rounded-md shadow-md background backdrop-filter backdrop-blur-lg hadow-xl border border-color transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-2xl"
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
        class="top-24 right-14"
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

    <div class="relative px-10 flex items-start justify-center pb-4">
      <div class="w-20 overflow-hidden border rounded-full md:w-24">
        <BaseImage
          :img="{
            src: member.avatar,
            alt: member.name,
            loading: 'lazy',
            width: '100',
            height: '100'
          }"
        />
      </div>
    </div>
    <div class="flex flex-col items-center justify-center space-y-3">
      <p class="text-base font-semibold leading-none text-center rounded-sm">
        {{ member.name }}
      </p>
      <p class="text-sm font-semibold leading-none text-center">
        {{ member.position.title }}
      </p>
      <div class="space-y-3 pt-12 z-10">
        <SocialBlock
          :socials="member.socials"
          :has-title="false"
          class="flex items-center justify-center space-x-2"
        />
        <div>
          <NuxtLink :to="`/team/${member.name.toLowerCase().replaceAll(' ', '-')}`">
            <PrimeButton> View Profile </PrimeButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
