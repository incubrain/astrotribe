<template>
  <div class="foreground py-5">
    <h1 class="text-base text-center"> ©2018 - {{ currentYear }} AstronEra. All right reserved </h1>
  </div>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
