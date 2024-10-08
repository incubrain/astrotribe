<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
import type { ArticleCardT, ArticleCategoriesT } from '~/types/articles'

const whereOptions: QueryBuilderParams = {
  status: { $eq: 'published' },
}

const route = useRoute()
const categoryParam = computed(() => (String(route.params.category) as ArticleCategoriesT) ?? null)

const { data: articles, pending } = await useFetch('/api/articles', {
  params: {
    category: categoryParam,
    limit: 10,
    skip: 0,
  },
})

const allArticles = ref(articles.value || [])
const articlesFinished = computed(() => allArticles.value.length < 10)
const articlesLoading = ref(pending.value)

// Function to load more articles
const loadMoreArticles = async () => {
  if (articlesFinished.value || articlesLoading.value) return
  articlesLoading.value = true

  const { data: newArticles } = await useFetch('/api/articles', {
    params: {
      category: categoryParam.value,
      limit: 10,
      skip: allArticles.value.length,
    },
  })

  if (newArticles.value) {
    allArticles.value.push(...newArticles.value)
  }

  articlesLoading.value = false
}

const handleInfiniteScroll = async () => {
  await loadMoreArticles()
}

const category = {
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

const websiteUrl = 'https://astronera.org'

// SEO
if (categoryParam.value) {
  useSeoMeta({
    title: 'AstronEra Blog',
    ogTitle: 'AstronEra Blog',
    description: 'AstronEra Blog',
    ogDescription: 'AstronEra Blog',
    ogImage: '/images/icons/blog-icon.svg',
    twitterCard: 'summary_large_image',
    twitterTitle: 'AstronEra Blog',
    twitterDescription: 'AstronEra Blog',
    twitterImage: `${websiteUrl}/images/icons/blog-icon.svg`,
  })

  defineOgImageComponent('OgImageDefault', {
    title: `${categoryParam.value} Articles`,
    description: category[categoryParam.value]?.description,
    image: './',
  })
}

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
        main: category[categoryParam].title,
        subtitle: category[categoryParam].description,
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

      <div class="grid h-full grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-8">
        <BlogCard
          v-for="article in allArticles"
          :key="`astronera-${categoryParam}-article-${article.id}`"
          :article="article"
        />
        <ClientOnly>
          <BlogCardSkeleton v-show="articlesLoading" />
          <BlogCardSkeleton v-show="articlesLoading" />
          <BlogCardSkeleton v-show="articlesLoading" />
          <div
            v-if="articlesFinished"
            class="background flex w-full items-center justify-center border border-primary-500 p-8 md:rounded-md"
          >
            <p class="foreground px-2"> No more articles... </p>
          </div>
          <template #fallback>
            <p>Loading articles...</p>
          </template>
        </ClientOnly>
      </div>
    </div>
    <BlogArticleInfinateScroll
      v-show="!articlesFinished"
      @infinate-trigger="handleInfiniteScroll"
    />
  </div>
</template>

<style></style>
