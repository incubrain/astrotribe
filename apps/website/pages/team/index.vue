<script setup lang="ts">
import teamMembers from '../../data/home/team.json'

definePageMeta({
  name: 'Team',
})

</script>

<template>
  <div>
    <!-- Hero section with improved image -->
    <IBImageHero
      :img="{
        src: 'images/team/cartoon_of_adult_astronomers_with_a_telescope.jpg',
        alt: 'AstronEra team page hero image, cartoon of astronomers looking at the stars',
      }"
      :title="{
        main: 'The AstronEra Team',
      }"
      fit="cover"
      object-position="object-top"
    >
      <!-- Future improvement: Implement interactive hero with animated stars -->
    </IBImageHero>

    <div class="wrapper flex flex-col gap-12 mx-auto lg:gap-24 lg:py-24">
      <!-- Team member cards with connection lines -->
      <div class="relative">
        <!-- Connection lines component -->
        <TeamConnectionLines :member-count="teamMembers.length" />

        <!-- Grid of team member cards -->
        <div
          class="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3 md:gap-8 lg:gap-12 pb-6"
        >
          <LazyTeamCard
            v-for="(member, index) in teamMembers"
            :key="`astronera-team-member-${member.id}`"
            :member="member"
            :index="index"
          />
        </div>
      </div>

      <!-- Team Stats -->
      <TeamStats />

      <!-- Team Values -->
      <TeamValues />

      <!-- Join Team -->
      <ClientOnly>
        <TeamJoinUs />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
/* Add custom styles for page transitions if needed */
</style>
