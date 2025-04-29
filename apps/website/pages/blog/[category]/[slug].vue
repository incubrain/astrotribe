<script setup lang="ts">
const route = useRoute()

const { categories, validCategories, fetchCategories } = useBlogCategories()

const { width } = useWindowSize()

const { slug, category } = toRefs(route.params)

const ready = computed(() => Boolean(slug?.value && category?.value))

const {
  data: article,
  status,
  error,
} = await useAsyncData(
  `article-${category?.value}-${slug?.value}`,
  async () => {
    if (!ready.value) return null
    const post = await queryCollection('blog')
      .where('stem', '=', `blog/${category?.value}/${slug?.value}`)
      .first()

    return post || null
  },
  {
    server: true,
    immediate: ready.value,
    watch: [ready],
  },
)

const { data: authorData } = await useAsyncData(
  `author-${article.value?.author}`,
  async () => {
    if (!article.value?.author) return null
    console.log('Fetching author data for:', article.value.author)
    return queryCollection('authors').where('stem', '=', `authors/${article.value.author}`).first()
  },
  {
    immediate: false,
    watch: [() => article.value?.author, () => route.path],
  },
)

const { data: categoryData } = await useAsyncData(
  `category-${article.value?.category}`, // Key depends on article having loaded
  async () => {
    if (!article.value?.category) return null
    return queryCollection('categories')
      .where('stem', '=', `categories/${article.value.category}`)
      .first()
  },
  { watch: [() => article.value?.category] }, // Re-run if category changes
)

// Combine data for the template, perhaps using computed properties
const articleWithRelations = computed(() => {
  if (!article.value) return null
  return {
    ...article.value,
    authorData: authorData.value || null,
    categoryData: categoryData.value || null,
  }
})

onMounted(async () => {
  await fetchCategories()
})

watch(
  () => article.value,
  (newArticle) => {
    if (newArticle) {
      useSeoMeta({
        title: newArticle.title,
        description: newArticle.description,
        ogTitle: newArticle.title,
        ogDescription: newArticle.description,
      })
    }
  },
  { immediate: true },
)

console.log('Route changed:', {
  path: route.path,
  params: route.params,
  slug,
  category,
})

// After article fetch
console.log('Article fetch result:', {
  status: status.value,
  hasArticle: !!article.value,
  articleId: article.value?.id,
  article: article.value,
})
</script>

<template>
  <div class="pt-16">
    <!-- Loading Spinner -->
    <div
      v-if="!article && !error"
      class="flex justify-center items-center py-16"
    >
      <Icon
        name="i-lucide-loader"
        class="w-8 h-8 animate-spin text-primary-600"
      />
    </div>

    <!-- Error Message -->
    <div
      v-else-if="error"
      class="py-16 text-center"
    >
      <h1 class="text-3xl font-bold text-gray-700">Article Not Found</h1>
      <p class="mt-4">{{ error.message }}</p>
      <NuxtLink
        to="/blog"
        class="inline-block mt-8 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
      >
        Return to Blog
      </NuxtLink>
    </div>

    <!-- Success: Render Article -->
    <div
      v-else-if="articleWithRelations"
      class="background"
    >
      <BlogArticleHero :article="articleWithRelations" />
      <div
        class="padded-x grid grid-cols-[minmax(300px,700px)] justify-center pt-8 xl:grid-cols-[minmax(240px,1fr)_minmax(660px,700px)_minmax(240px,1fr)] xl:gap-8"
      >
        <div class="w-full xl:col-start-1">
          <BlogArticleToc
            :article="articleWithRelations"
            :expanded="width < 1280"
            class="sticky top-24"
          />
        </div>
        <div class="xl:padded-x xl:col-start-2">
          <div class="pb-12">
            <BlogArticleMeta
              :article="articleWithRelations"
              class="mb-6"
            />
            <div class="mx-auto space-y-8">
              <ContentRenderer
                v-if="article"
                :value="article"
                class="prose dark:prose-invert max-w-none blog-content animate-fade-in"
              />
            </div>
            <BlogArticleShare
              v-if="article"
              :link="article.path"
              :summary="article.description"
            />
            <BlogArticleAuthorCard :authors="[articleWithRelations.authorData]" />
            <BlogArticleNavigation :article="articleWithRelations" />
          </div>
        </div>
      </div>
    </div>

    <!-- Related Articles -->
    <div
      v-if="article"
      class="wrapper mx-auto"
    >
      <BlogRelatedPosts :article="article" />
    </div>
  </div>
</template>
