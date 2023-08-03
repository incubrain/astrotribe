<template>
  <div class="relative">
    <ImageHero
      :img="{
        src: 'images/team/cartoon_of_adult_astronomers_with_a_telescope.jpg',
        alt: 'AstronEra team page hero image, cartoon of astronomers looking at the stars'
      }"
      :title="user?.name"
    >
      <p class="text-xl font-semibold bg-white/30 px-2 rounded-sm">
        {{ user.position.title }}
      </p>
    </ImageHero>
    <UButton class="hidden fixed lg:flex top-20 left-4" icon="i-mdi-keyboard-backspace" @click="$router.back()">
      Back
    </UButton>
    <div class="container flex flex-wrap items-start justify-center pb-6 lg:pb-12">
      <div
        class="foreground rounded shadow-lg w-full transform duration-200 easy-in-out backdrop-filter backdrop-blur-lg"
      >
        <div class="flex justify-start items-center -mt-16 lg:-mt-24">
          <NuxtImg
            class="w-32 h-32 lg:w-48 lg:h-48 rounded-full p-2 foreground"
            :src="user.avatar"
            :alt="user.name"
          />
        </div>
        <div class="p-4 xl:p-8 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div class="flex flex-col gap-3">
            <h4 class="mb-4 text-xl font-semibold">About</h4>
            <p
              v-for="(section, i) in user.bio"
              :key="i"
              :class="i === 0 ? 'font-semibold text-base' : 'text-sm'"
            >
              {{ section }}
            </p>
          </div>
          <div v-if="user.achievements.length > 0">
            <h4 class="mb-4 text-xl font-semibold">Achievements</h4>
            <div
              v-for="(achievement, i) in user?.achievements"
              :key="i"
              class="space-y-2"
            >
              <p class="font-semibold text-base">{{ achievement.title }}</p>
              <p class="text-sm">{{ achievement.body }}</p>
            </div>
          </div>
          <div>
            <h4 class="mb-4 text-xl font-semibold">Connect with {{ user.name }}</h4>
            <SocialBlock
              :socials="user.socials"
              :has-title="false"
              position="justify-start"
            />
          </div>
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
