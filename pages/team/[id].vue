<template>
  <div class="bg-[#cccccc] dark:bg-[#18181B] flex flex-wrap items-start justify-center">
    <div
      class="container max-w-3xl bg-[#e4e4e4]/50 dark:bg-[#1f1e1e] rounded shadow-lg transform duration-200 easy-in-out m-12 backdrop-filter backdrop-blur-lg"
      :key="user.id"
    >
      <div class="flex justify-start px-5 -mt-12 mb-5">
        <span clspanss="block relative h-32 w-32">
          <NuxtImg
            class="w-32 h-32 rounded-full mt-2 hover:shadow-xl"
            :src="user.avatar"
            :alt="user.name"
          />
        </span>
      </div>
      <div class="px-7 mb-8">
        <h2 class="text-3xl font-bold dark:text-gray-300">{{ user.name }}</h2>
        <p class="mt-2 text-xl font-semibold text-gray-700 dark:text-gray-500"
          >• {{ user.position.title }} •</p
        >
        <p class="text-md font-semibold text-gray-500 dark:text-gray-500"
          >Since {{ user?.position.joining }}</p
        >

        <h4 class="mt-4 text-lg font-semibold">About</h4>
        <p class="mt-2 text-md dark:text-gray-300">{{ user.bio }}</p>

        <h4 class="mt-4 text-lg font-semibold">Achievements</h4>
        <p class="mt-2 text-md dark:text-gray-300">• {{ user.achievements[0].title }}</p>
        <p class="text-md dark:text-gray-300">• {{ user.achievements[1].title }}</p>

        <h4 class="mt-4 text-lg font-semibold">Connect with {{ user.name }}</h4>
        <SocialBlock
          :socials="user.socials"
          :has-title="false"
          class="flex items-center justify-center space-x-2"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import team from '@/data/home/team.json'
const { id } = useRoute().params
const user = team.find((user) => user.id === Number(id))
</script>

<style scoped></style>
