<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Jobs',
})

const scrape = async () => {
  console.log('Scraping Jobs')
  try {
    await $fetch('/api/jobs', {
      method: 'POST',
    })
  } catch (error: any) {
    console.error('Error Scraping Jobs', error)
  }
}
</script>

<template>
  <div class="relative h-full max-h-full">
    <PrimeButton @click="scrape"> Scrape Jobs </PrimeButton>
  </div>
</template>

<style scoped></style>
