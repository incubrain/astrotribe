<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const category = route.params.category as string

const { width } = useWindowSize()

// Query article
const {
  data: article,
  status,
  error,
} = await useAsyncData(`article-${slug}`, async () => {
  try {
    const post = await queryCollection('blog')
      .where('stem', '=', `blog/${category}/${slug}`)
      .first()

    // If found, fetch the associated author and category data
    if (post) {
      // Get author data
      if (post.author) {
        const author = await queryCollection('authors').where('stem', '=', post.author).first()
        post.authorData = author || null
      }

      // Get category data
      if (post.category) {
        const categoryData = await queryCollection('categories')
          .where('stem', '=', post.category)
          .first()
        post.categoryData = categoryData || null
      }
    }

    return post
  } catch (e) {
    console.error('Error fetching article:', e)
    throw e
  }
})

// Wait until we have the article before setting SEO metadata
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
      v-else-if="status === 'success' && article"
      class="background"
    >
      <!-- Blog Header with Hero -->
      <BlogArticleHero :article="article" />

      <div
        class="padded-x grid grid-cols-[minmax(300px,700px)] justify-center pt-8 xl:grid-cols-[minmax(240px,1fr)_minmax(660px,740px)_minmax(240px,1fr)] xl:gap-8"
      >
        <!-- Left Sidebar -->
        <div class="w-full xl:col-start-1">
          <BlogArticleToc
            :article="article"
            :expanded="width < 1280"
          />
        </div>

        <!-- Main Content -->
        <div class="xl:padded-x xl:col-start-2">
          <div class="pb-12">
            <!-- Article Metadata -->
            <BlogArticleMeta
              :article="article"
              class="mb-6"
            />

            <!-- Article Content -->
            <div class="mx-auto space-y-8">
              <ContentRenderer
                v-if="article"
                :value="article"
                class="nuxt-content"
              />
            </div>

            <!-- Article Footer -->
            <BlogArticleShare
              :link="article.path"
              :summary="article.description"
            />

            <!-- Author Card - now passing authorData -->
            <BlogArticleAuthorCard :authors="[article.authorData]" />

            <!-- Previous/Next Navigation -->
            <BlogArticleNavigation :article="article" />
          </div>
        </div>
      </div>
    </div>
    <!-- Related Articles -->
    <div class="wrapper mx-auto">
      <BlogRelatedPosts :article="article" />
    </div>
  </div>
</template>
