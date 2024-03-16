<template>
  <div>
    <ImageHero
      :img="{
        src: 'images/team/cartoon_of_adult_astronomers_with_a_telescope.jpg',
        alt: 'AstronEra team page hero image, cartoon of astronomers looking at the stars'
      }"
      :title="{
        main: 'The AstronEra Team'
      }"
      fit="cover"
      object-position="object-top"
    />

    <div class="flex flex-col max-w-6xl gap-12 padded-x mx-auto lg:gap-24 lg:py-24 wrapper">
      <div class="flex flex-col space-y-4">
        <p class="max-w-sm text-base leading-normal">
          AstronEra thrives thanks to its dedicated team. Passionate about astronomy and education?
        </p>
        <p class="max-w-md text-base leading-normal font-bold">
          Contact Shweta or Mac to join us.
        </p>
      </div>
      <div
        class="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4 md:gap-8 lg:gap-12 pb-6"
      >
        <LazyTeamCard
          v-for="member in teamMembers"
          :key="`astronera-team-member-${member.id}`"
          :member="member"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import teamMembers from '@/data/home/team.json'

definePageMeta({
  name: 'Team'
})
</script>
