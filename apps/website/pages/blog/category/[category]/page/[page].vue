<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import { useRoute } from '#imports'
import type { ArticleCardT, ArticleCategoriesT } from '~/types/articles'

const route = useRoute()
const categoryParam = computed(() => (String(route.params.category) as ArticleCategoriesT) || 'all')
const pageParam = computed(() => Number(route.params.page) || 1)

const pageSize = 10 // Number of articles per page

const categoryInfo = {
  'all': {
    title: 'AstronEra Blog',
    description: 'Discover all our articles spanning the wonders and advancements of space.',
  },
  'people-of-space': {
    title: 'People of Space',
    description: 'Meet the trailblazers and visionaries propelling humanity into the cosmos.',
  },
  'space-exploration': {
    title: 'Space Exploration',
    description: 'Embark on thrilling journeys through our latest missions and cosmic discoveries.',
  },
  'dark-sky-conservation': {
    title: 'Dark Sky Conservation',
    description: 'Uncover efforts to preserve our celestial vistas and protect night skies.',
  },
  'sustainable-development': {
    title: 'Sustainable Development',
    description: 'Explore innovations for a sustainable future in space and on Earth.',
  },
}

const { find } = useStrapi()

const {
  data: articlesData,
  pending: articlesLoading,
  error,
} = await useAsyncData(
  `articles-${categoryParam.value}-page-${pageParam.value}`,
  async () => {
    const params: any = {
      pagination: {
        pageSize: pageSize,
        page: pageParam.value,
      },
      populate: {
        cover: true,
        category: true,
        tags: true,
        author: true,
      },
      sort: ['publishedAt:desc'],
    }

    if (categoryParam.value !== 'all') {
      params.filters = {
        category: {
          slug: {
            $eq: categoryParam.value,
          },
        },
      }
    }

    const response = await find('articles', params)
    console.log('Strapi response:', response) // Log the full response
    return response
  },
  { server: true },
)

const articles = computed(() => articlesData.value?.data || [])

const totalPages = computed(() => {
  // If the payload was provided during generate, use it
  if (route.params.payload && route.params.payload.totalPages) {
    return route.params.payload.totalPages
  }
  // Else, calculate based on the meta data
  if (articlesData.value && articlesData.value.meta) {
    return articlesData.value.meta.pagination.pageCount
  }
  return 1
})

const websiteUrl = 'https://astronera.org'

// SEO
// if (categoryParam.value) {
//   useSeoMeta({
//     title: categoryInfo[categoryParam.value].title,
//     ogTitle: categoryInfo[categoryParam.value].title,
//     description: categoryInfo[categoryParam.value].description,
//     ogDescription: categoryInfo[categoryParam.value].description,
//     ogImage: '/images/icons/blog-icon.svg',
//     twitterCard: 'summary_large_image',
//     twitterTitle: categoryInfo[categoryParam.value].title,
//     twitterDescription: categoryInfo[categoryParam.value].description,
//     twitterImage: `${websiteUrl}/images/icons/blog-icon.svg`,
//   })

//   defineOgImageComponent('OgImageDefault', {
//     title: `${categoryParam.value} Articles`,
//     description: categoryInfo[categoryParam.value]?.description,
//     image: './',
//   })
// }

const heroImage = computed(() => {
  let src = `images/blog/${categoryParam.value}/`

  switch (categoryParam.value) {
    case 'people-of-space':
      return (src += '1.20-people-who-influenced-the-space-industry.webp')
    case 'space-exploration':
      return (src += '1.starship-lands-on-mars.webp')
    case 'dark-sky-conservation':
      return (src += '1.landscape-painting-of-dark-skies-and-mountains.webp')
    case 'sustainable-development':
      return (src += '1.sustainable-global-space-development.webp')
    default:
      return (src += 'isro-rocket-launch.png')
  }
})

console.log('articles', articles)
</script>

<template>
  <div>
    <CommonHero
      v-if="categoryParam"
      :img="{
        src: heroImage,
        alt: `AstronEra ${useChangeCase(categoryParam, 'capitalCase').value} Hero Image`,
        width: 1080,
        height: 720,
      }"
      :title="{
        main: categoryInfo[categoryParam].title,
        subtitle: categoryInfo[categoryParam].description,
      }"
      position="center"
      invert
    />
    <div class="wrapper p-4 xl:p-8">
      <BlogFilter />
    </div>
    <div
      class="wrapper relative grid w-full grid-cols-1 items-start md:gap-4 md:px-4 lg:grid-cols-[0.5fr_1fr] lg:gap-8 lg:px-8"
    >
      <BlogAdFloat />

      <div
        v-if="articles"
        class="grid h-full grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-8"
      >
        <BlogCard
          v-for="article in articles"
          :key="`astronera-${categoryParam}-article-${article.id}`"
          :article="article"
        />
        <div
          v-if="!articlesLoading && articles.length === 0"
          class="background flex w-full items-center justify-center border border-primary-500 p-8 md:rounded-md"
        >
          <p class="foreground px-2"> No articles found... </p>
        </div>
        <template v-if="articlesLoading">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </template>
      </div>
    </div>

    <!-- Pagination Component -->
    <Pagination
      :current-page="pageParam"
      :total-pages="totalPages"
      :base-url="`/blog/category/${categoryParam.value}`"
      />
  </div>
</template>
