<!-- page-[number].vue -->
<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'

const route = useRoute()

const cmsURL = String(useRuntimeConfig().public.cmsURL ?? 'http://localhost:1337')
const strapi = useStrapi(cmsURL)

const validCategories = [
  'all',
  'people-of-space',
  'space-exploration',
  'dark-sky-conservation',
  'sustainable-development',
] as const

type ArticleCategoriesT = (typeof validCategories)[number]

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

const { data: pageData, error } = await useAsyncData(
  `articles-${route.params.category}-page-${route.params.number}`,
  () =>
    fetchArticlesFromAPI(String(route.params.category).toLowerCase(), Number(route.params.number)),
  { server: false },
)

if (error) {
  console.error('Error fetching articles:', error)
}

const articles = computed(() => pageData.value?.articles || [])
const totalPages = computed(() => pageData.value?.totalPages || 1)
const categoryParam = computed(() => route.params.category || 'all')
const pageParam = computed(() => pageData.value?.page || 1)

const isValidCategory = computed(() =>
  validCategories.includes(categoryParam.value as ArticleCategoriesT),
)

// Add a watch to handle invalid categories
watch(categoryParam, (newCategory) => {
  if (!validCategories.includes(newCategory as ArticleCategoriesT)) {
    navigateTo('/404')
  }
})

console.log({
  routeParams: route.params,
  category: categoryParam.value,
  pageNum: route.params.number,
})

// Use the pageData in your component

async function fetchArticlesFromAPI(category: ArticleCategoriesT, page: number) {
  console.log('Fetching articles:', category, page)
  const params: any = {
    sort: ['publishedAt:desc'],
    populate: {
      author: { populate: true },
      cover: { populate: true },
      category: { populate: true },
    },
  }

  if (category !== 'all') {
    params.filters = { category: { slug: { $eq: category } } }
  }

  const response = await strapi.find<any>('articles', params)

  // If you need categories and authors separately
  // const categories = await strapi.find<any>('categories');

  console.log('Response:', response)

  return { articles: response.data, totalPages: response.meta.pagination.pageCount, category, page }
}

// old
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
//     twitterImage: `${websiteURL}/images/icons/blog-icon.svg`,
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
      return (src += 'people-of-space.webp')
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
</script>

<template>
  <div>
    <CommonHero
      v-if="categoryParam && categoryInfo[categoryParam as ArticleCategoriesT]"
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
        v-show="articles.length"
        class="grid h-full grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-8"
      >
        <BlogCard
          v-for="article in articles"
          :key="`astronera-${categoryParam}-article-${article.id}`"
          :article="article"
        />
        <div
          v-if="!articles.length"
          class="background flex w-full items-center justify-center border border-primary-500 p-8 md:rounded-md"
        >
          <p class="foreground px-2"> No articles found... </p>
        </div>
        <!-- <template>
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </template> -->
      </div>
    </div>

    <!-- Pagination Component -->
    <Pagination
      :current-page="pageParam"
      :total-pages="totalPages"
      :base-url="`/blog/category-${categoryParam}`"
    />
  </div>
</template>
