<template>
  <div class="flex flex-col relative h-full w-full">
    <div class="w-full flex gap-2">
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
      <NewsCard
        v-for="(p, i) in news.posts"
        :key="i"
        :post="p"
        :summary-level="news.summaryLevel"
        />
        <!-- <LazyUModal v-model="isModalOpen">
        @open-news-modal="news.toggleModal(i)"
        <LazyNewsModal
          :posts="posts"
          :current-index="currentIndex"
          :summary-level="summaryLevel"
          :next-index="nextIndex"
          :next-post="nextPost"
          :previous-index="previousIndex"
          :previous-post="previousPost"
          @close-news-modal="isModalOpen = false"
        />
      </LazyUModal> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const news = useNewsStore()

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
  name: 'Feed'
})
</script>
