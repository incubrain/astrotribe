<script setup lang="ts">
const route = useRoute()
const categorySlug = route.params.category as string
const pageNumber = parseInt(route.params.page as string) || 1

// ✅ Fetch categories safely
const { data: rawCategories, pending: categoriesLoading } = await useAsyncData('categories', () => {
  return queryCollection('categories').all()
})

const blogCategories = computed(() => {
  if (categoriesLoading.value || !rawCategories.value) return null
  return useBlogCategories(rawCategories)
})

watchEffect(() => {
  console.log('rawCategories updated:', rawCategories.value)
})

watchEffect(() => {
  console.log('computed categories updated:', categories.value)
})

// ✅ Normalize for matching
const normalizedCategories = computed(() => [
  'all',
  ...(categories.value?.map((c) => c?.stem?.replace(/^categories\//, '')) ?? []),
])

// ✅ Validate category reactively (watch for categories)
watchEffect(() => {
  if (!categoriesLoading.value && !normalizedCategories.value.includes(categorySlug)) {
    console.warn(
      `Category not valid: "${categorySlug}". Valid categories are:`,
      normalizedCategories.value,
    )
    navigateTo('/404')
  }
})

// Category info
const dbCategorySlug = categorySlug === 'all' ? 'all' : `categories/${categorySlug}`
const getCategoryInfo = computed(() => blogCategories.value?.getCategoryInfo)
const getCategoryImage = computed(() => blogCategories.value?.getCategoryImage)
const categories = computed(() => blogCategories.value?.categories)

// Fetch articles
const { data: articlesData, pending } = await useAsyncData(
  `articles-${categorySlug}-page-${pageNumber}`,
  async () => {
    let query = queryCollection('blog').where('draft', '=', false).order('createdAt', 'DESC')

    if (categorySlug !== 'all') {
      query = query.where('category', '=', categorySlug)
    }

    const postsPerPage = 9
    const skip = (pageNumber - 1) * postsPerPage
    const articles = await query.skip(skip).limit(postsPerPage).all()

    const countQuery = queryCollection('blog').where('draft', '=', false)

    if (categorySlug !== 'all') {
      countQuery.where('category', '=', categorySlug)
    }

    const totalArticles = await countQuery.count()
    const totalPages = Math.max(1, Math.ceil(totalArticles / postsPerPage))

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

// SEO
useSeoMeta({
  title: `${getCategoryInfo.value?.title} - Page ${pageNumber}`,
  description: getCategoryInfo.value?.description,
  ogTitle: `${getCategoryInfo.value?.title} - Page ${pageNumber} - AstronEra Blog`,
  ogDescription: getCategoryInfo.value?.description,
})
</script>

<template>
  <div>
    <CommonHero
      :img="{
        src: getCategoryImage?.(categorySlug) || '/images/blog/categories/fallback.webp',
        alt: `${getCategoryInfo?.title} Hero Image`,
        width: 1080,
        height: 720,
      }"
      :title="{
        main: getCategoryInfo?.title,
        subtitle: getCategoryInfo?.description,
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
