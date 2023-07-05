<template>
  <div class="flex flex-col relative h-full w-full">
    <div class="w-full flex gap-2">
      <UButton @click="scrapeBlogs">Scrape Blogs</UButton>
      <UButton @click="getBlogs">Get Blogs</UButton>
      <UButton @click="getSummary">Get Summary</UButton>
      <div class="w-full flex justify-end gap-2 mb-4">
        <select
          v-model="summaryLevel"
          class="outline-none p-2 rounded-md shadow-sm"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto gap-8">
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
            <div class=" h-56 w-full rounded-md overflow-hidden relative object-cover">
              <NuxtImg
                :src="p.image.src"
                :alt="p.image.alt || `${p.title.name} featured image`"
                width="460"
                height="259"
                class="h-full object-cover"
                @click="imgModalOpen = true"
              />
            </div>
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
                class="mx-auto rounded-md object-cover w-full"
              />
              <div>
                <p class="text-sm">
                  {{ posts[currentIndex].image.caption ? posts[currentIndex].image.caption : '' }}
                </p>
                <div>
                  <h4 class="pb-2 font-semibold"> {{ summaryLevel }}</h4>
                  <ul class="space-y-2">
                    <li
                      v-for="sum in p.summaries[summaryLevel]"
                      :key="sum"
                      class="flex gap-2 items-start"
                    >
                      <UIcon
                        name="i-mdi-star"
                        class="text-yellow-500 w-3 h-3 flex-shrink-0 mt-[3px]"
                      />
                      <p class="flex-grow leading-snug text-sm">
                        {{ sum }}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="flex gap-4 justify-center">
                <!-- <div
                  v-if="prevIndex >= 0"
                  class="flex flex-col gap-2"
                >
                  <NuxtImg
                    :src="posts[prevIndex].image.src || 'astron-era-hero.jpg'"
                    :alt="
                      posts[prevIndex].image.alt || `${posts[prevIndex].title.name} featured image`
                    "
                    width="50"
                    height="50"
                    loading="lazy"
                    class="mx-auto rounded-md object-cover w-full"
                  />
                  <UButton
                    class="btn btn-primary"
                    variant="link"
                    @click="prevPost"
                  >
                    {{ posts[prevIndex].title.name }}
                  </UButton>
                </div> -->
                <UButton
                  v-if="nextIndex <= posts.length -1"
                  class="flex flex-col gap-2"
                  variant="link"
                  @click="nextPost"
                >
                  <div class="w-24 h-24">
                    <NuxtImg
                      :src="posts[nextIndex].image.src || 'astron-era-hero.jpg'"
                      :alt="
                        posts[nextIndex].image.alt || `${posts[nextIndex].title.name} featured image`
                      "
                      width="50"
                      height="50"
                      quality="65"
                      loading="lazy"
                      class="mx-auto rounded-md object-cover w-full h-full"
                    />
                  </div>
                  {{ posts[nextIndex].title.name }}
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
        <div>
          <h4 class="pb-2 font-semibold"> {{ summaryLevel }}</h4>
          <ul class="space-y-2">
            <li
              v-for="sum in p.summaries[summaryLevel]"
              :key="sum"
              class="flex gap-2 items-start"
            >
              <UIcon
                name="i-mdi-star"
                class="text-yellow-500 w-3 h-3 flex-shrink-0 mt-[3px]"
              />
              <p class="flex-grow leading-snug text-sm">
                {{ sum }}
              </p>
            </li>
          </ul>
        </div>
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
    beginner: string[] | null
    intermediate: string[] | null
    expert: string[] | null
    [key: string]: string[] | null
  }
}

const posts = ref([] as Post[])
const imgModalOpen = ref(false)
const summaryLevel = ref<'beginner' | 'intermediate' | 'expert'>('beginner')

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
const prevIndex = ref(computed(() => currentIndex.value - 1))
const nextIndex = ref(computed(() => currentIndex.value + 1))

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
