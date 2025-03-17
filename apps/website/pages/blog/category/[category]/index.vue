<script setup lang="ts">
import BlogSearch from '../../../../components/blog/BlogSearch.vue'
import { useBlogCategories } from '~/composables/useBlogCategories'

const route = useRoute()
const categorySlug = route.params.category as string
const { getCategoryInfo, getCategoryImage, validCategories } = useBlogCategories()

// Validate category
if (!validCategories.includes(categorySlug)) {
  navigateTo('/404')
}

const categoryInfo = getCategoryInfo(categorySlug)

// Get articles for this category, first page
const { data: articlesData, pending } = await useAsyncData(`articles-${categorySlug}`, async () => {
  // Base query
  let query = queryCollection('blog').where('draft', '=', false).order('date', 'DESC')

  // Filter by category
  if (categorySlug !== 'all') {
    // Use the proper JSON field access syntax for SQLite
    query = query.where('category', 'LIKE', `%"slug":"${categorySlug}"%`)
  }

  // Pagination (first page)
  const postsPerPage = 9
  query = query.limit(postsPerPage)

  // Execute query
  const articles = await query.all()

  // Get total count for pagination
  let countQuery = queryCollection('blog').where('draft', '=', false)

  if (categorySlug !== 'all') {
    countQuery = countQuery.where('category', 'LIKE', `%"slug":"${categorySlug}"%`)
  }

  const totalArticles = await countQuery.count()
  const totalPages = Math.ceil(totalArticles / postsPerPage)

  return {
    articles,
    totalPages,
    totalArticles,
  }
})

// SEO
useSeoMeta({
  title: categoryInfo.title,
  description: categoryInfo.description,
  ogTitle: `${categoryInfo.title} - AstronEra Blog`,
  ogDescription: categoryInfo.description,
})

const onSearch = (query) => {
  console.log('User searched for:', query)
}

const navigateToResult = (result) => {
  navigateTo(result.id)
}
</script>

<template>
  <div>
    <CommonHero
      :img="{
        src: getCategoryImage(categorySlug),
        alt: `${categoryInfo.title} Hero Image`,
        width: 1080,
        height: 720,
      }"
      :title="{
        main: categoryInfo.title,
        subtitle: categoryInfo.description,
      }"
      position="center"
      invert
    />

    <div class="wrapper p-4 xl:p-8 flex gap-4">
      <BlogSearch
        placeholder="Search articles..."
        :result-limit="10"
        :debounce-ms="400"
        @search="onSearch"
        @select="navigateToResult"
      />
      <BlogFilter />
    </div>

    <!-- Using our new component -->
    <BlogArticleList
      :articles="articlesData?.articles || []"
      :is-loading="pending"
    />

    <!-- Pagination -->
    <Pagination
      v-if="articlesData"
      :current-page="1"
      :total-pages="articlesData.totalPages"
      :base-url="`/blog/category/${categorySlug}/page`"
    />
  </div>
</template>
