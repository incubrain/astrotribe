<template>
  <div class="flex flex-col relative h-full w-full">
    <div class="w-full flex gap-2">
      <UButton @click="scrapeBlogs">Scrape Blogs</UButton>
      <UButton @click="getBlogs">Get Blogs</UButton>
      <UButton @click="getSummary">Get Summary</UButton>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto gap-8">
      <p>{{ summary }}</p>
      <ul>
        <li
          v-for="sum in summary"
          :key="sum"
        >
          {{ sum }}
        </li>
      </ul>
      <div
        v-for="(p, i) in posts"
        :key="i"
        class="flex flex-col gap-4 rounded-md border p-4 foreground border-color"
      >
        <a
          :href="p.title.link"
          target="_blank"
        >
          <h3 class="text-2xl"> {{ p.title.name }}</h3>
        </a>
        <div v-if="p.image.src">
          <UTooltip :text="p.image.caption?.substring(0, 240) + '...' || 'No caption'">
            <NuxtImg
              :src="p.image.src"
              :alt="p.image.alt || `${p.title.name} featured image`"
              class="mx-auto rounded-md"
              loading="lazy"
              @click="imgModalOpen = true"
            />
          </UTooltip>
          <UModal v-model="imgModalOpen">
            <div
              class="p-4 foreground grid grid-cols-1 xl:grid-cols-[1fr_minmax(200px,300px)] gap-4 w-auto"
            >
              <NuxtImg
                :src="posts[currentIndex].image.src || 'astron-era-hero.jpg'"
                :alt="
                  posts[currentIndex].image.alt ||
                  `${posts[currentIndex].title.name} featured image`
                "
                loading="lazy"
                class="mx-auto rounded-md"
              />
              <div>
                <p class="text-sm">
                  {{ posts[currentIndex].image.caption ? posts[currentIndex].image.caption : '' }}
                </p>
                <p class="text-sm hidden xl:flex pt-4">
                  {{ posts[currentIndex].content.substring(0, 360) }}
                </p>
              </div>
              <div class="flex gap-4 justify-center">
                <UButton
                  class="btn btn-primary"
                  @click="prevPost"
                  :disabled="currentIndex === 0"
                >
                  Prev
                </UButton>
                <UButton
                  class="btn btn-primary"
                  @click="nextPost"
                  :disabled="currentIndex === posts.length - 1"
                >
                  Next
                </UButton>
              </div>
            </div>
          </UModal>
        </div>
        <div class="flex gap-2">
          <a
            :href="p.author.link"
            target="_blank"
          >
            <p class="text-sm"> {{ p.author.name }}</p>
          </a>
          <p class="text-sm"> {{ p.published.name }}</p>
          <a
            :href="p.category.link"
            target="_blank"
          >
            <p class="text-sm"> {{ p.category.name }}</p>
          </a>
        </div>
        <p class="text-sm"> {{ p.content.substring(0, 360) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Post {
  title: {
    name: string
    link: string
  }
  author: {
    name: string
    link: string
  }
  published: {
    name: string
    link: string
  }
  category: {
    name: string
    link: string
  }
  content: string
  image: {
    src: string | null
    alt: string | null
    caption: string | null
    imgModalOpen: boolean
  }
  summaries: {
    beginner: string | null
    intermediate: string | null
    expert: string | null
  }
}

const posts = ref([] as Post[])
const imgModalOpen = ref(false)

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

const currentIndex = ref(0)

const nextPost = () => {
  if (currentIndex.value < posts.value.length - 1) {
    currentIndex.value++
  }
}

const prevPost = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

definePageMeta({
  name: 'Feed'
})
</script>
