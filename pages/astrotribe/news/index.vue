<template>
  <div class="flex flex-col relative h-full w-full">
    <div class="w-full flex gap-2">
      <UButton @click="getBlogs">Get Blogs</UButton>
      <!--  <UButton @click="scrapeBlogs">Scrape Blogs</UButton>
      <UButton @click="getSummary">Get Summary</UButton>
      <UButton @click="getEmbed">Get Embed</UButton>
      <UButton @click="getCategory">Get Cat</UButton> -->
      <div class="w-full flex justify-end gap-2 mb-4">
        <UDropdown
          :items="summaryLevels"
          mode="hover"
          :popper="{ placement: 'bottom-start' }"
        >
          <UButton
            color="white"
            :label="summaryLevel"
            trailing-icon="i-heroicons-chevron-down-20-solid"
          />
        </UDropdown>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto md:gap-4 xl:gap-8">
      <NewsCard
        v-for="(p, i) in posts"
        :key="i"
        :post="p"
        :summary-level="summaryLevel"
        @open-news-modal="openModal(i)"
      />
      <LazyUModal v-model="isModalOpen">
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
      </LazyUModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { News } from '@/types/news'

const posts = ref([] as News[])

type SummaryLevel = 'beginner' | 'intermediate' | 'expert'
const summaryLevel = ref<SummaryLevel>('beginner')
const changeSummaryLevel = (level: SummaryLevel) => {
  summaryLevel.value = level
}

const summaryLevels = [
  [
    {
      label: 'Beginner',
      value: 'beginner',
      click: (e: PointerEvent) =>
        changeSummaryLevel((e.target as HTMLInputElement).value as SummaryLevel)
    }
  ],
  [{ label: 'Intermediate', value: 'intermediate' }],
  [{ label: 'Expert', value: 'expert' }]
]

const summary = ref([] as string[])

const scrapeBlogs = () => {
  const { data, error } = useFetch('/api/admin/scrape-blogs')
  if (error.value) console.error('error scraping blogs: ', error.value)
  console.log('data returned from scrape:', data.value)
}

const getBlogs = async () => {
  const { data, error } = await useAsyncData('blogs', () => $fetch('/api/admin/get-blogs'))
  if (error.value) throw new Error('error getting blogs: ', error.value)
  posts.value = data.value.blogs
}

const getSummary = async () => {
  const { data, error } = await useAsyncData('summary', () => $fetch('/api/admin/generate-summary'))
  if (error.value) throw new Error('error getting summary: ', error.value)
  console.log('returned to client:', data.value.blogs)
  summary.value = data.value.blogs
}

const getCategory = async () => {
  const { data, error } = await useAsyncData('category', () =>
    $fetch('/api/admin/generate-category-tags')
  )
  if (error.value) throw new Error('error getting category: ', error.value)
  console.log('returned to client:', data.value.blogs)
  summary.value = data.value.blogs
}

const getEmbed = async () => {
  const { data, error } = await useAsyncData('embeddings', () =>
    $fetch('/api/admin/generate-embeddings')
  )
  if (error.value) throw new Error('error generating embedding: ', error.value)
  console.log('returned to client:', data.value.blogs)
  summary.value = data.value.blogs
}

const isModalOpen = ref(false)
const currentIndex = ref(0)
const previousIndex = ref(computed(() => currentIndex.value - 1))
const nextIndex = ref(computed(() => currentIndex.value + 1))

const nextPost = () => {
  if (currentIndex.value < posts.value.length - 1) {
    currentIndex.value++
  }
}

const previousPost = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const openModal = (postIndex: number) => {
  isModalOpen.value = true
  currentIndex.value = postIndex
}

definePageMeta({
  name: 'Feed'
})
</script>
