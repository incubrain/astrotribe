<script setup lang="ts">
import { useBlogCategories } from '~/composables/useBlogCategories'

const route = useRoute()
const categorySlug = route.params.category as string

console.log('Category page - slug:', categorySlug)

const { getCategoryInfo, getCategoryImage, validCategories, fetchCategories } = useBlogCategories()

// Fetch categories first
await fetchCategories()

console.log('Valid categories:', validCategories.value)

// Normalize the category slug from the database for comparison
const normalizedValidCategories = computed(() => {
  return [
    'all',
    ...validCategories.value
      .filter((slug) => slug !== 'all')
      .map((slug) => slug.replace('categories/', '')),
  ]
})

console.log('Normalized valid categories:', normalizedValidCategories.value)

// Validate category against normalized slugs
if (!normalizedValidCategories.value.includes(categorySlug)) {
  console.warn(
    `Category not valid: "${categorySlug}". Valid categories are:`,
    normalizedValidCategories.value,
  )
  navigateTo('/404')
}

// When getting the category info, we need to add the prefix back
const dbCategorySlug = categorySlug === 'all' ? 'all' : `categories/${categorySlug}`
const categoryInfo = getCategoryInfo(dbCategorySlug)
console.log('Category info:', categoryInfo)

// Get articles for this category, first page
const { data: articlesData, pending } = await useAsyncData(`articles-${categorySlug}`, async () => {
  console.log(`Fetching articles for category: ${categorySlug}`)

  // Base query
  let query = queryCollection('blog').where('draft', '=', false).order('date', 'DESC')

  // Filter by category - use the plain category slug (without prefix)
  // This assumes your blog posts use the non-prefixed category slugs
  if (categorySlug !== 'all') {
    console.log(`Adding category filter: category = ${categorySlug}`)
    query = query.where('category', '=', categorySlug)
  }

  // Pagination (first page)
  const postsPerPage = 9
  query = query.limit(postsPerPage)

  // Execute query
  const articles = await query.all()
  console.log(`Found ${articles.length} articles for category ${categorySlug}`)

  if (articles.length === 0) {
    // Try to get any articles to see what's available
    const sampleArticles = await queryCollection('blog').limit(5).all()
    console.log(
      'Sample articles:',
      sampleArticles.map((a) => ({
        title: a.title,
        category: a.category,
        stem: a.stem,
      })),
    )
  }

  // Get total count for pagination
  let countQuery = queryCollection('blog').where('draft', '=', false)

  if (categorySlug !== 'all') {
    countQuery = countQuery.where('category', '=', categorySlug)
  }

  const totalArticles = await countQuery.count()
  console.log(`Total articles for category ${categorySlug}: ${totalArticles}`)

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

    <BlogActions />

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
