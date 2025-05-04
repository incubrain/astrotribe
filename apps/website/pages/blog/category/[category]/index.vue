<script setup lang="ts">
const route = useRoute()
const categorySlug = route.params.category as string
const pageNumber = parseInt(route.params.page as string) || 1

// Fetch categories safely in-context
const { data: rawCategories, pending: categoriesLoading } = await useAsyncData('categories', () => {
  return queryCollection('categories').all()
})

console.log('rawCategories', rawCategories)

const { getCategoryInfo, getCategoryImage, categories } = useBlogCategories(rawCategories)

// Prepare db slug
const dbCategorySlug = categorySlug === 'all' ? 'all' : `categories/${categorySlug}`

// Get category info (helper)
const categoryInfo = getCategoryInfo(dbCategorySlug)

// Fetch articles with pagination
const { data: articlesData, pending } = await useAsyncData(
  `articles-${categorySlug}-page-${pageNumber}`,
  async () => {
    let query = queryCollection('blog').where('draft', '=', false).order('createdAt', 'DESC')

    if (categorySlug !== 'all') {
      query = query.where('category', '=', categorySlug)
    }

    const postsPerPage = 21
    const skip = (pageNumber - 1) * postsPerPage

    const articles = await query.skip(skip).limit(postsPerPage).all()

    // Get total count
    let countQuery = queryCollection('blog').where('draft', '=', false)

    if (categorySlug !== 'all') {
      countQuery = countQuery.where('category', '=', categorySlug)
    }

    const totalArticles = await countQuery.count()
    const totalPages = Math.max(1, Math.ceil(totalArticles / postsPerPage))

    // Validate page number
    if (pageNumber > totalPages) {
      navigateTo(`/blog/category/${categorySlug}${totalPages > 1 ? `/page/${totalPages}` : ''}`)
    }

    return {
      articles,
      totalPages,
      totalArticles,
    }
  },
)

// SEO meta
useSeoMeta({
  title: `${categoryInfo.title}${pageNumber > 1 ? ` - Page ${pageNumber}` : ''}`,
  description: categoryInfo.description,
  ogTitle: `${categoryInfo.title}${pageNumber > 1 ? ` - Page ${pageNumber}` : ''} - AstronEra Blog`,
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
      :title="{ main: categoryInfo.title, subtitle: categoryInfo.description }"
      position="center"
      invert
    />

    <div class="wrapper py-4 pt-12">
      <BlogFilter />
    </div>

    <BlogBanner />

    <BlogArticleList
      :articles="articlesData?.articles || []"
      :is-loading="pending || categoriesLoading"
    />

    <Pagination
      v-if="articlesData"
      :current-page="pageNumber"
      :total-pages="articlesData.totalPages"
      :base-url="`/blog/category/${categorySlug}/page`"
    />
  </div>
</template>
