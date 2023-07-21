<template>
  <div>
    <div class="relative flex items-center justify-center">
      <NuxtImg
        class="w-full object-cover object-bottom h-[540px]"
        src="images/team/cartoon_of_adult_astronomers_with_a_telescope.jpg"
        alt="AstronEra team page hero image, cartoon of astronomers looking at the stars"
      />
      <h2 class="absolute z-10 text-3xl font-bold leading-7 text-white lg:text-5xl lg:leading-9 bg-white/30 py-2 px-2 rounded-sm">
        The AstronEra Team
      </h2>
      <div class="absolute top-0 left-0 w-full h-full bg-black/25" />
    </div>
    <div class="flex flex-col max-w-6xl gap-12 p-6 mx-auto lg:gap-24 lg:py-24">
      <div class="flex flex-col space-y-4">
        <p class="max-w-sm text-base leading-normal">
          AstronEra thrives thanks to its dedicated team. Passionate about astronomy and education?
        </p>
        <p class="max-w-md text-base leading-normal font-bold">
          Contact Shweta or Mac to join us.
        </p>
      </div>
      <div
        class="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4 md:gap-8 lg:gap-12"
      >
        <TeamCard v-for="member in teamMembers" :key="member.id" :member="member" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import teamMembers from '@/data/home/team.json'

definePageMeta({
  name: 'Team',
  layout: 'home'
})
</script>
