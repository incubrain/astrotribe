<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Opportunities',
})

const message = ref('Scraper is Idle')

const scrape = async () => {
  try {
    message.value = 'Scraping Opportunities'
    await $fetch('/api/opportunities', {
      method: 'POST',
    })
    message.value = 'Scraper is Idle'
  } catch (error: any) {
    message.value = `Error Scraping Opportunities ${error}`
    console.error('Error Scraping Opportunities', error)
  }
}
</script>

<template>
  <div class="wrapper flex-col relative gap-2 flex items-center justify-center h-full max-h-full">
    <div class="bg-black">
      <h3>{{ message }}</h3>
    </div>
    <PrimeButton @click="scrape"> Scrape Opportunities </PrimeButton>
  </div>
</template>

<style scoped></style>
