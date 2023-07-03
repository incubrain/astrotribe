<template>
  <div class="flex flex-col relative h-full w-full">
    <div class="w-full flex gap-2">
      <UButton @click="scrapeBlogs">Scrape Blogs</UButton>
      <UButton @click="getBlogs">Get Blogs</UButton>
    </div>
    <div class="flex flex-col max-w-xl mx-auto gap-8">
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
        <div v-if="p.featured_image">
          <NuxtImg :src="p.featured_image" class="mx-auto rounded-md" />
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
        <p class="text-sm"> {{ p.content }}</p>
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
  featured_image: string | null
}

const posts = ref([] as Post[])

const scrapeBlogs = () => {
  const { data, error } = useFetch('/api/admin/scrape-blogs')
  if (error.value) console.error('error scraping blogs: ', error.value)
  console.log('data returned from scrape:', data.value)
}

const getBlogs = async () => {
  const { data, error } = await useAsyncData('blogs', () => $fetch('/api/admin/get-blogs'))
  if (error.value) console.error('error getting blogs: ', error.value)
  posts.value = data.value.blogs
}

definePageMeta({
  name: 'Feed'
})
</script>
