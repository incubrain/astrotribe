<template>
  <div class="bg-primary-600 dark:bg-primary-700 p-6 pt-12 pb-12">
    <div class="w-full lg:flex justify-around mx-auto container max-w-[840px]">
      <FooterSocialLinks />
      <NewsletterBasic />
    </div>
  </div>
  <FooterBar :current-year="currentYear" />
</template>

<script setup lang="ts">
const links = [
  {
    title: 'Insurance',
    links: ['How it works', 'Benefits', 'Features']
  },
  {
    title: 'About Us',
    links: ['Our team', 'Career', 'Blog']
  }
]

const currentYear = new Date().getFullYear()
</script>

<style scoped>
@import url('https://cdn.tuk.dev/dist/css/tailwind-v2.2.11.min.css');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.f-f-p {
  font-family: 'Poppins', sans-serif;
}
</style>
