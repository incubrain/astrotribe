<!--
  Cathall route for rendering 404s
  https://nuxt.com/docs/guide/directory-structure/pages/#catch-all-route
-->

<template>
  <div class="h-[100vh]">
    <div class="flex flex-col items-center justify-center w-full h-full">
      <h1 class="text-[10vw] text-white mb-2 leading-[9vw]">
        404
      </h1>
      <h3 class="text-[4vh] text-white mt-0">
        WE'RE LOST
      </h3>
      <NuxtLink
        :to="{ name: 'Home' }"
        class="px-8 pt-4 whitespace-nowrap"
      >
        GO BACK HOME
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
