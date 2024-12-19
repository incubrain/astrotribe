<script setup lang="ts">
import type { TeamMemberType } from '@/types/team'

defineProps({
  member: {
    type: Object as PropType<TeamMemberType>,
    required: true,
  },
})
</script>

<template>
  <LandingGlass
    hover-effect="glow"
    glow-color="purple"
    gradient="mixed"
    intensity="low"
    interactive
    isolate-content
  >
    <div class="absolute h-full w-full animate-pulse">
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
        class="right-14 top-24"
        :size="12"
        svg-color="#303030"
      />
      <SvgStars
        class="bottom-12 left-44"
        :size="20"
        svg-color="#303030"
      />
      <SvgStars
        class="left-12 top-52"
        :size="14"
        svg-color="#303030"
      />
    </div>

    <div class="relative flex items-start justify-center px-10 pb-4">
      <div class="w-20 overflow-hidden rounded-full border md:w-24">
        <IBImage
          :img="{
            src: member.avatar,
            alt: member.name,
            loading: 'lazy',
            width: '100',
            height: '100',
          }"
        />
      </div>
    </div>
    <div class="flex flex-col items-center justify-center space-y-3">
      <p class="rounded-sm text-center text-base font-semibold leading-none">
        {{ member.name }}
      </p>
      <p class="text-center text-sm font-semibold leading-none">
        {{ member.position.title }}
      </p>
      <div class="z-10 space-y-3 pt-12">
        <AppSocialBlock
          :socials="member.socials"
          :has-title="false"
          class="relative flex items-center justify-center space-x-2"
        />
        <div>
          <NuxtLink :to="`/team/${member.name.toLowerCase().replaceAll(' ', '-')}`">
            <PrimeButton> View Profile </PrimeButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </LandingGlass>
</template>

<style scoped></style>
