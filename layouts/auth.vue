<template>
  <div class="w-full p-8 min-h-screen flex justify-center items-center">
    <NavTop />
    <div class="relative z-20">
      <slot />
    </div>
    <div class="h-full flex absolute top-0 left-0 w-full overflow-hidden">
      <div class="dark:bg-black/30 absolute w-full h-full left-0 top-0" />
      <NuxtImg
        src="/astron-era-hero.jpg"
        alt=""
        class="w-full object-cover object-center"
      />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
