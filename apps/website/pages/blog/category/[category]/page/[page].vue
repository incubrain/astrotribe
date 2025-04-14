<script setup lang="ts">
import { useBlogCategories } from '~/composables/useBlogCategories'

const route = useRoute()
const categorySlug = route.params.category as string
const pageNumber = parseInt(route.params.page as string) || 1
const { getCategoryInfo, getCategoryImage, validCategories } = useBlogCategories()

// Validate category
if (!validCategories.value.includes(categorySlug)) {
  navigateTo('/404')
}

const categoryInfo = getCategoryInfo(categorySlug)

// Get articles with pagination
const { data: articlesData, pending } = await useAsyncData(
  `articles-${categorySlug}-page-${pageNumber}`,
  async () => {
    // Base query
    let query = queryCollection('blog').where('draft', '=', false).order('createdAt', 'DESC')

    // Filter by category
    if (categorySlug !== 'all') {
      // Now we're matching on category ID/slug directly
      query = query.where('category', '=', categorySlug)
    }

    // Pagination
    const postsPerPage = 9
    const skip = (pageNumber - 1) * postsPerPage
    query = query.skip(skip).limit(postsPerPage)

    // Execute query
    const articles = await query.all()

    // Get total count for pagination
    let countQuery = queryCollection('blog').where('draft', '=', false)

    if (categorySlug !== 'all') {
      countQuery = countQuery.where('category', '=', categorySlug)
    }

    const totalArticles = await countQuery.count()
    const totalPages = Math.ceil(totalArticles / postsPerPage)

    // Validate page number
    if (pageNumber > totalPages && totalPages > 0) {
      navigateTo(`/blog/category/${categorySlug}${totalPages > 1 ? `/page/${totalPages}` : ''}`)
    }

    return {
      articles,
      totalPages,
      totalArticles,
    }
  },
)

// SEO
useSeoMeta({
  title: `${categoryInfo.title} - Page ${pageNumber}`,
  description: categoryInfo.description,
  ogTitle: `${categoryInfo.title} - Page ${pageNumber} - AstronEra Blog`,
  ogDescription: categoryInfo.description,
})
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

    <div class="wrapper py-4 lg:py-8">
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
      :current-page="pageNumber"
      :total-pages="articlesData.totalPages"
      :base-url="`/blog/category/${categorySlug}/page`"
    />
  </div>
</template>
