<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const category = route.params.category as string

const { categories, validCategories, fetchCategories } = useBlogCategories()

const { width } = useWindowSize()

const {
  data: article,
  status,
  error,
} = await useAsyncData(
  `article-${category}-${slug}`,
  async () => {
    // Include category in key

    try {
      const post = await queryCollection('blog')
        .where('stem', '=', `blog/${category}/${slug}`)
        .first()
      console.log('Article query result:', post ? { found: true, stem: post.stem } : 'Not found')
      // DO NOT fetch author/category here yet
      return post
    } catch (e) {
      console.error('Error fetching core article:', e)
      // Ensure errors are thrown so status becomes 'error'
      throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true }) // Or handle differently
    }
  },
  {
    // Ensure it runs server-side and payload is transferred
  },
)

const { data: authorData } = await useAsyncData(
  `author-${article.value?.author}`, // Key depends on article having loaded
  async () => {
    if (!article.value?.author) return null
    console.log('Fetching author data for:', article.value.author)
    return queryCollection('authors').where('stem', '=', `authors/${article.value.author}`).first()
  },
  { watch: [() => article.value?.author] }, // Re-run if author changes
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
  console.log('Available categories:', categories.value)
  console.log('Valid category slugs:', validCategories.value)
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
        ogImage: newArticle.cover?.url,
      })
    }
  },
  { immediate: true },
)

console.log('Article with relations:', articleWithRelations.value)
</script>

<template>
  <div>
    <div
      v-if="status === 'pending'"
      class="flex justify-center items-center py-16"
    >
      <Icon
        name="i-lucide-loader"
        class="w-8 h-8 animate-spin text-primary-600"
      />
    </div>

    <div
      v-else-if="status === 'error' && error"
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

    <div
      v-else-if="status === 'success' && articleWithRelations"
      class="background"
    >
      <!-- Blog Header with Hero -->
      <BlogArticleHero :article="articleWithRelations" />

      <div
        class="padded-x grid grid-cols-[minmax(300px,700px)] justify-center pt-8 xl:grid-cols-[minmax(240px,1fr)_minmax(660px,700px)_minmax(240px,1fr)] xl:gap-8"
      >
        <!-- Left Sidebar -->
        <div class="w-full xl:col-start-1">
          <BlogArticleToc
            :article="articleWithRelations"
            :expanded="width < 1280"
            class="sticky top-24"
          />
        </div>

        <!-- Main Content -->
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
