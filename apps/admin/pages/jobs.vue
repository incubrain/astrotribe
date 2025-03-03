<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Jobs',
})

const message = ref('Scraper is Idle')

const scrape = async () => {
  try {
    message.value = 'Scraping Jobs'
    await $fetch('/api/jobs', {
      method: 'POST',
    })
    message.value = 'Scraper is Idle'
  } catch (error: any) {
    message.value = `Error Scraping Jobs ${error}`
    console.error('Error Scraping Jobs', error)
  }
}
</script>

<template>
  <div class="wrapper flex-col relative gap-2 flex items-center justify-center h-full max-h-full">
    <div class="bg-black">
      <h3>{{ message }}</h3>
    </div>
    <PrimeButton @click="scrape"> Scrape Jobs </PrimeButton>
  </div>
</template>

<style scoped></style>
