<template>
  <div class="flex flex-col relative h-full w-full">
    <div class="w-full flex gap-2">
      <UButton @click="storeBlogs">Scrape Blogs</UButton>
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
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto md:gap-4 xl:gap-8">
      {{ news.posts }}
      <!-- <NewsCard
        v-for="(p, i) in news.posts"
        :key="`news-post-${i}`"
        :post="p"
        :summary-level="news.summaryLevel"
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const news = useNewsStore()

const storeBlogs = async () => {
  const blogs = await news.scrapeBlogs()
  localStorage.setItem('blogs', JSON.stringify(blogs))
}

const storeImage = async () => {
  const res = await useFetch('/api/admin/store-image')
  console.log('store image res', res)
}

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

definePageMeta({
  name: 'Feed',
  layout: 'app'
})
</script>
