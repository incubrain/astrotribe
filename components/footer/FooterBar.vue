<template>
  <div class="py-5 foreground">
    <h1 class="text-base text-center"> ©2018 - {{ currentYear }} AstronEra. All right reserved </h1>
  </div>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
