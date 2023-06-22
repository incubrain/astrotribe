<template>
  <div class="flex flex-col">
    <h2 class=" text-xl lg:text-2xl font-semibold leading-normal">Socials</h2>
    <div class="flex w-full gap-2 mt-2">
      <IconSocial v-for="s in contactData.socials" :key="s.platform" :platform="s.platform" :link="s.link" />
    </div>
  </div>
</template>

<script setup lang="ts">
import contactData from '@/data/home/contact.json'

</script>

<style scoped></style>
