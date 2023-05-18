<template>
  <div class="bg-gray-100 py-5">
    <h1 class="text-base text-gray-700 text-center">
      ©2018 - {{ currentYear }} AstronEra. All right reserved
    </h1>
  </div>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
