<script setup lang="ts">
// !todo:consider:2 - add a delay to function execution, fade out the auth cards so the bg image is fully visible for a few seconds, then execute
// !todo:low:1 - add transitions to the auth cards
// !todo:high:1 - add subtitle prompt to all auth cards
// !todo:med:1 - add "or" between email login and social login
// !todo:med:2 - handle session expired, redirect to login with explanation
</script>
<template>
  <div class="w-full px-8 min-h-screen flex justify-center items-center">
    <div class="relative z-20 p-4 min-w-[340px] w-full max-w-[480px]">
      <slot />
    </div>
    <div class="h-full flex absolute top-0 left-0 w-full overflow-hidden">
      <div class="bg-black/40 absolute w-full h-full left-0 top-0" />
        <BaseImage
          :img="{
            src: '/astron-era-hero.jpg',
            alt: ''
          }"
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
