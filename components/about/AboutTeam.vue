<template>
  <div class="flex flex-col gap-12">
    <div class="flex flex-col space-y-4">
      <h1 class="text-3xl font-extrabold leading-8 xl:text-4xl xl:leading-9">
        AstronEra Team
      </h1>
      <p class="max-w-sm text-base leading-normal">
        AstronEra thrives thanks to its dedicated team. Passionate about astronomy and education?
      </p>
      <p class="max-w-md text-base leading-normal">
        <strong> Contact Shweta or Mac to join us.</strong> <br />
        Together, we'll explore the universe!
      </p>
    </div>
    <div
      class="grid w-full grid-cols-1 gap-6 mt-6 md:grid-cols-3 lg:grid-cols-4 md:gap-8 lg:gap-12"
    >
      <div
        v-for="member in team"
        :key="member.id"
        class="flex flex-col items-center justify-between w-full p-4 space-y-4 rounded-md shadow-md foreground"
      >
        <div class="w-20 overflow-hidden border rounded-full md:w-24">
          <NuxtImg
            :src="member.avatar"
            loading="lazy"
            :alt="member.name"
          />
        </div>
        <div class="flex flex-col items-center justify-center space-y-2">
          <p class="text-base font-semibold leading-none text-center">
            {{ member.name }}
          </p>
          <p class="text-sm leading-none text-center">
            {{ member.position }}
          </p>
          <SocialBlock
            :socials="member.socials"
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
</script>

<style scoped></style>
