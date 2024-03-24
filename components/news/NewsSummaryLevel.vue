<script setup lang="ts">

const summaryLevels = [
  [
    {
      label: 'Beginner',
      value: 'beginner',
      click: () => news.changeSummaryLevel('beginner')
    }
  ],
  [
    {
      label: 'Intermediate',
      value: 'intermediate',
      click: () => news.changeSummaryLevel('intermediate')
    }
  ],
  [
    {
      label: 'Expert',
      value: 'expert',
      click: () => news.changeSummaryLevel('expert')
    }
  ]
]
</script>
<template>
  <div class="w-full flex gap-2">
    <UButton @click="news.scrapeBlogs">Scrape Blogs</UButton>
    <UButton @click="storeImage">Store Image</UButton>
    <UButton @click="news.getBlogs">Get Blogs</UButton>
    <div class="w-full flex justify-end gap-2 mb-4">
      <UDropdown
        :items="summaryLevels"
        mode="hover"
        :popper="{ placement: 'bottom-start' }"
      >
        <UButton
          color="white"
          :label="news.summaryLevel"
          trailing-icon="i-heroicons-chevron-down-20-solid"
        />
      </UDropdown>
    </div>
  </div>
</template>
