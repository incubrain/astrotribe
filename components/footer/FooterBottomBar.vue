<template>
  <div class="py-5 background border-t border-color">
    <h1 class="text-base text-center">
      ©2018 - {{ currentYear }} AstronEra. All right reserved - Made with ❤️ by <a href="https://www.incubrain.org/" target="_blank">Incubrain</a>
    </h1>
  </div>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
