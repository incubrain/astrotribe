<template>
  <div class="p-6 pt-12 pb-12 bg-primary-600 dark:bg-primary-700">
    <div class="w-full flex justify-around mx-auto container max-w-[840px]">
      <SocialBlock
        :socials="contact.socials"
        class="text-center text-white"
      />
      <!-- <NewsletterBasic /> -->
    </div>
  </div>
  <FooterBar :current-year="currentYear" />
</template>

<script setup lang="ts">
import contact from '@/data/home/contact.json'
const currentYear = new Date().getFullYear()
</script>

<style scoped>
@import url('https://cdn.tuk.dev/dist/css/tailwind-v2.2.11.min.css');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.f-f-p {
  font-family: 'Poppins', sans-serif;
}
</style>
