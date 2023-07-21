<template>
  <div>
    <ImageHero
      :img="{
        src: 'images/team/cartoon_of_adult_astronomers_with_a_telescope.jpg',
        alt: 'AstronEra team page hero image, cartoon of astronomers looking at the stars'
      }"
      title="The AstronEra Team"
    >
      <p class="text-xl font-semibold bg-white/30 px-2 rounded-sm">
        {{ user.position.title }}
      </p>
    </ImageHero>
    <div class="container flex flex-wrap items-start justify-center pb-6 lg:pb-12">
      <div
        class="foreground rounded shadow-lg w-full transform duration-200 easy-in-out backdrop-filter backdrop-blur-lg"
        :key="user.id"
      >
        <div class="flex justify-start -mt-16 lg:-mt-24">
          <NuxtImg
            class="w-32 h-32 lg:w-48 lg:h-48 rounded-full p-2 foreground"
            :src="user.avatar"
            :alt="user.name"
          />
        </div>
        <div class="px-7 mb-8">
          <h4 class="mt-4 text-xl font-semibold">About</h4>
          <p class="mt-2 text-sm dark:text-gray-300">{{ user.bio }}</p>

          <h4 class="mt-4 text-xl font-semibold">Achievements</h4>
          <p class="mt-2 text-sm dark:text-gray-300">• {{ user.achievements[0].title }}</p>
          <p class="text-sm dark:text-gray-300">• {{ user.achievements[1].title }}</p>

          <h4 class="mt-4 text-xl font-semibold">Connect with {{ user.name }}</h4>
          <SocialBlock
            :socials="user.socials"
            :has-title="false"
            class="flex items-center justify-center space-x-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import team from '@/data/home/team.json'

const { name } = useRoute().params
const user = team.find((user) => user.name.toLowerCase().replaceAll(' ', '-') === name)

definePageMeta({
  name: 'TeamIndividual',
  layout: 'home'
})
</script>

<style scoped></style>
