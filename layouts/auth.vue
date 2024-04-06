<script setup lang="ts">
// !todo:consider - add a delay to function execution, fade out the auth cards so the bg image is fully visible for a few seconds, then execute
// !todo:med - add transitions to the auth cards
// !todo:high - add subtitle prompt to all auth cards
// !todo:med - add "or" between email login and social login
</script>
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

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
