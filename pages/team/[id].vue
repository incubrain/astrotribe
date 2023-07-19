<template>
  <div class="bg-[#d9dce0] dark:bg-[#444444] w-full h-full text-white">
    <div
      :key="user.id"
    >
      <NuxtImg
        :src="user.avatar"
        :alt="user.name"
        class="absolute right-24 top-12 rounded-full shadow-2xl bg-white border-neutral-300 border h-28 w-28"
      />
      <p class="absolute left-12 top-10 text-[35px] font-bold text-left text-[#393939] dark:text-white/80">
        {{ user.name }}
      </p>
      <p class="absolute left-12 top-24 text-[20px] text-left text-[#393939] dark:text-white/80">
        • {{ user.position.title }} • Joined: {{ user.position.joining }}
      </p>
      <p
        class="flex flex-row absolute left-12 top-40 text-[24px] font-semibold text-left text-[#393939] dark:text-white/80"
      >
        About
      </p>
      <p class="flex flex-row w-30 absolute left-12 right-12 top-52 text-[18px] text-left text-[#393939] dark:text-white/80">
        {{ user.bio }}
      </p>
      <p
        class="absolute left-12  text-[24px] top-[380px] font-semibold text-left text-[#393939] dark:text-white/80"
      >
        Achievements
      </p>
      <p class="absolute left-12 top-[430px] text-[18px] text-left text-[#393939] dark:text-white/80">
        <ul>
          <li>• {{ user.achievements[0].title }}</li>
          <li>• {{ user.achievements[1].title }}</li>
        </ul>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import team from '@/data/home/team.json'
const { id } = useRoute().params
const user = team.find((user) => user.id === Number(id))
</script>

<style scoped></style>
