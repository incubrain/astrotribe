<template>
  <div class="flex flex-col gap-4 xl:gap-8">
    <div class="flex flex-col gap-4 xl:gap-8">
      <h3 class="text-2xl font-bold leading-7">
        AstronEra Team
      </h3>
      <div class="space-y-3">
        <p class="max-w-sm text-base leading-normal">
          AstronEra thrives thanks to its dedicated team. Passionate about astronomy and education?
        </p>
        <p class="max-w-md text-base leading-normal">
          <strong> Contact Shweta or Drew to join us.</strong> <br />
          Together, we'll explore the universe!
        </p>
      </div>
    </div>
    <div
      class="grid w-full grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-8"
    >
      <div
        v-for="member in team"
        :key="member.id"
        class="flex flex-row items-center gap-4 w-full p-4 space-y-4 rounded-md shadow-md foreground"
      >
        <div class="w-14 overflow-hidden border rounded-full">
          <NuxtImg
            :src="member.avatar"
            loading="lazy"
            :alt="member.name"
          />
        </div>
        <div class="flex flex-col justify-center gap-2">
          <p class="text-base font-semibold leading-none">
            {{ member.name }}
          </p>
          <p class="text-sm leading-none">
            {{ member.position }}
          </p>
          <div class="flex xl:flex-col gap-2">
            <SocialBlock
              :socials="member.socials"
              :has-title="false"
              class="flex items-center justify-center space-x-2"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import team from '@/data/home/team.json'
</script>

<style scoped></style>
