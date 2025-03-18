<script setup lang="ts">
const { width } = useWindowSize()

const expandToc = computed(() => width.value < 1280)

const articleContent = ref<HTMLElement | null>(null)
const tocLinks = ref<TocLink[]>([])

const p = defineProps({
  article: {
    type: Object,
    required: true,
  },
})

console.log('Props Article:', p.article)

interface TocLink {
  id: string
  text: string
  depth: number
  children: TocLink[]
}

// Update to extract TOC from Nuxt Content v3 format
const extractToc = (): TocLink[] => {
  // Nuxt Content v3 already provides TOC in article.body.toc
  if (p.article.body?.toc?.links) {
    return p.article.body.toc.links.map((link) => ({
      id: link.id,
      text: link.text,
      depth: link.depth,
      children: link.children || [],
    }))
  }
  return []
}

onMounted(() => {
  tocLinks.value = extractToc()
})

watch(
  () => articleContent.value,
  async (newVal) => {
    if (newVal && p.article.body) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  },
)
</script>

<template>
  <div class="max-w-full pb-10">
    <main>
      <BlogArticleHero :article="article" />
      <div
        class="padded-x grid grid-cols-[minmax(300px,700px)] justify-center pt-8 xl:grid-cols-[minmax(240px,1fr)_minmax(660px,740px)_minmax(240px,1fr)] xl:gap-8"
      >
        <div class="w-full xl:col-start-1">
          <BlogArticleToc
            v-if="tocLinks.length"
            class="background border-color rounded-md border p-4 xl:sticky xl:left-0 xl:top-24 xl:border-none xl:p-0"
            :toc="tocLinks"
            :updated-at="article.updatedAt"
            :expanded="expandToc"
          />
        </div>
        <div class="xl:padded-x xl:col-start-2">
          <div class="pb-12">
            <div
              ref="articleContent"
              class="prose prose-pre:max-w-xs sm:prose-pre:max-w-full prose-sm sm:prose-base md:prose-lg prose-h1:no-underline max-w-5xl mx-auto prose-zinc dark:prose-invert prose-img:rounded-lg"
            >
              <ContentRenderer
                v-if="article"
                :value="article"
              />
            </div>
            <BlogArticleShare
              :link="article.path"
              :summary="article.description"
            />
            <BlogArticleAuthorCard :authors="[article.author]" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
