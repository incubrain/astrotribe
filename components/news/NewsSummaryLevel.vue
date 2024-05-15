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
  <div class="w-full flex gap-2">
    <PrimeButton @click="news.scrapeBlogs">Scrape Blogs</PrimeButton>
    <PrimeButton @click="storeImage">Store Image</PrimeButton>
    <PrimeButton @click="news.getBlogs">Get Blogs</PrimeButton>
    <div class="w-full flex justify-end gap-2 mb-4">
      <PrimeDropdown
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
      </PrimeDropdown>
    </div>
  </div>
</template>
