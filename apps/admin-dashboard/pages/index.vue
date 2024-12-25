<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'AdminDashboard',
})

const outputData = ref('')

const scrapeNewsLinks = async () => {
  try {
    const data = await $fetch('/api/cron-jobs', {
      method: 'POST',
      body: { action: 'scrapeNewsLinks' },
    })
    outputData.value = JSON.stringify(data, null, 2)
  } catch (error: any) {
    console.error('Error scraping news links:', error)
    outputData.value = 'Error scraping news links. Check console for details.'
  }
}

const scrapeNewsArticles = async () => {
  try {
    const data = await $fetch('/api/cron-jobs', {
      method: 'POST',
      body: { action: 'scrapeNewsArticles' },
    })
    outputData.value = JSON.stringify(data, null, 2)
  } catch (error: any) {
    console.error('Error scraping news articles:', error)
    outputData.value = 'Error scraping news articles. Check console for details.'
  }
}
</script>

<template>
  <div class="relative h-full max-h-full p-4">
    <!-- <div class="flex flex-col gap-8">
      <div class="flex gap-4">
        <PrimeButton @click="scrapeNewsLinks">Scrape News Links</PrimeButton>
        <PrimeButton @click="scrapeNewsArticles">Scrape News Articles</PrimeButton>
      </div>
      <p>{{ outputData }}</p>
    </div> -->
    <!-- <ServerJobs /> -->
  </div>
</template>

<style scoped></style>
