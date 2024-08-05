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

const selectedLevel = ref('beginner')
</script>
<template>
  <div class="flex w-full gap-2">
    <PrimeButton @click="news.scrapeBlogs">Scrape Blogs</PrimeButton>
    <PrimeButton @click="storeImage">Store Image</PrimeButton>
    <PrimeButton @click="news.getBlogs">Get Blogs</PrimeButton>
    <div class="mb-4 flex w-full justify-end gap-2">
      <PrimeSelect
        v-model="selectedLevel"
        :options="summaryLevels"
        option-label="label"
        placeholder="Choose Summary Level"
        checkmark
        :highlight-on-select="false"
        mode="hover"
        :popper="{ placement: 'bottom-start' }"
      >
        <PrimeButton
          color="white"
          :label="news.summaryLevel"
          trailing-icon="heroicons:chevron-down-20-solid"
        />
      </PrimeSelect>
    </div>
  </div>
</template>
