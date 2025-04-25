<script setup lang="ts">
import teamMembers from '../../data/home/team.json'

definePageMeta({
  name: 'Team',
})

useHead({
  title: 'Our Team - AstronEra',
  meta: [
    {
      name: 'description',
      content:
        'Meet the passionate team behind AstronEra dedicated to making astronomy accessible to everyone.',
    },
  ],
})

// Make sure team data exists to prevent errors
const teamData = computed(() => {
  return Array.isArray(teamMembers) && teamMembers.length > 0
    ? teamMembers
    : [
        {
          id: 1,
          given_name: 'Shweta',
          name: 'Shweta Kulkarni',
          position: { title: 'Director' },
          avatar: '/images/team/shweta-kulkarni.jpg',
          socials: {
            linkedin: 'https://www.linkedin.com/in/ShwetaAstronEra/',
            twitter: 'https://twitter.com',
          },
        },
      ]
})

// Setup for view transitions (if browser supports it)
onMounted(() => {
  if (typeof document !== 'undefined' && 'startViewTransition' in document) {
    document.documentElement.classList.add('view-transition-support')
  }
})
</script>

<template>
  <div>
    <!-- Hero section with space-themed background -->
    <div class="relative flex items-center justify-center">
      <NuxtImg
        src="team-hero2.png"
        alt="AstronEra team page hero image"
        width="1920"
        height="1080"
        class="w-full object-cover object-top h-screen"
      />
      <div class="absolute z-10 flex flex-col items-center justify-center gap-8 px-4 text-white">
        <div class="flex flex-col gap-4">
          <h2 class="rounded-md bg-black/30 px-4 py-1 text-3xl font-bold shadow-xl text-center">
            The AstronEra Team
          </h2>
          <p
            class="inline-block w-auto max-w-2xl rounded-sm px-4 pb-4 text-xl font-semibold text-center"
          >
            Passionate educators, astronomers, and technologists dedicated to sharing the wonders of
            the cosmos
          </p>
        </div>
      </div>
      <div class="absolute left-0 top-0 h-full w-full bg-black/50" />
    </div>

    <!-- Team Stats -->
    <TeamStats />

    <div class="wrapper flex flex-col gap-12 mx-auto py-12 lg:gap-24 lg:py-24">
      <!-- Team member cards with connection lines -->
      <div class="relative">
        <!-- Section title -->
        <div class="text-center mb-12">
          <h2
            v-motion
            class="text-3xl md:text-4xl font-bold mb-4 text-white"
            :initial="{ opacity: 0, y: 20 }"
            :visible="{
              opacity: 1,
              y: 0,
              transition: { type: 'spring', stiffness: 300, damping: 25 },
            }"
          >
            Meet Our Team
          </h2>
          <p
            v-motion
            class="text-lg text-primary-200 max-w-2xl mx-auto"
            :initial="{ opacity: 0, y: 20 }"
            :visible="{
              opacity: 1,
              y: 0,
              transition: { type: 'spring', stiffness: 300, damping: 25, delay: 0.1 },
            }"
          >
            The brilliant minds working together to bring the universe closer to you
          </p>
        </div>

        <!-- Connection lines component -->
        <TeamConnectionLine :member-count="teamData.length" />

        <!-- Grid of team member cards -->
        <div
          class="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 md:gap-8 lg:gap-12 pb-6"
        >
          <TeamCard
            v-for="(member, index) in teamData"
            :key="`astronera-team-member-${member.id}`"
            :member="member"
            :index="index"
          />
        </div>
      </div>

      <!-- Team Values -->
      <TeamValues />

      <!-- Join Team -->
      <TeamJoinUs />
    </div>
  </div>
</template>

<style scoped>
/* View Transitions styles */
::view-transition-old(team-avatar),
::view-transition-new(team-avatar) {
  mix-blend-mode: normal;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

:root.view-transition-support .team-avatar {
  view-transition-name: team-avatar;
}
</style>
