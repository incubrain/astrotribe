<script setup lang="ts">
onMounted(() => {
  document.documentElement.classList.add('dark')
})

// inside your layout file or main page <script setup>
useHead(
  {
    script: [
      {
        src: '/cdn-cgi/challenge-platform/scripts/jsd/main.js',
        crossorigin: 'anonymous',
        referrerpolicy: 'origin',
      },
    ],
  },
  { mode: 'client' },
)
</script>

<template>
  <div class="h-full w-full relative dark">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage class="dark" />
    </NuxtLayout>
  </div>
</template>

<style>
html {
  margin: 0;
  padding: 0;
}

#__nuxt {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
